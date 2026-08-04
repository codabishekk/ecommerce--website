import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', '@fortawesome/react-fontawesome', '@fortawesome/fontawesome-svg-core'],
          charts: ['chart.js', 'react-chartjs-2'],
          motion: ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    cssCodeSplit: true,
  },
})
