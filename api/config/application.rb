require 'rails'
require 'active_model/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_view/railtie'
require 'rack/cors'

module App
  class Application < Rails::Application
    config.load_defaults 7.0
    config.api_only = true
    config.time_zone = "Tokyo"
    config.active_record.default_timezone = :local

    # Zeitwerkの設定で特定のディレクトリを無視
    config.autoload_paths.delete("#{config.root}/app/channels")
    config.eager_load_paths.delete("#{config.root}/app/channels")

    # 開発環境用のホスト設定
    config.hosts = [] unless Rails.env.production?
  end
end
