module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        # JSONリクエストのみを受け付ける
        respond_to :json

        private

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :name)
        end

        def account_update_params
          params.require(:user).permit(:email, :password, :password_confirmation, :name, :current_password)
        end

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              status: { code: 200, message: '登録に成功しました' },
              data: { user: resource }
            }
          else
            render json: {
              status: { message: resource.errors.full_messages.join(', ') }
            }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
