# frozen_string_literal: true

module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json
        skip_before_action :verify_signed_out_user
        before_action :configure_sign_in_params, only: [:create]

        def create
          Rails.logger.info "ログイン試行パラメータ: #{params.inspect}"
          authenticate_user_and_respond
        end

        def destroy
          token = extract_token_from_header
          handle_logout(token)
        end

        private

        def authenticate_user_and_respond
          user = User.find_by(email: sign_in_params[:email])

          if user&.valid_password?(sign_in_params[:password])
            handle_successful_login(user)
          else
            render_error('ログインに失敗しました', :unauthorized)
          end
        end

        def handle_successful_login(user)
          sign_in(resource_name, user)
          token = user.generate_jwt

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

        def extract_token_from_header
          token = request.headers['Authorization']&.split&.last
          return token if token.present?

          render_error('トークンが提供されていません', :unauthorized)
          nil
        end

        def handle_logout(token)
          return unless token

          begin
            jwt_payload = decode_jwt_token(token)
            process_logout(jwt_payload)
          rescue JWT::DecodeError => e
            handle_jwt_error(e)
          rescue ActiveRecord::RecordNotUnique
            render_success('ログアウトしました')
          rescue StandardError => e
            handle_unexpected_error(e)
          end
        end

        def process_logout(jwt_payload)
          user = User.find_by(id: jwt_payload['sub'])
          if user
            blacklist_token(jwt_payload)
            sign_out(user)
            render_success('ログアウトしました')
          else
            render_error('ユーザーが見つかりません', :not_found)
          end
        end

        def blacklist_token(jwt_payload)
          JwtDenylist.find_or_create_by!(jti: jwt_payload['jti']) do |record|
            record.exp = Time.zone.at(jwt_payload['exp'])
          end
        end

        def handle_jwt_error(error)
          Rails.logger.error "JWT decode error: #{error.message}"
          render_error(error.message, :unauthorized)
        end

        def handle_unexpected_error(error)
          Rails.logger.error "Unexpected error: #{error.message}"
          render_error('ログアウト処理中にエラーが発生しました', :internal_server_error)
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

        def sign_in_params
          params.require(:user).permit(:email, :password)
        end

        def configure_sign_in_params
          devise_parameter_sanitizer.permit(:sign_in, keys: [:email])
        end

        def auth_options
          { scope: resource_name, recall: "#{controller_path}#create" }
        end

        def generate_jwt_token(resource)
          JWT.encode(
            {
              sub: resource.id,
              exp: (Time.zone.now + ENV.fetch('DEVISE_JWT_EXPIRATION_TIME', 24.hours).to_i).to_i,
              jti: SecureRandom.uuid,
              iat: Time.zone.now.to_i
            },
            ENV.fetch('DEVISE_JWT_SECRET_KEY', nil),
            'HS256'
          )
        end

        def decode_jwt_token(token)
          JWT.decode(token, ENV.fetch('DEVISE_JWT_SECRET_KEY', nil), true, algorithm: 'HS256').first
        rescue JWT::ExpiredSignature
          raise JWT::DecodeError, 'トークンが期限切れです'
        rescue JWT::DecodeError
          raise JWT::DecodeError, '無効なトークンです'
        end
      end
    end
  end
end
