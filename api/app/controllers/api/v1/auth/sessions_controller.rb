# frozen_string_literal: true

module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json
        skip_before_action :verify_signed_out_user
        before_action :configure_sign_in_params, only: [:create]
        before_action :verify_user_and_token, only: [:destroy]

        def create
          Rails.logger.info "ログイン試行パラメータ: #{params.inspect}"
          authenticate_user_and_respond
        end

        def destroy
          Rails.logger.info "ログアウト処理開始: user_id=#{@current_user&.id}"

          begin
            invalidate_current_token
            perform_sign_out
            render_success('ログアウトしました')
          rescue StandardError => e
            Rails.logger.error "Logout error: #{e.class} - #{e.message}"
            Rails.logger.error e.backtrace.join("\n")
            render_error('ログアウト処理中にエラーが発生しました', :internal_server_error)
          end
        end

        private

        def verify_user_and_token
          token = extract_token_from_header
          return render_error('トークンが見つかりません', :unauthorized) unless token

          begin
            @token_payload = decode_jwt_token(token)
            @current_user = User.find(@token_payload['sub'])

            Rails.logger.info "Token verification successful: user=#{@current_user.id}, jti=#{@token_payload['jti']}"
            true
          rescue JWT::DecodeError => e
            Rails.logger.error "Token decode error: #{e.message}"
            render_error('無効なトークンです', :unauthorized)
            false
          rescue ActiveRecord::RecordNotFound => e
            Rails.logger.error "User not found: #{e.message}"
            render_error('ユーザーが見つかりません', :unauthorized)
            false
          end
        end

        def decode_and_verify_token(token)
          @token_payload = decode_jwt_token(token)
          true
        rescue JWT::DecodeError => e
          Rails.logger.error "トークン検証エラー: #{e.message}"
          render_error('無効なトークンです', :unauthorized)
          false
        end

        def invalidate_current_token
          return unless @token_payload

          JwtDenylist.create!(
            jti: @token_payload['jti'],
            exp: Time.at(@token_payload['exp'])
          )
          Rails.logger.info "Token blacklisted: #{@token_payload['jti']}"
        end

        def perform_sign_out
          if Devise.sign_out_all_scopes
            sign_out
            Rails.logger.info "全スコープからサインアウトしました"
          else
            sign_out(resource_name)
            Rails.logger.info "ユーザー #{@current_user.id} をサインアウトしました"
          end
        end

        def authenticate_user_and_respond
          user = User.find_by(email: sign_in_params[:email])

          if user&.valid_password?(sign_in_params[:password])
            handle_successful_login(user)
          else
            render_error('メールアドレスまたはパスワードが正しくありません', :unauthorized)
          end
        end

        def handle_successful_login(user)
          sign_in(resource_name, user)
          token = generate_jwt_token(user)

          Rails.logger.info "ユーザー #{user.id} のログインが完了しました"

          render json: {
            status: 'success',
            message: 'ログインしました',
            data: {
              data: {
                attributes: {
                  id: user.id,
                  email: user.email,
                  name: user.name
                }
              }
            },
            token: token
          }, status: :ok
        end

        def generate_jwt_token(resource)
          JWT.encode(
            {
              sub: resource.id,
              exp: (Time.zone.now + ENV.fetch('DEVISE_JWT_EXPIRATION_TIME', 24.hours).to_i).to_i,
              jti: SecureRandom.uuid,
              iat: Time.zone.now.to_i
            },
            ENV.fetch('DEVISE_JWT_SECRET_KEY'),
            'HS256'
          )
        rescue StandardError => e
          Rails.logger.error "JWT generation error: #{e.message}"
          raise
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

        def extract_token_from_header
          auth_header = request.headers['Authorization']
          return nil unless auth_header&.start_with?('Bearer ')

          auth_header.split(' ').last
        end

        def sign_in_params
          params.require(:user).permit(:email, :password)
        end

        def configure_sign_in_params
          devise_parameter_sanitizer.permit(:sign_in, keys: [:email])
        end

        def resource_name
          :api_v1_user
        end

        def render_success(message)
          render json: {
            status: 'success',
            message: message
          }, status: :ok
        end

        def render_error(message, status)
          render json: {
            status: 'error',
            message: message
          }, status: status
        end
      end
    end
  end
end
