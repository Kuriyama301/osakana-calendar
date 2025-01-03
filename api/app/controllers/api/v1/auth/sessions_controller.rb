module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json
        skip_before_action :verify_signed_out_user
        before_action :configure_sign_in_params, only: [:create]

        def create
          Rails.logger.info "ログイン試行パラメータ: #{params.inspect}"

          # ユーザー認証を試みる
          user = User.find_by(email: sign_in_params[:email])

          if user&.valid_password?(sign_in_params[:password])
            sign_in(resource_name, user)
            token = generate_jwt_token(user)

            render json: {
              status: 'success',
              message: 'ログインしました',
              data: UserSerializer.new(user).serializable_hash,
              token: token
            }, status: :ok
          else
            render json: {
              status: 'error',
              message: 'ログインに失敗しました'
            }, status: :unauthorized
          end
        end

        def destroy
          token = request.headers['Authorization']&.split(' ')&.last

          if token.present?
            begin
              jwt_payload = decode_jwt_token(token)
              user = User.find_by(id: jwt_payload['sub'])

              if user
                # JWTトークンをブラックリストに追加
                JwtDenylist.find_or_create_by!(jti: jwt_payload['jti']) do |record|
                  record.exp = Time.at(jwt_payload['exp'])
                end

                # Deviseのログアウト処理
                sign_out(user)

                render json: {
                  status: 'success',
                  message: 'ログアウトしました'
                }, status: :ok
              else
                render json: {
                  status: 'error',
                  message: 'ユーザーが見つかりません'
                }, status: :not_found
              end
            rescue JWT::DecodeError => e
              Rails.logger.error "JWT decode error: #{e.message}"
              render json: {
                status: 'error',
                message: e.message
              }, status: :unauthorized
            rescue ActiveRecord::RecordNotUnique
              # トークンが既にブラックリストに存在する場合
              render json: {
                status: 'success',
                message: 'ログアウトしました'
              }, status: :ok
            rescue StandardError => e
              Rails.logger.error "Unexpected error: #{e.message}"
              render json: {
                status: 'error',
                message: 'ログアウト処理中にエラーが発生しました'
              }, status: :internal_server_error
            end
          else
            render json: {
              status: 'error',
              message: 'トークンが提供されていません'
            }, status: :unauthorized
          end
        end

        private

        def sign_in_params
          params.require(:user).permit(:email, :password)
        end

        def configure_sign_in_params
          devise_parameter_sanitizer.permit(:sign_in, keys: [:email])
        end

        def user_params
          params.require(:user).permit(:email, :password)
        end

        def auth_options
          { scope: resource_name, recall: "#{controller_path}#create" }
        end

        def generate_jwt_token(resource)
          JWT.encode(
            {
              sub: resource.id,
              exp: (Time.now + ENV.fetch('DEVISE_JWT_EXPIRATION_TIME', 24.hours).to_i).to_i,
              jti: SecureRandom.uuid,
              iat: Time.now.to_i
            },
            ENV['DEVISE_JWT_SECRET_KEY'],
            'HS256'
          )
        end

        def decode_jwt_token(token)
          JWT.decode(token, ENV['DEVISE_JWT_SECRET_KEY'], true, algorithm: 'HS256').first
        rescue JWT::ExpiredSignature
          raise JWT::DecodeError, 'トークンが期限切れです'
        rescue JWT::DecodeError
          raise JWT::DecodeError, '無効なトークンです'
        end
      end
    end
  end
end
