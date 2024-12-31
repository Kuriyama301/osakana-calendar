FROM ruby:3.3.4-slim AS builder

# 必要な依存関係のインストール
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Gemファイルのコピーと依存関係のインストール
COPY Gemfile* ./
RUN bundle config set --local without 'development test' && \
    bundle install --jobs 4 --retry 3

# アプリケーションコードのコピー
COPY . .

# 不要なディレクトリを削除
RUN rm -rf /app/channels && \
    rm -rf /app/tmp/cache /app/tmp/pids /app/tmp/sockets

# 本番環境
FROM ruby:3.3.4-slim

RUN apt-get update -qq && \
    apt-get install -y libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# バックエンド用の環境変数
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_CLIENT_ID
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION
ARG AWS_BUCKET
ARG DEVISE_JWT_SECRET_KEY
ARG SECRET_KEY_BASE

ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_REGION=$AWS_REGION
ENV AWS_BUCKET=$AWS_BUCKET
ENV DEVISE_JWT_SECRET_KEY=$DEVISE_JWT_SECRET_KEY
ENV SECRET_KEY_BASE=$SECRET_KEY_BASE

# ビルドステージからファイルをコピー
COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY --from=builder /app .

ENV RAILS_ENV=production \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_LOG_TO_STDOUT=true

# 必要なディレクトリを作成し、権限を設定
RUN useradd -m app && \
    mkdir -p tmp/pids tmp/sockets && \
    chown -R app:app /app
USER app

# Pumaを使用してサーバーを起動
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]