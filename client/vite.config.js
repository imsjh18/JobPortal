import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Or whatever your backend URL is
        changeOrigin: true,
        secure: false,
      },
    },
  },
});