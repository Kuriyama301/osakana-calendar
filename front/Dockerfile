FROM node:20-alpine as base
WORKDIR /app
COPY app/package*.json ./

# ビルドステージ
FROM base as build
RUN npm ci
COPY app ./
ENV NODE_ENV=production

# ビルド時に環境変数を受け取る
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# 本番環境
FROM node:20-alpine as production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY app/server.js ./
RUN npm ci --only=production
ENV NODE_ENV=production
ENV PORT=3000

# 実行時の環境変数
ENV VITE_API_URL=${VITE_API_URL}
USER node
CMD ["node", "server.js"]