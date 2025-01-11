import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true // This enables listening on all network interfaces
  },
  preview: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'ui': ['@headlessui/react', '@heroicons/react', 'framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    target: 'esnext',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
