# frozen_string_literal: true

# 環境設定の初期化ファイル
# アプリケーションの読み込みと必要なディレクトリの作成を管理

# Railsアプリケーションの読み込み
require_relative "application"

# 必要なディレクトリの作成と権限設定
%w[tmp/pids tmp/cache tmp/sockets log storage].each do |dir|
  FileUtils.mkdir_p(Rails.root.join(dir))
  FileUtils.chmod(0777, Rails.root.join(dir))
end

# Railsアプリケーションの初期化
Rails.application.initialize!
