module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        include ActionController::Cookies
        respond_to :json
        skip_before_action :verify_signed_out_user, only: [:destroy]

        def create
          self.resource = warden.authenticate!(auth_options)
          sign_in(resource_name, resource)
          respond_with(resource)
        end

        private

        def respond_with(resource, _opts = {})
          if resource.persisted? && resource.confirmed?
            render json: {
              status: 'success',
              message: 'ログインしました',
              data: UserSerializer.new(resource).serializable_hash,
              token: request.env['warden-jwt_auth.token']
            }, status: :ok
          else
            render json: {
              status: 'error',
              message: resource.confirmed? ? 'メールアドレスまたはパスワードが正しくありません' : 'メールアドレスの確認が必要です'
            }, status: :unauthorized
          end
        end

        def respond_to_on_destroy
          if current_user
            render json: {
              status: 'success',
              message: 'ログアウトしました'
            }, status: :ok
          else
            render json: {
              status: 'error',
              message: '認証エラーが発生しました'
            }, status: :unauthorized
          end
        end

        protected

        def auth_options
          { scope: resource_name, recall: "#{controller_path}#new" }
        end
      end
    end
  end
end
