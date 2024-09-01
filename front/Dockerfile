# ビルドステージ
FROM node:20 as build

# WORKDIRのデフォルト値を設定
ARG WORKDIR=/app
ENV WORKDIR=$WORKDIR

# 作業ディレクトリの設定
WORKDIR $WORKDIR

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm ci

# プロジェクトファイルをコピー
COPY . .

# プロジェクトのビルド
RUN npm run build

# 本番ステージ
FROM nginx:alpine

# ビルドされたファイルをNginxのサーブディレクトリにコピー
COPY --from=build /app/build /usr/share/nginx/html

# Nginxの設定ファイルをコピー
# COPY nginx.conf /etc/nginx/nginx.conf

# ポート80を公開
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]