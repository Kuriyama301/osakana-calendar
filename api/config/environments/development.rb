# frozen_string_literal: true

# 開発環境の設定ファイル
# アプリケーションの開発時の動作設定を管理

require "active_support/core_ext/integer/time"

Rails.application.configure do
  # 基本設定
  config.cache_classes = false
  config.eager_load = false
  config.consider_all_requests_local = true
  config.server_timing = true
  config.debug_exception_response_format = :api

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

  # ホスト許可設定
  config.hosts = nil

  # URL・メール設定
  host = ENV.fetch('MAILER_HOST', 'localhost')
  port = ENV.fetch('MAILER_PORT', 3000)

  # デフォルトのURLオプション
  config.action_controller.default_url_options = {
    host: host,
    port: port,
    protocol: 'http'
  }

  # メール設定
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_url_options = {
    host: ENV.fetch('VITE_FRONT_URL', 'http://localhost:5173').gsub(%r{^https?://}, '')
  }

  # AWS SESメール設定
  config.action_mailer.smtp_settings = {
    address: 'email-smtp.ap-northeast-1.amazonaws.com',
    port: 587,
    user_name: ENV.fetch('AWS_SES_SMTP_USER'),
    password: ENV.fetch('AWS_SES_SMTP_PASSWORD'),
    authentication: :login,
    enable_starttls_auto: true,
    domain: 'osakana-calendar.com'
  }

  # メールのデバッグログ
  config.action_mailer.logger = Logger.new(STDOUT)
  config.log_level = :debug
  config.log_headers = true
end
