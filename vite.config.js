import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    // Proxy is disabled by default - frontend uses production API via VITE_API_URL
    // Uncomment below to use local worker during development:
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8787', // Cloudflare Worker dev server
    //     changeOrigin: true,
    //     secure: false,
    //   }
    // }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'icons': ['lucide-vue-next'],
        }
      }
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  }
})
