Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 環境変数が設定されていない場合のデフォルト値を設定
    origins = ENV.fetch('ALLOWED_ORIGINS') { 'http://localhost:5173' }

    # originsメソッドに直接文字列または配列を渡す
    if origins.include?(',')
      origins origins.split(',').map(&:strip)
    else
      origins origins
    end

    resource '*',
      headers: :any,
      expose: ['Authorization', 'X-CSRF-Token'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      max_age: 3600
  end
end
