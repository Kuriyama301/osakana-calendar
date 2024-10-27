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

# 本番環境用の最適化
FROM ruby:3.3.4-slim

RUN apt-get update -qq && \
    apt-get install -y libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ビルドステージからファイルをコピー
COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY --from=builder /app .

ENV RAILS_ENV=production \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_LOG_TO_STDOUT=true

RUN useradd -m app && \
    chown -R app:app /app
USER app

CMD ["./bin/rails", "server", "-b", "0.0.0.0"]