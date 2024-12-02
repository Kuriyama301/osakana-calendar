module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        private

        def respond_to_on_create
          render json: {
            message: 'ログインしました',
            user: current_user
          }, status: :ok
        end

        def respond_to_on_destroy
          render json: {
            message: 'ログアウトしました'
          }, status: :ok
        end
      end
    end
  end
end
