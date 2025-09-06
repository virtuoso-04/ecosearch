import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3001',
      '/user': 'http://localhost:3001',
      '/products': 'http://localhost:3001',
      '/cart': 'http://localhost:3001',
      '/purchases': 'http://localhost:3001'
    }
  }
})
