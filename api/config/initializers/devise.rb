require 'devise'
require 'devise/jwt'
require 'devise/orm/active_record'

Devise.setup do |config|
  # APIモードの設定
  config.navigational_formats = []

  # データベースの認証設定
  config.authentication_keys = [:email]
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]

  # パスワード設定
  config.password_length = 6..128
  config.reset_password_within = 6.hours

  # メール設定
  config.mailer_sender = ENV.fetch('MAILER_FROM', 'no-reply@example.com')
  config.parent_mailer = 'ActionMailer::Base'

  # セキュリティ設定
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = true                    # メールアドレス変更時の再確認
  config.confirm_within = 3.days                 # メール確認の期限
  config.expire_all_remember_me_on_sign_out = true
  config.sign_out_via = :delete

  # セッション設定
  config.skip_session_storage = [:http_auth, :params_auth]

  config.jwt do |jwt|
    # JWT秘密鍵の設定
    jwt.secret = ENV.fetch('DEVISE_JWT_SECRET_KEY', nil)

    # JWTの有効期限（24時間）
    jwt.expiration_time = 24.hours.to_i

    # トークンを発行するリクエスト
    jwt.dispatch_requests = [
      ['POST', %r{^/api/v1/auth/sign_in$}]  # ログイン時
    ]

    # トークンを無効化するリクエスト
    jwt.revocation_requests = [
      ['DELETE', %r{^/api/v1/auth/sign_out$}]  # ログアウト時
    ]
  end
end
