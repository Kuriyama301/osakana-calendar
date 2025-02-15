# frozen_string_literal: true

# CORSの設定ファイル
# クロスオリジンリクエストの許可設定を管理

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # フロントエンドのオリジンを許可
    origins ENV.fetch('ALLOWED_ORIGINS') { 'http://localhost:5173' }

    # すべてのリソースに対する設定
    resource '*',
      headers: :any,
      expose: ['Authorization'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      max_age: 3600
  end
end
