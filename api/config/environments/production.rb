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
  config.active_storage.replace_on_assign_to_many = true
  config.active_storage.track_variants = true
  config.active_storage.resolve_model_to_route = :rails_storage_proxy

  # ホスト設定
  host = ENV.fetch('RAILS_HOST', 'osakana-calendar-api-7fca63533648.herokuapp.com')
  config.hosts = [host, '.herokuapp.com']

  # デフォルトURLオプション
  routes_config = { host: host, protocol: 'https' }
  Rails.application.routes.default_url_options = routes_config
  config.action_controller.default_url_options = routes_config

  # セキュリティ設定
  config.force_ssl = true
end
