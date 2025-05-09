import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // redirect mọi /api → http://localhost:4000
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
