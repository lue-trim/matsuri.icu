import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  base: '/matsuri.icu',
  plugins: [vue()],
  build: {
    outDir: 'docs'
  },
  resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.vue', '.js']
  }
})
