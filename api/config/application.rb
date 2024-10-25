module App
  class Application < Rails::Application
    config.load_defaults 7.0
    config.api_only = true
    config.time_zone = "Tokyo"
    config.active_record.default_timezone = :local

    # ディレクトリ設定
    config.before_initialize do
      %w[tmp/pids tmp/cache tmp/sockets storage log].each do |dir|
        full_path = Rails.root.join(dir)
        FileUtils.mkdir_p(full_path) unless File.directory?(full_path)
        FileUtils.chmod(0777, full_path) if Rails.env.production?
      end
    end

    # すべてのHerokuドメインを許可
    config.hosts = nil if Rails.env.production?

    # プロダクション環境でのホスト制限を解除
    config.hosts = nil
    end
  end
end
