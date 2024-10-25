# ベースイメージ
FROM node:20-alpine as base
WORKDIR /app
COPY app/package*.json ./

# ビルドステージ
FROM base as build
RUN npm ci
RUN npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
COPY app ./
RUN npx tailwindcss init -p

# ビルド時に環境変数を渡す
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV NODE_ENV=production

RUN npm run build
COPY app/public ./dist

# 本番環境
FROM node:20-alpine as production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/server.js ./
RUN npm ci --only=production
ENV NODE_ENV=production
EXPOSE ${PORT:-3000}
USER node
CMD ["node", "server.js"]