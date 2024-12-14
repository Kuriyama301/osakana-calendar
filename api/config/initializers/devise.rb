require 'devise'
require 'devise/jwt'
require 'devise/orm/active_record'

Devise.setup do |config|
  # API設定
  config.navigational_formats = []

  # メール送信者の設定
  config.mailer_sender = ENV.fetch('MAILER_FROM', 'no-reply@example.com')

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

  # JWT設定
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.secret_key_base
    jwt.dispatch_requests = [['POST', %r{^/api/v1/auth/sign_in$}]]
    jwt.revocation_requests = [['DELETE', %r{^/api/v1/auth/sign_out$}]]
    jwt.expiration_time = 24.hours.to_i
  end

  # その他のDevise設定
  config.authentication_keys = [:email]
  config.reset_password_within = 6.hours
  config.sign_in_after_reset_password = true
  config.remember_for = 2.weeks
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
end
