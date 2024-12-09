import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // 環境変数の設定
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
    "import.meta.env.VITE_FRONT_URL": JSON.stringify(process.env.VITE_FRONT_URL),
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
    cors: true,
  },
});