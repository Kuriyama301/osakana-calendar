require "active_support/core_ext/integer/time"

Rails.application.configure do
  # 基本設定
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?

  # ログ設定
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info").to_sym
  config.log_tags = [ :request_id ]
  config.logger = ActiveSupport::TaggedLogging.new(Logger.new(STDOUT)) if ENV["RAILS_LOG_TO_STDOUT"].present?

  # データベース設定
  config.active_record.dump_schema_after_migration = false

  # Active Storage設定
  config.active_storage.service = :amazon

  # ホスト設定
  host = ENV.fetch('RAILS_HOST', 'osakana-calendar-api-7fca63533648.herokuapp.com')
  config.hosts = [host, '.herokuapp.com']

  # デフォルトURLオプション
  routes_config = { host: host, protocol: 'https' }
  Rails.application.routes.default_url_options = routes_config
  config.action_controller.default_url_options = routes_config

  # セキュリティ設定
  config.force_ssl = true

  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.perform_caching = false
  config.action_mailer.default_url_options = {
    host: 'www.osakana-calendar.com',
    protocol: 'https'
  }

  # お名前.comのSMTP設定
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: ENV['SMTP_ADDRESS'],        # お名前.comのSMTPサーバーアドレス
    port: 587,                          # SMTP用ポート
    domain: 'osakana-calendar.com',     # あなたのドメイン
    user_name: ENV['SMTP_USERNAME'],    # お名前.comで設定したメールアドレス
    password: ENV['SMTP_PASSWORD'],     # お名前.comで設定したパスワード
    authentication: :plain,
    enable_starttls_auto: true
  }
end
