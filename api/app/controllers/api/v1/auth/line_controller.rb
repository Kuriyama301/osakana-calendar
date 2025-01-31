# frozen_string_literal: true

module Api
  module V1
    module Auth
      class LineController < OmniauthCallbacksController
        def callback
          id_token = params[:id_token]
          user_info = fetch_line_user_info(id_token)
          @user = find_or_create_user(user_info)

          if @user&.persisted?
            sign_in @user
            handle_successful_authentication
          else
            handle_failed_authentication
          end
        rescue StandardError => e
          handle_error(e)
        end

        private

        def fetch_line_user_info(id_token)
          jwt_payload = JWT.decode(
            id_token,
            ENV.fetch('LINE_CHANNEL_SECRET', nil),
            true,
            algorithm: 'HS256'
          ).first

          {
            'uid' => jwt_payload['sub'],
            'name' => jwt_payload['name'],
            'picture' => jwt_payload['picture'],
            'email' => jwt_payload['email']
          }
        end

        def find_or_create_user(user_info)
          user = User.find_or_initialize_by(
            provider: 'line',
            uid: user_info['uid']
          )

          unless user.persisted?
            user.assign_attributes(
              email: user_info['email'],
              name: user_info['name'],
              password: Devise.friendly_token[0, 20],
              profile_image_url: user_info['picture'],
              confirmed_at: Time.current
            )
            user.save
          end

          user
        end

        def handle_successful_authentication
          token = @user.generate_jwt
          render json: {
            status: 'success',
            message: 'Successfully authenticated with LINE',
            data: UserSerializer.new(@user).serializable_hash,
            token: token
          }
        end

        def handle_failed_authentication
          render json: {
            status: 'error',
            message: 'Failed to authenticate user',
            errors: @user&.errors&.full_messages || ['Authentication failed']
          }, status: :unprocessable_entity
        end

        def handle_error(error)
          Rails.logger.error "LINE Auth Error: #{error.class}: #{error.message}"
          Rails.logger.error error.backtrace.join("\n")

          render json: {
            status: 'error',
            message: 'Authentication failed',
            error: error.message
          }, status: :internal_server_error
        end
      end
    end
  end
end
