Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: ENV.fetch('CORS_CREDENTIALS', 'false') == 'true',
      expose: [
        'Access-Control-Allow-Origin',
        'Authorization', # JWTトークンのための認証ヘッダー
        'X-CSRF-Token' # CSRFトークン
      ]
  end
end
