Rails.application.configure do
  # Active Storage基本設定
  config.active_storage.service = Rails.env.production? ? :amazon : :local

  # URL設定
  url_options = {
    host: 'localhost',
    port: 3000,
    protocol: 'http'
  }

  # すべてのURL関連設定に同じオプションを設定
  config.active_storage.default_url_options = url_options

  # ActiveStorage::Currentの設定を初期化時に行う
  config.after_initialize do
    ActiveStorage::Current.url_options = url_options
  end
end
