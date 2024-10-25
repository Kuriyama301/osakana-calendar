FROM ruby:3.3.4-slim

ENV RAILS_ENV=production \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_LOG_TO_STDOUT=true

RUN apt-get update -qq && \
    apt-get install -y postgresql-client && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# アプリケーションコードとGemをコピー
COPY . .
RUN bundle config set --local without 'development test' && \
    bundle install --jobs 4 --retry 3

# 起動スクリプトの作成
RUN echo '#!/bin/bash\n\
cd /app\n\
exec bundle exec rails server -b 0.0.0.0 -p ${PORT:-3000}\n\
' > /usr/local/bin/start.sh && \
chmod +x /usr/local/bin/start.sh

EXPOSE ${PORT:-3000}

CMD ["/usr/local/bin/start.sh"]