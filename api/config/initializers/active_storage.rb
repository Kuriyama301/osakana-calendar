Rails.application.configure do
  # URLの有効期限を設定（開発環境用）
  config.active_storage.service_urls_expire_in = 1.hour

  # URLヘルパーのホスト設定
  Rails.application.routes.default_url_options[:host] = ENV.fetch('API_HOST', 'localhost:3000')
  Rails.application.routes.default_url_options[:protocol] = ENV.fetch('API_PROTOCOL', 'http')
end
