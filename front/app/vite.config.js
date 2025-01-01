import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 環境変数の存在確認とデバッグ出力
const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
console.log('Building with GOOGLE_CLIENT_ID:', googleClientId);

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // 環境変数の設定
  define: {
    // バックティックを使用して文字列として確実に組み込む
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': `"${process.env.VITE_GOOGLE_CLIENT_ID}"`,
    'import.meta.env.VITE_API_URL': `"${process.env.VITE_API_URL}"`,
    'import.meta.env.VITE_FRONT_URL': `"${process.env.VITE_FRONT_URL}"`,
    'import.meta.env.VITE_YOUTUBE_API_KEY': `"${process.env.VITE_YOUTUBE_API_KEY}"`,
    // 現在の環境モードも追加
    'import.meta.env.MODE': `"${mode}"`,
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    deps: {
      interopDefault: true,
      registerNodeLoader: true,
      // モジュールをインライン化
      inline: ["js-cookie"],
    },
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
    cors: true,
  },
}));