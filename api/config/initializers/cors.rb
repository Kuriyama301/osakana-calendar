Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 開発環境用のオリジン設定
    origins ENV.fetch('ALLOWED_ORIGINS', 'http://localhost:5173').split(',').map(&:strip)

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false,
      expose: ['Access-Control-Allow-Origin']
  end
end
