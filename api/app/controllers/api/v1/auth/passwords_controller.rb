module Api
  module V1
    module Auth
      class PasswordsController < Devise::PasswordsController
        respond_to :json

        # POST /resource/password
        def create
          self.resource = resource_class.send_reset_password_instructions(resource_params)

          if successfully_sent?(resource)
            render json: {
              status: { code: 200, message: 'パスワードリセット用のメールを送信しました' }
            }
          else
            render json: {
              status: { code: 422, message: resource.errors.full_messages.join(', ') }
            }, status: :unprocessable_entity
          end
        end

        # PUT /resource/password
        def update
          self.resource = resource_class.reset_password_by_token(resource_params)

          if resource.errors.empty?
            render json: {
              status: { code: 200, message: 'パスワードを更新しました' }
            }
          else
            render json: {
              status: { code: 422, message: resource.errors.full_messages.join(', ') }
            }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
