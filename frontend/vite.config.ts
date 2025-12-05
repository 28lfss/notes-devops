import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const FRONTEND_PREFIX = process.env.VITE_FRONTEND_PREFIX || '';
// Normalize prefix: ensure it starts with / and ends with / (except for root)
const normalizedPrefix = FRONTEND_PREFIX 
  ? (FRONTEND_PREFIX.startsWith('/') 
      ? FRONTEND_PREFIX.replace(/\/+$/, '') + '/'
      : `/${FRONTEND_PREFIX.replace(/\/+$/, '')}/`)
  : '';

const API_URL = process.env.VITE_API_URL || '/api';
const normalizedApiUrl = API_URL.startsWith('/') 
  ? API_URL.replace(/\/$/, '') 
  : `/${API_URL.replace(/\/$/, '')}`;

export default defineConfig({
  base: normalizedPrefix || '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      [normalizedApiUrl]: {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
    },
  },
})

