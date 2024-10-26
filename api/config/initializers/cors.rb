Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # 開発環境用。本番環境では適切なオリジンを指定してください

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false
  end
end
