import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { apiPlugin } from './vite-plugin-api.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), apiPlugin()],
    optimizeDeps: {
      exclude: ['@prisma/client', '@prisma/adapter-pg'],
    },
    ssr: {
      noExternal: ['@prisma/client', '@prisma/adapter-pg'],
    },
  }
})
