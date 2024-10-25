require "active_support/core_ext/integer/time"

Rails.application.configure do
  # 既存の基本設定
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?

  # ログ設定
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info").to_sym
  config.log_tags = [ :request_id ]

  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger           = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger    = ActiveSupport::TaggedLogging.new(logger)
  end

  # データベース設定
  config.active_record.dump_schema_after_migration = false

  # セキュリティ設定（更新）
  config.force_ssl = true
  config.action_dispatch.default_headers = {
    'X-Frame-Options' => 'SAMEORIGIN',
    'X-XSS-Protection' => '1; mode=block',
    'X-Content-Type-Options' => 'nosniff',
    'X-Download-Options' => 'noopen',
    'X-Permitted-Cross-Domain-Policies' => 'none',
    'Referrer-Policy' => 'strict-origin-when-cross-origin'
  }

  # Active Storage設定
  config.active_storage.service = :local
  config.active_storage.service_urls_expire_in = 1.hour
  config.active_storage.resolve_model_to_route = :rails_storage_proxy

  # URLオプション
  host = ENV.fetch('RAILS_HOST', 'osakana-calendar-api.herokuapp.com')

  # デフォルトURLオプション
  Rails.application.routes.default_url_options = {
    host: host,
    protocol: 'https'
  }

  # Active Storageのホスト設定
  config.action_controller.default_url_options = {
    host: host,
    protocol: 'https'
  }

  # CORS設定（更新）
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'https://osakana-calendar-frontend-1a15062980c2.herokuapp.com'

      resource '*',
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        headers: :any,
        credentials: false,
        max_age: 86400,
        expose: %w[
          access-control-allow-origin
          access-control-allow-methods
          access-control-allow-headers
        ]
    end
  end

  # ホスト設定（更新）
  config.hosts.clear # 既存のホスト制限をクリア
  config.hosts << '.herokuapp.com' # すべてのherokuappドメインを許可

  # PIDファイルの設定
  config.running_pid_file = "tmp/pids/server.pid"
end
