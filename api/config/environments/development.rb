require "active_support/core_ext/integer/time"

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

  # メーラー設定
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.perform_caching = false

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
  config.hosts << "localhost"
  config.hosts << "0.0.0.0"
  config.hosts << "api"
  config.hosts.clear if ENV["DISABLE_HOST_CHECK"] == "true"

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
end
