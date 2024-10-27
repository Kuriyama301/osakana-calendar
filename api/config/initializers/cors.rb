Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('ALLOWED_ORIGINS') do
      if Rails.env.production?
        'https://osakana-calendar-front-4e0125f54113.herokuapp.com'
      else
        'http://localhost:5173'
      end
    end

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false,
      expose: ['Access-Control-Allow-Origin']
  end
end
