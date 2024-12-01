module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        skip_before_action :verify_authenticity_token
        respond_to :json

        private

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :name)
        end

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              status: :ok,
              message: 'ユーザー登録が完了しました',
              data: { email: resource.email, name: resource.name }
            }
          else
            render json: {
              status: :unprocessable_entity,
              errors: resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
