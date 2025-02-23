import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend server running on port 8080
        changeOrigin: true,             // Updates the host header to match the target
        secure: false,                  // Fine for local development (http instead of https)
        // Optional: rewrite if your backend doesn't expect /api prefix
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});