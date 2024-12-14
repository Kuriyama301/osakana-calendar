module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json
        before_action :configure_sign_up_params, only: [:create]

        private

        def configure_sign_up_params
          devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
        end

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :name)
        end

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              status: 'success',
              message: '登録確認メールを送信しました',
              data: UserSerializer.new(resource).serializable_hash
            }, status: :created
          else
            render json: {
              status: 'error',
              message: '登録に失敗しました',
              errors: format_error_messages(resource.errors)
            }, status: :unprocessable_entity
          end
        end

        protected

        def format_error_messages(errors)
          errors.full_messages.map do |message|
            {
              detail: message,
              source: get_error_source(message)
            }
          end
        end

        def get_error_source(message)
          case message
          when /Email/i
            'email'
          when /Password/i
            'password'
          when /Name/i
            'name'
          else
            'other'
          end
        end
      end
    end
  end
end
