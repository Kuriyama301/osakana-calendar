# ビルドステージ
FROM node:20-alpine as build

ARG WORKDIR=/app
ENV WORKDIR=$WORKDIR

WORKDIR $WORKDIR

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 実行ステージ
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Nginxの設定ファイルをコピー
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# 非rootユーザーでNginxを実行
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

USER appuser

CMD ["nginx", "-g", "daemon off;"]