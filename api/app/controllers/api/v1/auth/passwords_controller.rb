module Api
  module V1
    module Auth
      class PasswordsController < Devise::PasswordsController
        skip_before_action :verify_authenticity_token
        respond_to :json

        def create
          self.resource = resource_class.send_reset_password_instructions(resource_params)

          if successfully_sent?(resource)
            render json: { status: :ok, message: 'パスワードリセット用のメールを送信しました' }
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
