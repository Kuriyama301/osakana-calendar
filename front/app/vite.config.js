import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // 環境変数の設定
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
    "import.meta.env.VITE_FRONT_URL": JSON.stringify(
      process.env.VITE_FRONT_URL
    ),
    "import.meta.env.VITE_GOOGLE_CLIENT_ID": JSON.stringify(
      process.env.VITE_GOOGLE_CLIENT_ID
    ),
    "import.meta.env.VITE_YOUTUBE_API_KEY": JSON.stringify(
      process.env.VITE_YOUTUBE_API_KEY
    ),
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
});
