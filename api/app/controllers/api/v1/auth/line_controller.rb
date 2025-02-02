# frozen_string_literal: true

module Api
  module V1
    module Auth
      class LineController < OmniauthCallbacksController
        def callback
          begin
            code = params[:code]
            # アクセストークンを取得
            token_response = fetch_line_token(code)
            # IDトークンからユーザー情報を取得
            user_info = fetch_line_user_info(token_response['id_token'])
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
        end

        private

        def fetch_line_token(code)
          uri = URI('https://api.line.me/oauth2/v2.1/token')
          http = Net::HTTP.new(uri.host, uri.port)
          http.use_ssl = true

          request = Net::HTTP::Post.new(uri)
          request.set_form_data({
            'grant_type' => 'authorization_code',
            'code' => code,
            'redirect_uri' => ENV['LINE_CALLBACK_URL'],
            'client_id' => ENV['LINE_CHANNEL_ID'],
            'client_secret' => ENV['LINE_CHANNEL_SECRET']
          })

          response = http.request(request)
          JSON.parse(response.body)
        end

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
          redirect_url = "#{ENV['VITE_FRONT_URL']}?token=#{token}"
          redirect_to redirect_url
        end

        def handle_failed_authentication
          error_url = "#{ENV['VITE_FRONT_URL']}?error=authentication_failed"
          redirect_to error_url
        end

        def handle_error(error)
          Rails.logger.error "LINE Auth Error: #{error.class}: #{error.message}"
          Rails.logger.error error.backtrace.join("\n")

          error_url = "#{ENV['VITE_FRONT_URL']}?error=#{URI.encode_www_form_component(error.message)}"
          redirect_to error_url
        end
      end
    end
  end
end
