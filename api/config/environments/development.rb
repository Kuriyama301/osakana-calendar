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

  # ロギング設定
  config.active_support.deprecation = :log
  config.active_support.disallowed_deprecation = :raise
  config.active_support.disallowed_deprecation_warnings = []
  config.active_record.migration_error = :page_load
  config.active_record.verbose_query_logs = true

  # URL設定
  host = ENV.fetch('API_HOST', 'localhost')
  port = ENV.fetch('API_PORT', 3000)

  # デフォルトのURLオプション
  config.action_controller.default_url_options = {
    host: host,
    port: port,
    protocol: 'http'
  }

  # ホスト許可設定
  config.hosts = nil # 開発環境ではホストチェックを無効化

  # メール設定
  config.action_mailer.default_url_options = {
    host: host,
    port: port,
    protocol: 'http'
  }
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.perform_caching = false
  config.action_mailer.delivery_method = :letter_opener_web
end
