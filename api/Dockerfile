# ベースイメージとしてRuby 3.3.4を使用
FROM ruby:3.3.4

# WORKDIRのデフォルト値を設定
ARG WORKDIR=/app
ENV WORKDIR=$WORKDIR

# 必要なパッケージのインストール
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

# 作業ディレクトリの設定
WORKDIR $WORKDIR

# GemfileとGemfile.lockをコピー
COPY Gemfile $WORKDIR/Gemfile
COPY Gemfile.lock $WORKDIR/Gemfile.lock

# Bundlerを使用して依存関係をインストール
RUN bundle install

# プロジェクトのファイルをコピー
COPY . $WORKDIR

# Railsサーバーを起動するコマンド
CMD ["rails", "server", "-b", "0.0.0.0"]