module Api
  module V1
    module Auth
      class OmniauthCallbacksController < ActionController::Base
        protect_from_forgery with: :null_session
        skip_before_action :verify_authenticity_token

        # Google認証のコールバック
        def google_oauth2
          Rails.logger.info "Starting google_oauth2 callback"

          begin
            access_token = params[:credential]

            # Google APIを通じてユーザー情報を取得
            auth_uri = URI("https://www.googleapis.com/oauth2/v3/userinfo")
            auth_uri.query = URI.encode_www_form({ access_token: access_token })

            response = Net::HTTP.get_response(auth_uri)
            user_info = JSON.parse(response.body)

            @user = User.find_or_initialize_by(email: user_info['email']) do |user|
              user.provider = 'google_oauth2'
              user.uid = user_info['sub']
              user.name = user_info['name']
              user.password = Devise.friendly_token[0, 20]
              user.confirmed_at = Time.current
            end

            if @user.save
              token = @user.generate_jwt

              render json: {
                status: 'success',
                message: 'Successfully authenticated with Google',
                data: @user.as_json(only: [:id, :email, :name]),
                token: token
              }
            else
              render json: {
                status: 'error',
                message: 'Failed to authenticate user',
                errors: @user.errors.full_messages
              }, status: :unprocessable_entity
            end
          rescue => e
            Rails.logger.error "Error in google_oauth2 callback: #{e.message}"
            Rails.logger.error e.backtrace.join("\n")

            render json: {
              status: 'error',
              message: 'Authentication failed'
            }, status: :internal_server_error
          end
        end

        private

        def after_omniauth_failure_path_for(_scope)
          '/auth/failure'
        end
      end
    end
  end
end