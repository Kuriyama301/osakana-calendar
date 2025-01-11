# frozen_string_literal: true

module Api
  module V1
    module Auth
      class ConfirmationsController < ApplicationController
        include ActionController::MimeResponds

        def show
          params[:confirmation_token] = params[:token] if params[:token].present?
          user = find_user_by_token
          handle_confirmation(user)
        rescue StandardError => e
          handle_unexpected_error(e)
        end

        private

        def find_user_by_token
          user = User.find_by(confirmation_token: params[:confirmation_token])
          return user if user.present?

          render_error(
            'このトークンは無効です',
            'invalid_token',
            :unprocessable_entity
          )
          nil
        end

        def handle_confirmation(user)
          return unless user

          if user.confirmed?
            handle_already_confirmed
          elsif user.confirm
            handle_successful_confirmation(user)
          else
            handle_failed_confirmation(user)
          end
        end

        def handle_already_confirmed
          render_error(
            'このメールアドレスは既に確認済みです',
            'already_confirmed',
            :unprocessable_entity
          )
        end

        def handle_successful_confirmation(user)
          render json: {
            status: 'success',
            message: 'メールアドレスの確認が完了しました',
            data: {
              email: user.email,
              confirmed: true
            }
          }, status: :ok
        end

        def handle_failed_confirmation(user)
          render_error(
            'メールアドレスの確認に失敗しました',
            'confirmation_failed',
            :unprocessable_entity,
            user.errors.full_messages
          )
        end

        def handle_unexpected_error(error)
          Rails.logger.error "Confirmation error: #{error.message}"
          render_error(
            '予期せぬエラーが発生しました',
            'system_error',
            :internal_server_error
          )
        end

        def render_error(message, error_code, status, errors = nil)
          response = {
            status: 'error',
            message: message,
            error_code: error_code
          }
          response[:errors] = errors if errors.present?

          render json: response, status: status
        end

        def resource_params
          params.require(:user).permit(:email)
        end
      end
    end
  end
end
