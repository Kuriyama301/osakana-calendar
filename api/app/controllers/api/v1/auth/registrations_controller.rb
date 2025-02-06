# frozen_string_literal: true

module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json
        before_action :configure_sign_up_params, only: [:create]
        before_action :authenticate_user!, only: [:destroy]
        before_action :verify_user_and_token, only: [:destroy]

        def create
          Rails.logger.info "アカウント登録開始: #{sign_up_params.except('password', 'password_confirmation')}"
          build_resource(sign_up_params)
          resource.save
          yield resource if block_given?

          if resource.persisted?
            handle_successful_registration(resource)
          else
            handle_failed_registration(resource)
          end
        end

        def destroy
          Rails.logger.info "アカウント削除開始: ユーザーID #{@current_user.id}"

          begin
            ActiveRecord::Base.transaction do
              # トークンのブラックリスト登録
              blacklist_token(@auth_token)

              # ユーザーの削除処理
              if @current_user.destroy
                # Deviseのサインアウト処理
                sign_out(@current_user)
                Rails.logger.info "ユーザーID #{@current_user.id} のアカウントが正常に削除されました"
                render_success('アカウントが削除されました')
              else
                raise ActiveRecord::Rollback, 'アカウントの削除に失敗しました'
              end
            end
          rescue StandardError => e
            Rails.logger.error "Account deletion error: #{e.message}"
            Rails.logger.error e.backtrace.join("\n")

            error_message = if e.message == 'アカウントの削除に失敗しました'
              {
                message: e.message,
                errors: @current_user.errors.full_messages
              }
            else
              { message: 'アカウントの削除中にエラーが発生しました' }
            end

            render_error(error_message, :internal_server_error)
          end
        end

        private

        def verify_user_and_token
          @current_user = current_api_v1_user
          unless @current_user
            render_error({ message: 'ユーザーが見つかりません' }, :unauthorized)
            return false
          end

          @auth_token = extract_token_from_header
          unless @auth_token
            render_error({ message: '認証トークンが見つかりません' }, :unauthorized)
            return false
          end

          begin
            decode_jwt_token(@auth_token)
          rescue JWT::DecodeError => e
            Rails.logger.error "JWT decode error during verification: #{e.message}"
            render_error({ message: '無効なトークンです' }, :unauthorized)
            return false
          end

          true
        end

        def extract_token_from_header
          auth_header = request.headers['Authorization']
          return nil unless auth_header
          return nil unless auth_header.start_with?('Bearer ')

          auth_header.split(' ').last
        end

        def blacklist_token(token)
          jwt_payload = decode_jwt_token(token)
          JwtDenylist.create!(
            jti: jwt_payload['jti'],
            exp: Time.at(jwt_payload['exp'])
          )
          Rails.logger.info "Token blacklisted: #{jwt_payload['jti']}"
        rescue ActiveRecord::RecordNotUnique => e
          Rails.logger.warn "Token already blacklisted: #{e.message}"
          # トークンが既にブラックリストにある場合は正常なフロー
          true
        end

        def decode_jwt_token(token)
          JWT.decode(
            token,
            ENV.fetch('DEVISE_JWT_SECRET_KEY'),
            true,
            { algorithm: 'HS256' }
          ).first
        rescue JWT::DecodeError => e
          Rails.logger.error "JWT decode error: #{e.message}"
          raise
        end

        def configure_sign_up_params
          devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
        end

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :name)
        end

        def handle_successful_registration(resource)
          Rails.logger.info "アカウント登録成功: ユーザーID #{resource.id}"
          render json: {
            status: 'success',
            message: '登録確認メールを送信しました',
            data: UserSerializer.new(resource).serializable_hash
          }, status: :created
        end

        def handle_failed_registration(resource)
          Rails.logger.warn "アカウント登録失敗: #{resource.errors.full_messages}"
          render json: {
            status: 'error',
            message: '登録に失敗しました',
            errors: format_error_messages(resource.errors)
          }, status: :unprocessable_entity
        end

        def format_error_messages(errors)
          errors.full_messages.map do |message|
            {
              detail: message,
              source: get_error_source(message)
            }
          end
        end

        def get_error_source(message)
          case message
          when /Email/i
            'email'
          when /Password/i
            'password'
          when /Name/i
            'name'
          else
            'other'
          end
        end

        def resource_name
          :api_v1_user
        end

        def authenticate_scope!
          send(:"authenticate_#{resource_name}!")
        end

        def render_success(message)
          render json: {
            status: 'success',
            message: message
          }, status: :ok
        end

        def render_error(error_details, status)
          response = {
            status: 'error'
          }.merge(error_details.is_a?(String) ? { message: error_details } : error_details)

          render json: response, status: status
        end
      end
    end
  end
end
