FROM node:20-alpine as base
WORKDIR /app
COPY app/package*.json ./

# ビルドステージ
FROM base as build
RUN npm install
COPY app ./
# ビルド時の環境変数を設定
ARG VITE_API_URL
ARG VITE_FRONT_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_YOUTUBE_API_KEY

# デバッグ出力を追加
RUN echo "Building with environment variables:"
RUN echo "VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}"

# 環境変数を.envファイルに書き出し
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env
RUN echo "VITE_FRONT_URL=${VITE_FRONT_URL}" >> .env
RUN echo "VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}" >> .env
RUN echo "VITE_YOUTUBE_API_KEY=${VITE_YOUTUBE_API_KEY}" >> .env

ENV NODE_ENV=production
RUN npm run build

# 本番環境
FROM node:20-alpine as production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY app/server.js ./
RUN npm install --production
ENV NODE_ENV=production
ENV PORT=3000
USER node
CMD ["node", "server.js"]