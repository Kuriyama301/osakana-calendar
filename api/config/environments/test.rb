require "active_support/core_ext/integer/time"

Rails.application.configure do
  # application.rbの設定よりも優先される設定

  # キャッシュクラスの設定
  config.cache_classes = true

  # CI環境でのみeager_loadingを有効にする
  config.eager_load = ENV["CI"].present?

  # テスト用のパブリックファイルサーバー設定
  config.public_file_server.enabled = true
  config.public_file_server.headers = {
    "Cache-Control" => "public, max-age=#{1.hour.to_i}"
  }

  # エラー表示とキャッシュの設定
  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false
  config.cache_store = :null_store

  # 例外を渡す
  config.action_dispatch.show_exceptions = false

  # テスト環境でのCSRF保護を無効化
  config.action_controller.allow_forgery_protection = false

  # アップロードファイルをテスト用の一時ディレクトリに保存
  config.active_storage.service = :test

  # 非推奨警告の設定
  config.active_support.deprecation = :stderr
  config.active_support.disallowed_deprecation = :raise
  config.active_support.disallowed_deprecation_warnings = []

  # APIモードの設定
  config.api_only = true
end
