# frozen_string_literal: true

module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json
        before_action :configure_sign_up_params, only: [:create]
        before_action :authenticate_user!, only: [:destroy]

        def create
          build_resource(sign_up_params)
          resource.save
          yield resource if block_given?
          if resource.persisted?
            handle_successful_registration(resource)
          else
            handle_failed_registration(resource)
          end
        end

        def destroy
          Rails.logger.debug "Destroying account for user ID: #{current_api_v1_user&.id}"
          if current_api_v1_user.nil?
            return render json: { error: "ユーザーが見つかりません" }, status: :unauthorized
          end
          if current_api_v1_user.destroy
            render json: { status: 'success', message: 'アカウントが削除されました' }, status: :ok
          else
            render json: { status: 'error', message: 'アカウントの削除に失敗しました' }, status: :unprocessable_entity
          end
        end

        private

        def configure_sign_up_params
          devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
        end

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :name)
        end

        def respond_with(resource, _opts = {})
          if resource.persisted?
            handle_successful_registration(resource)
          else
            handle_failed_registration(resource)
          end
        end

        def handle_successful_registration(resource)
          render json: {
            status: 'success',
            message: '登録確認メールを送信しました',
            data: UserSerializer.new(resource).serializable_hash
          }, status: :created
        end

        def handle_failed_registration(resource)
          render json: {
            status: 'error',
            message: '登録に失敗しました',
            errors: format_error_messages(resource.errors)
          }, status: :unprocessable_entity
        end

        protected

        def resource_name
          :api_v1_user
        end

        def authenticate_scope!
          send("authenticate_#{resource_name}!")
        end

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
