Rails.application.configure do
  # 環境に応じたストレージサービスの設定
  config.active_storage.service = Rails.env.production? ? :amazon : :local

  # プロダクション環境の設定
  if Rails.env.production?
    # URLの有効期限設定
    config.active_storage.service_urls_expire_in = 1.hour

    # デフォルトURLオプション
    config.active_storage.default_url_options = {
      host: ENV.fetch('RAILS_HOST', 'osakana-calendar-api-7fca63533648.herokuapp.com'),
      protocol: 'https'
    }
  else
    # 開発環境の設定
    config.active_storage.default_url_options = {
      host: 'localhost:3000',
      protocol: 'http'
    }
  end
end
