require "active_support/core_ext/integer/time"

Rails.application.configure do
  # 基本設定
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?

  # ログ設定
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info").to_sym
  config.log_tags = [:request_id]
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

  # メール送信設定
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.perform_caching = false

  # URLオプションの設定
  config.action_mailer.default_url_options = {
    host: ENV.fetch('HOST', 'www.osakana-calendar.com'),
    protocol: 'https'
  }

  # デフォルトのメール送信元設定
  config.action_mailer.default_options = {
    from: ENV.fetch('MAILER_FROM', 'info@osakana-calendar.com')
  }

  # SMTP設定
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: ENV.fetch('SMTP_ADDRESS', 'mail1026.onamae.ne.jp'),
    port: ENV.fetch('SMTP_PORT', 587).to_i,
    domain: ENV.fetch('SMTP_DOMAIN', 'osakana-calendar.com'),
    user_name: ENV.fetch('SMTP_USERNAME', 'info@osakana-calendar.com'),
    password: ENV.fetch('SMTP_PASSWORD'),
    authentication: :login,
    enable_starttls_auto: true,
    open_timeout: 5,
    read_timeout: 5
  }
end
