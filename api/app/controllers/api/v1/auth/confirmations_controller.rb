module Api
  module V1
    module Auth
      class ConfirmationsController < Devise::ConfirmationsController
        respond_to :json

        def show
          self.resource = resource_class.confirm_by_token(params[:confirmation_token])

          if resource.errors.empty?
            render json: { message: 'メールアドレスが確認されました' }, status: :ok
          else
            render json: {
              message: '確認に失敗しました',
              errors: resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def create
          self.resource = resource_class.send_confirmation_instructions(resource_params)

          if successfully_sent?(resource)
            render json: { message: '確認メールを再送信しました' }, status: :ok
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
