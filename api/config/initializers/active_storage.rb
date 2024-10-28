Rails.application.configure do
  # URLの有効期限を設定
  config.active_storage.service_urls_expire_in = 1.hour

  # 開発環境のみの設定
  if Rails.env.development?
    Rails.application.routes.default_url_options[:host] = ENV.fetch('API_HOST', 'localhost:3000')
    Rails.application.routes.default_url_options[:protocol] = ENV.fetch('API_PROTOCOL', 'http')
  end
end
