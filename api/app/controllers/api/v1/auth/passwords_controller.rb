module Api
  module V1
    module Auth
      class PasswordsController < Devise::PasswordsController
        respond_to :json

        def create
          self.resource = resource_class.send_reset_password_instructions(resource_params)

          if successfully_sent?(resource)
            render json: {
              message: 'パスワードリセット用のメールを送信しました'
            }, status: :ok
          else
            render json: {
              message: 'メール送信に失敗しました',
              errors: resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        private

        def resource_params
          params.require(:user).permit(:email)
        end
      end
    end
  end
end
