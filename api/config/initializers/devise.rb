require 'devise'
require 'devise/jwt'
require 'devise/orm/active_record'
require 'omniauth-google-oauth2'
Devise.setup do |config|
  # API設定
  config.navigational_formats = []

  # メール送信者の設定
  config.mailer_sender = ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')

  # 基本設定
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]

  # パスワード設定
  config.password_length = 6..128
  config.reset_password_within = 6.hours

  # メール確認の設定
  config.reconfirmable = true
  config.confirm_within = 24.hours
  config.allow_unconfirmed_access_for = 0.days

  # 親メーラー設定
  config.parent_mailer = 'ActionMailer::Base'

  # セキュリティ設定
  config.stretches = Rails.env.test? ? 1 : 12
  config.expire_all_remember_me_on_sign_out = true
  config.sign_out_via = :delete
  config.skip_session_storage = [:http_auth]

  config.omniauth_path_prefix = ''

  # JWT設定
  config.jwt do |jwt|
    jwt.secret = ENV['DEVISE_JWT_SECRET_KEY']
    jwt.dispatch_requests = [
      ['POST', %r{^/api/v1/auth/sign_in$}],
      ['POST', %r{^/api/v1/auth/google_oauth2/callback$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/api/v1/auth/sign_out$}]
    ]
    jwt.expiration_time = ENV.fetch('DEVISE_JWT_EXPIRATION_TIME', 24.hours.to_i)
    jwt.algorithm = 'HS256'
  end

  # Google OAuth設定
  config.omniauth :google_oauth2,
                  ENV['GOOGLE_CLIENT_ID'],
                  ENV['GOOGLE_CLIENT_SECRET'],
                  {
                    scope: 'email,profile',
                    prompt: 'select_account',
                    image_aspect_ratio: 'square',
                    image_size: 50
                  }

  # メール確認のリダイレクト先設定
  config.mailer = 'DeviseMailer'

  # その他のDevise設定
  config.authentication_keys = [:email]
  config.reset_password_within = 6.hours
  config.sign_in_after_reset_password = true
  config.remember_for = 2.weeks
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
end
