import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:5000',
      '/user': 'http://localhost:5000',
      '/products': 'http://localhost:5000',
      '/cart': 'http://localhost:5000',
      '/purchases': 'http://localhost:5000'
    }
  }
})
