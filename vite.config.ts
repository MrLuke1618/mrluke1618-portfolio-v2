import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Root domain for Vercel deployment; supports BASE_PATH env override if needed
  base: process.env.BASE_PATH || '/',
})
