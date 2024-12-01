module Api
  module V1
    module Auth
      class PasswordsController < Devise::PasswordsController
        respond_to :json

        # パスワードリセットメール送信時のレスポンス
        def respond_with(resource, _opts = {})
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
      end
    end
  end
end
