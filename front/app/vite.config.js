import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },

  server: {
    host: '0.0.0.0',
    port: 5173
  },

  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000')
  }
});