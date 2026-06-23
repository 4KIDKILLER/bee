import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 6111
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router-dom/')
          ) {
            return 'react'
          }

          if (id.includes('/motion/')) {
            return 'motion'
          }

          if (id.includes('/gsap/')) {
            return 'gsap'
          }

          if (id.includes('/lucide-react/')) {
            return 'icons'
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '/@/': `${resolve(__dirname, 'src')}/`,
      '/@v/': `${resolve(__dirname, 'src/views')}/`,
      '/@c/': `${resolve(__dirname, 'src/components')}/`,
    },
  },
})
