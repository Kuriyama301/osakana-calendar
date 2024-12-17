Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('ALLOWED_ORIGINS', 'http://localhost:5173')

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization', 'Content-Type'],
      credentials: ENV.fetch('CORS_CREDENTIALS', 'true') == 'true',
      max_age: 3600
  end
end
