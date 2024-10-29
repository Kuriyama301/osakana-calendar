Rails.application.configure do
  # Active Storage基本設定
  config.active_storage.service = Rails.env.production? ? :amazon : :local

  # 開発環境の設定
  unless Rails.env.production?
    config.active_storage.default_url_options = {
      host: 'localhost:3000',
      protocol: 'http'
    }
  end
end
