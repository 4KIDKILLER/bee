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
  resolve: {
    alias: {
      '/@/': `${resolve(__dirname, 'src')}/`,
      '/@v/': `${resolve(__dirname, 'src/views')}/`,
      '/@c/': `${resolve(__dirname, 'src/components')}/`,
    },
  },
})
