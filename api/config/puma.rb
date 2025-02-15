# frozen_string_literal: true

# Pumaサーバーの設定ファイル
# Webサーバーの動作パラメータを環境ごとに管理

# ワーカープロセスとスレッドの設定
workers ENV.fetch("WEB_CONCURRENCY") { 2 }
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

# ポート設定
port ENV.fetch("PORT") { 3000 }

# 環境設定
environment ENV.fetch("RAILS_ENV") { "development" }

# 本番環境での特別な設定
unless ENV.fetch("RAILS_ENV", "development") == "development"
  pidfile nil
  state_path nil
  preload_app!
end

# Rails再起動コマンドの有効化
plugin :tmp_restart

# ワーカー起動時のデータベース接続設定
on_worker_boot do
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end
