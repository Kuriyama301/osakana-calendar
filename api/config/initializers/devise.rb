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
  config.mailer_sender = 'no-reply@example.com'
  config.parent_mailer = 'ActionMailer::Base'

  # セキュリティ設定
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = true
  config.expire_all_remember_me_on_sign_out = true
  config.sign_out_via = :delete

  # セッション設定
  config.skip_session_storage = [:http_auth, :params_auth]

  # メール送信者の設定
  config.mailer_sender = ENV.fetch('MAILER_FROM', 'no-reply@example.com')

  # メール確認の設定
  config.reconfirmable = true  # メールアドレス変更時の再確認
  config.confirm_within = 3.days  # メール確認の期限

  # パスワードリセットの設定
  config.reset_password_within = 6.hours  # パスワードリセットの期限
end
