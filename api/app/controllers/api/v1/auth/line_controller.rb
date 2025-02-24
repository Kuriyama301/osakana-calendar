# frozen_string_literal: true

# LINE OAuth認証のコントローラー
# LINEログイン認証のコールバックを処理し、ユーザー認証を行う
# リクエスト形式: GET /api/v1/auth/line/callback?code=xxx
# フロントエンド連携: LineCallbackPage.jsxでの認証フローを処理

module Api
  module V1
    module Auth
      class LineController < OmniauthCallbacksController
        # LINE認証コールバックの処理
        # @param [String] code LINEから受け取った認証コード
        # @return [Redirect] 認証結果に応じてフロントエンドにリダイレクト
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

        # LINEアクセストークンの取得
        # @param [String] code 認証コード
        # @return [Hash] トークンレスポンス
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

        # LINEユーザー情報の取得と解析
        # @param [String] id_token LINEから取得したIDトークン
        # @return [Hash] ユーザー情報
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

        # ユーザーの検索または作成
        # @param [Hash] user_info LINEから取得したユーザー情報
        # @return [User] 作成または検索されたユーザー
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

        # 認証成功時の処理
        # フロントエンドにトークンとユーザー情報を渡してリダイレクト
        def handle_successful_authentication
          token = @user.generate_jwt
          user_data = UserSerializer.new(@user).serializable_hash

          # トークンとユーザー情報をクエリパラメータとして渡す
          redirect_url = "#{ENV['FRONTEND_URL']}?token=#{token}&auth_success=true&user_data=#{URI.encode_www_form_component(user_data.to_json)}"
          redirect_to redirect_url, allow_other_host: true
        end

        # 認証失敗時の処理
        # フロントエンドにエラー情報を渡してリダイレクト
        def handle_failed_authentication
          error_url = "#{ENV['FRONTEND_URL']}?error=authentication_failed"
          redirect_to error_url, allow_other_host: true
        end

        # エラー発生時の処理
        # @param [StandardError] error 発生したエラー
        def handle_error(error)
          Rails.logger.error "LINE Auth Error: #{error.class}: #{error.message}"
          Rails.logger.error error.backtrace.join("\n")

          error_url = "#{ENV['FRONTEND_URL']}?error=#{URI.encode_www_form_component(error.message)}"
          redirect_to error_url, allow_other_host: true
        end
      end
    end
  end
end
