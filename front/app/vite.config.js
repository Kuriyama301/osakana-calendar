import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 環境変数の読み込み
  const env = loadEnv(mode, process.cwd(), ['VITE_', '']);
  const isProd = mode === 'production';

  return {
    plugins: [react()],
    root: path.resolve(__dirname),
    publicDir: path.resolve(__dirname, 'public'),
    
    // ビルド設定の改善
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProd,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: {
            // 依存関係の分割設定
            vendor: ['react', 'react-dom', 'axios'],
          },
        },
      },
    },

    // サーバー設定
    server: {
      host: '0.0.0.0',
      port: parseInt(env.PORT || '5173'),
      strictPort: true,
    },

    // 環境変数の定義を修正
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env.PROD': mode === 'production',
      'import.meta.env.DEV': mode === 'development',
    },
  };
});