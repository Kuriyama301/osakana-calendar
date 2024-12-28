module Api
  module V1
    module Auth
      class OmniauthCallbacksController < ActionController::Base
        protect_from_forgery with: :null_session
        skip_before_action :verify_authenticity_token

        # Google認証のコールバック
        def google_oauth2
          Rails.logger.info "Starting google_oauth2 callback"
          Rails.logger.info "Params: #{params.inspect}"

          begin
            render json: {
              status: 'success',
              message: 'Callback received',
              params: params.to_unsafe_h
            }
          rescue => e
            Rails.logger.error "Error in google_oauth2 callback: #{e.message}"
            Rails.logger.error e.backtrace.join("\n")

            render json: {
              status: 'error',
              message: e.message
            }, status: :internal_server_error
          end
        end
      end
    end
  end
end
