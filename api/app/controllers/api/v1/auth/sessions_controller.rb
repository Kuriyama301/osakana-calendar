module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        private

        def respond_to_on_authenticate
          self.resource = warden.authenticate!(auth_options)
          sign_in(resource_name, resource)
          render json: {
            message: 'ログインしました',
            user: UserSerializer.new(current_user).serializable_hash
          }, status: :ok
        end

        def respond_to_on_authentication_failure
          render json: {
            error: 'メールアドレスまたはパスワードが正しくありません'
          }, status: :unauthorized
        end
      end
    end
  end
end
