import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 本番用最適化設定
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // 大きなライブラリを分割
        }
      }
    }
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    // CORSの設定
    cors: true
  },

  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000')
  },

  // 環境変数の型定義
  envPrefix: ['VITE_']
});