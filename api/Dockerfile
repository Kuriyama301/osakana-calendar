# ビルドステージ
FROM ruby:3.3.4 AS builder

ARG WORKDIR=/app
ENV WORKDIR=$WORKDIR

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

WORKDIR $WORKDIR

COPY Gemfile Gemfile.lock ./
RUN bundle config set --local without 'development test' \
    && bundle install --jobs 4 --retry 3

COPY . .

# 本番用アセットのプリコンパイル
RUN bundle exec rails assets:precompile RAILS_ENV=production

# 実行ステージ
FROM ruby:3.3.4-slim

ARG WORKDIR=/app
ENV WORKDIR=$WORKDIR \
    RAILS_ENV=production \
    RAILS_SERVE_STATIC_FILES=true

RUN apt-get update -qq && apt-get install -y postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR $WORKDIR

COPY --from=builder $WORKDIR $WORKDIR
COPY --from=builder /usr/local/bundle /usr/local/bundle

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]