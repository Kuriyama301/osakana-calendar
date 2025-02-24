# frozen_string_literal: true

# ユーザー登録・削除機能のコントローラー
# アカウントの新規作成と削除、確認メールの送信を処理する
# POST /api/v1/auth (アカウント登録)
# DELETE /api/v1/auth (アカウント削除)
# フロントエンド連携: RegisterSection.jsx, DeleteAccountModal.jsxからのリクエストを処理

module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        include ActionController::MimeResponds
        include ActionController::RequestForgeryProtection

        protect_from_forgery with: :null_session
        respond_to :json
        before_action :configure_sign_up_params, only: [:create]
        before_action :authenticate_user!, only: [:destroy]

        # ユーザーアカウントの新規登録
        # @param [Hash] sign_up_params 登録用パラメータ（email, password, name）
        # @return [JSON] 登録結果と確認メール送信状態
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

        # ユーザーアカウントの削除
        # @return [JSON] 削除処理の結果
        def destroy
          Rails.logger.info "アカウント削除開始: ユーザーID #{current_user.id}"

          begin
            ActiveRecord::Base.transaction do
              # トークンの取得と検証
              jwt_payload = decode_jwt_token(extract_token_from_header)
              blacklist_token(jwt_payload) if jwt_payload

              # ユーザーの削除処理
              if current_user.destroy
                sign_out(current_user)
                Rails.logger.info "ユーザーID #{current_user.id} のアカウントが正常に削除されました"
                render json: {
                  status: 'success',
                  message: 'アカウントが削除されました'
                }, status: :ok
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
                errors: current_user.errors.full_messages
              }
            else
              { message: 'アカウントの削除中にエラーが発生しました' }
            end

            render json: {
              status: 'error',
              message: error_message
            }, status: :unprocessable_entity
          end
        end

        private

        # JWTトークンをヘッダーから抽出
        def extract_token_from_header
          request.headers['Authorization']&.split(' ')&.last
        end

        # JWTトークンのデコードと検証
        def decode_jwt_token(token)
          return nil unless token
          JWT.decode(
            token,
            ENV.fetch('DEVISE_JWT_SECRET_KEY'),
            true,
            { algorithm: 'HS256' }
          ).first
        rescue JWT::DecodeError => e
          Rails.logger.error "JWT decode error: #{e.message}"
          nil
        end

        # トークンのブラックリスト登録
        def blacklist_token(payload)
          return unless payload&.dig('jti')
          JwtDenylist.create!(
            jti: payload['jti'],
            exp: Time.at(payload['exp'])
          )
          Rails.logger.info "Token blacklisted: #{payload['jti']}"
        rescue ActiveRecord::RecordNotUnique => e
          Rails.logger.warn "Token already blacklisted: #{e.message}"
        end

        # サインアップパラメータの設定
        def configure_sign_up_params
          devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
        end

        # 許可されたパラメータの定義
        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :name)
        end

        # 登録成功時の処理
        def handle_successful_registration(resource)
          Rails.logger.info "アカウント登録成功: ユーザーID #{resource.id}"
          render json: {
            status: 'success',
            message: '登録確認メールを送信しました',
            data: UserSerializer.new(resource).serializable_hash
          }, status: :created
        end

        # 登録失敗時の処理
        def handle_failed_registration(resource)
          Rails.logger.warn "アカウント登録失敗: #{resource.errors.full_messages}"
          render json: {
            status: 'error',
            message: '登録に失敗しました',
            errors: format_error_messages(resource.errors)
          }, status: :unprocessable_entity
        end

        # エラーメッセージのフォーマット
        def format_error_messages(errors)
          errors.full_messages.map do |message|
            {
              detail: message,
              source: get_error_source(message)
            }
          end
        end

        # エラーソースの判定
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

        protected

        def resource_name
          :user
        end

        def authenticate_scope!
          self.resource = send(:"current_#{resource_name}")
        end
      end
    end
  end
end
