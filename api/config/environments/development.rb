require "active_support/core_ext/integer/time"
require "rack/cors"

Rails.application.configure do
  # 基本設定
  config.cache_classes = false
  config.eager_load = false
  config.consider_all_requests_local = true
  config.server_timing = true

  # キャッシュ設定
  if Rails.root.join("tmp/caching-dev.txt").exist?
    config.cache_store = :memory_store
    config.public_file_server.headers = {
      "Cache-Control" => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false
    config.cache_store = :null_store
  end

  # Active Storage設定
  config.active_storage.service = :local
  config.active_storage.routes_prefix = '/images'

  # ロギング設定
  config.active_support.deprecation = :log
  config.active_support.disallowed_deprecation = :raise
  config.active_support.disallowed_deprecation_warnings = []
  config.active_record.migration_error = :page_load
  config.active_record.verbose_query_logs = true

  # URL設定
  host = ENV.fetch('API_HOST', 'localhost:3000')
  protocol = ENV.fetch('API_PROTOCOL', 'http')

  # デフォルトのURLオプション
  config.action_controller.default_url_options = {
    host: host,
    protocol: protocol
  }

  # RailsのルートのデフォルトURLオプション
  Rails.application.routes.default_url_options = {
    host: host,
    protocol: protocol
  }

  # ホスト許可設定
  config.hosts = ENV["DISABLE_HOST_CHECK"] == "true" ? nil : %w[localhost 0.0.0.0 api]

  # Active Storageのホスト設定
  config.active_storage.service_urls_expire_in = 1.hour
  config.active_storage.resolve_model_to_route = :rails_storage_proxy

  # CORS設定
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins ENV.fetch('ALLOWED_ORIGINS', 'http://localhost:5173').split(',').map(&:strip)
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: false,
        expose: ['Access-Control-Allow-Origin']
    end
  end

  # メール設定
  config.action_mailer.default_url_options = {
    host: ENV.fetch('MAILER_HOST', 'localhost'),
    port: ENV.fetch('MAILER_PORT', 3000)
  }

  # 開発環境ではメールをletterオープナーで確認
  config.action_mailer.delivery_method = :letter_opener_web
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
end
