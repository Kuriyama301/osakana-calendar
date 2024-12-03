module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              message: 'ユーザー登録が完了しました',
              user: resource
            }, status: :created
          else
            render json: {
              message: '登録に失敗しました',
              errors: resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :name)
        end
      end
    end
  end
end
