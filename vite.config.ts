import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  base: process.env.GITHUB_PAGES === 'true' 
    ? '/Professional-KPI-Analysis-Dashboard/' 
    : '/',
  server: {
    port: 3000,
    open: true,
    middlewareMode: false,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        manualChunks: {
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'date-vendor': ['date-fns'],
          'utilities': ['lodash'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'chart.js', 'react-chartjs-2', 'date-fns', 'lodash'],
    exclude: ['node_modules'],
  },
})
