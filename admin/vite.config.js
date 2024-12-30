import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@rollup/rollup-win32-x64-msvc']
  },
  server: {
    port: 3001
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['@rollup/rollup-win32-x64-msvc']
    }
  }
})
