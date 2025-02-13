import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
console.log("Building with GOOGLE_CLIENT_ID:", googleClientId);

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  define: {
    "import.meta.env.VITE_GOOGLE_CLIENT_ID": `"${process.env.VITE_GOOGLE_CLIENT_ID}"`,
    "import.meta.env.VITE_API_URL": `"${process.env.VITE_API_URL}"`,
    "import.meta.env.VITE_FRONT_URL": `"${process.env.VITE_FRONT_URL}"`,
    "import.meta.env.VITE_YOUTUBE_API_KEY": `"${process.env.VITE_YOUTUBE_API_KEY}"`,
    "import.meta.env.MODE": `"${mode}"`,
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    deps: {
      interopDefault: true,
      registerNodeLoader: true,
      inline: ["js-cookie"],
    },
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
    cors: true,
  },
}));
