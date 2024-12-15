module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json
        skip_before_action :verify_signed_out_user

        def create
          Rails.logger.info "ログイン試行パラメータ: #{params.inspect}"

          self.resource = warden.authenticate!(auth_options)

          if resource && resource.confirmed?
            sign_in(resource_name, resource)
            token = generate_jwt_token(resource)
            Rails.logger.info "生成されたトークン: #{token}"

            render json: {
              status: 'success',
              message: 'ログインしました',
              data: UserSerializer.new(resource).serializable_hash,
              token: token
            }, status: :ok
          else
            render json: {
              status: 'error',
              message: 'ログインに失敗しました'
            }, status: :unauthorized
          end
        end

        private

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
      end
    end
  end
end
