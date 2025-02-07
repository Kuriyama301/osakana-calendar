require 'devise'
require 'devise/jwt'
require 'devise/orm/active_record'
require 'omniauth-google-oauth2'
require 'omniauth-line'

Devise.setup do |config|
  # API設定
  config.navigational_formats = []
  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other

  # Wardenの設定
  config.warden do |manager|
    manager.default_strategies(scope: :api_v1_user).unshift :jwt
    manager.failure_app = Devise::FailureApp
    manager.default_scope = :api_v1_user

    # カスタムの失敗処理
    manager.failure_app = Class.new(Devise::FailureApp) do
      def respond
        json_failure
      end

      def json_failure
        self.status = 401
        self.content_type = 'application/json'
        self.response_body = {
          status: 'error',
          message: i18n_message,
          code: warden_message || :unauthenticated
        }.to_json
      end
    end
  end

  # メール送信者の設定
  config.mailer_sender = ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')

  # 基本設定
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.paranoid = true

  # パスワード設定
  config.password_length = 6..128
  config.reset_password_within = 6.hours
  config.password_complexity = { digit: 1, lower: 1, upper: 1 } if defined?(PASSWORD_COMPLEXITY)

  # メール確認の設定
  config.reconfirmable = true
  config.confirm_within = 24.hours
  config.allow_unconfirmed_access_for = 0.days
  config.confirmation_keys = [:email]

  # 親メーラー設定
  config.parent_mailer = 'ActionMailer::Base'

  # セキュリティ設定
  config.stretches = Rails.env.test? ? 1 : 12
  config.expire_all_remember_me_on_sign_out = true
  config.sign_out_via = :delete
  config.skip_session_storage = [:http_auth, :jwt]
  config.omniauth_path_prefix = ''
  config.clean_up_csrf_token_on_authentication = true
  config.maximum_attempts = 5
  config.lock_strategy = :failed_attempts
  config.unlock_strategy = :time
  config.unlock_in = 30.minutes

  # JWT設定
  config.jwt do |jwt|
    jwt.secret = ENV.fetch('DEVISE_JWT_SECRET_KEY') { 'test-secret-key' if Rails.env.test? }

    # トークン発行のリクエスト設定
    jwt.dispatch_requests = [
      ['POST', %r{^/api/v1/auth/sign_in$}],
      ['POST', %r{^/api/v1/auth/google_oauth2/callback$}],
      ['POST', %r{^/api/v1/auth/line/callback$}]
    ]

    # トークン無効化のリクエスト設定
    jwt.revocation_requests = [
      ['DELETE', %r{^/api/v1/auth/sign_out$}],
      ['DELETE', %r{^/api/v1/auth$}]
    ]

    # 基本設定
    jwt.expiration_time = ENV.fetch('DEVISE_JWT_EXPIRATION_TIME', 24.hours.to_i)
    jwt.algorithm = ENV.fetch('JWT_ALGORITHM', 'HS256')
    jwt.request_formats = { api_v1_user: [:json] }
  end

  # Google OAuth設定
  config.omniauth :google_oauth2,
                  ENV['GOOGLE_CLIENT_ID'],
                  ENV['GOOGLE_CLIENT_SECRET'],
                  {
                    scope: 'email,profile',
                    prompt: 'select_account',
                    image_aspect_ratio: 'square',
                    image_size: 50,
                    secure_image_url: true
                  }

  # LINE OAuth設定
  config.omniauth :line,
                  ENV['LINE_CHANNEL_ID'],
                  ENV['LINE_CHANNEL_SECRET'],
                  {
                    scope: 'profile,openid,email',
                    prompt: 'consent',
                    bot_prompt: 'normal'
                  }

  # メール確認のリダイレクト先設定
  config.mailer = 'DeviseMailer'

  # その他のDevise設定
  config.authentication_keys = [:email]
  config.reset_password_within = 6.hours
  config.sign_in_after_reset_password = true
  config.remember_for = 2.weeks
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.timeout_in = 30.minutes
  config.maximum_attempts = 5
end
