# frozen_string_literal: true

# OAuth認証コールバックのベースコントローラー
# GoogleアカウントでのOAuth認証を処理し、ユーザー認証を行う
# リクエスト形式: POST /api/v1/auth/google_oauth2/callback
# フロントエンド連携: SocialAuthButton.jsxからの認証リクエストを処理

module Api
  module V1
    module Auth
      class OmniauthCallbacksController < ApplicationController
        include ActionController::MimeResponds
        include Devise::Controllers::Helpers

        respond_to :json

        # Google OAuth認証コールバックの処理
        # @param [String] credential Googleから受け取ったアクセストークン
        # @return [JSON] 認証結果とユーザー情報
        def google_oauth2
          Rails.logger.info 'Starting google_oauth2 callback'

          begin
            access_token = params[:credential]
            user_info = fetch_google_user_info(access_token)
            Rails.logger.debug { "Google user info: #{user_info.inspect}" }

            @user = find_or_create_user(user_info, 'google_oauth2')

            if @user&.persisted?
              sign_in @user
              handle_successful_authentication('Google')
            else
              handle_failed_authentication
            end
          rescue StandardError => e
            handle_error(e, 'Google')
          end
        end

        private

        # Googleユーザー情報の取得
        # @param [String] access_token Googleアクセストークン
        # @return [Hash] ユーザープロフィール情報
        def fetch_google_user_info(access_token)
          auth_uri = URI('https://www.googleapis.com/oauth2/v3/userinfo')
          auth_uri.query = URI.encode_www_form({ access_token: access_token })
          response = Net::HTTP.get_response(auth_uri)
          JSON.parse(response.body)
        end

        # ユーザーの検索または作成
        # @param [Hash] user_info Googleから取得したユーザー情報
        # @param [String] provider 認証プロバイダー名
        # @return [User] 既存または新規作成されたユーザー
        def find_or_create_user(user_info, provider)
          user = User.find_by(email: user_info['email'])

          if user
            update_oauth_credentials(user, user_info, provider)
          else
            create_oauth_user(user_info, provider)
          end
        end

        # 既存ユーザーのOAuth認証情報を更新
        # @param [User] user 更新対象のユーザー
        # @param [Hash] user_info 新しいユーザー情報
        # @param [String] provider 認証プロバイダー名
        # @return [User] 更新されたユーザー
        def update_oauth_credentials(user, user_info, provider)
          user.tap do |u|
            u.provider = provider
            u.uid = user_info['sub'] || user_info['userId']
            u.profile_image_url = user_info['picture'] if user_info['picture']
            u.save if u.changed?
          end
        end

        # 新規OAuth認証ユーザーの作成
        # @param [Hash] user_info ユーザー情報
        # @param [String] provider 認証プロバイダー名
        # @return [User] 作成されたユーザー
        def create_oauth_user(user_info, provider)
          User.create!(
            email: user_info['email'],
            provider: provider,
            uid: user_info['sub'] || user_info['userId'],
            name: user_info['name'],
            password: Devise.friendly_token[0, 20],
            confirmed_at: Time.current,
            profile_image_url: user_info['picture']
          )
        end

        # 認証成功時の処理
        # @param [String] provider_name 認証プロバイダー名
        # @return [JSON] トークンとユーザー情報を含むレスポンス
        def handle_successful_authentication(provider_name)
          token = @user.generate_jwt
          Rails.logger.info "Generated JWT token for user: #{@user.id}"

          render json: {
            status: 'success',
            message: "Successfully authenticated with #{provider_name}",
            data: UserSerializer.new(@user).serializable_hash,
            token: token
          }
        end

        # 認証失敗時の処理
        # @return [JSON] エラー情報を含むレスポンス
        def handle_failed_authentication
          render json: {
            status: 'error',
            message: 'Failed to authenticate user',
            errors: @user&.errors&.full_messages || ['Authentication failed']
          }, status: :unprocessable_entity
        end

        # エラー発生時の処理
        # @param [StandardError] error 発生したエラー
        # @param [String] provider エラーが発生した認証プロバイダー名
        def handle_error(error, provider)
          Rails.logger.error "#{provider} OAuth Error: #{error.class}: #{error.message}"
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
