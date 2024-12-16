module Api
  module V1
    module Auth
      class ConfirmationsController < ApplicationController
        include ActionController::MimeResponds

        def show
          params[:confirmation_token] = params[:token] if params[:token].present?

          user = User.find_by(confirmation_token: params[:confirmation_token])

          if user.nil?
            render json: {
              status: 'error',
              message: 'このトークンは無効です',
              error_code: 'invalid_token'
            }, status: :unprocessable_entity
            return
          end

          if user.confirmed?
            render json: {
              status: 'error',
              message: 'このメールアドレスは既に確認済みです',
              error_code: 'already_confirmed'
            }, status: :unprocessable_entity
            return
          end

          if user.confirm
            render json: {
              status: 'success',
              message: 'メールアドレスの確認が完了しました',
              data: {
                email: user.email,
                confirmed: true
              }
            }, status: :ok
          else
            render json: {
              status: 'error',
              message: 'メールアドレスの確認に失敗しました',
              errors: user.errors.full_messages,
              error_code: 'confirmation_failed'
            }, status: :unprocessable_entity
          end
        rescue StandardError => e
          Rails.logger.error "Confirmation error: #{e.message}"
          render json: {
            status: 'error',
            message: '予期せぬエラーが発生しました',
            error_code: 'system_error'
          }, status: :internal_server_error
        end

        private

        def resource_params
          params.require(:user).permit(:email)
        end
      end
    end
  end
end
