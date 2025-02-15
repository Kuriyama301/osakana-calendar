# frozen_string_literal: true

# アプリケーション全体の設定ファイル
# Railsアプリケーションの基本設定を管理

require 'rails'
require 'active_model/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_view/railtie'
require 'rack/cors'
require 'devise'
require 'action_mailer/railtie'

module App
  class Application < Rails::Application
    # Rails 7.0の設定を使用
    config.load_defaults 7.0

    # APIモードを有効化
    config.api_only = true

    # タイムゾーン設定
    config.time_zone = "Tokyo"
    config.active_record.default_timezone = :local

    # APIモードでDeviseを使用するための設定
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore
    config.middleware.use ActionDispatch::Flash

    # サービスディレクトリのオートロード設定
    config.autoload_paths += %W[#{config.root}/app/services]

    # Zeitwerkの設定で特定のディレクトリを無視
    config.autoload_paths.delete("#{config.root}/app/channels")
    config.eager_load_paths.delete("#{config.root}/app/channels")

    # 開発環境用のホスト設定
    config.hosts = [] unless Rails.env.production?

    # セッションストアの設定
    config.session_store :cookie_store, key: '_osakana_calendar_session'
  end
end
