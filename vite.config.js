import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'QRloop - Advanced QR Code Generator',
        short_name: 'QRloop',
        description: 'Professional QR code generator with 3D visualization and AI enhancement',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          
          // Router
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'router';
          }
          
          // QR libraries
          if (id.includes('qr-code-styling') || id.includes('jsqr') || id.includes('qrcode')) {
            return 'qr-libs';
          }
          
          // Charts and visualization
          if (id.includes('recharts') || id.includes('d3') || id.includes('victory')) {
            return 'charts';
          }
          
          // Firebase
          if (id.includes('firebase') || id.includes('@firebase')) {
            return 'firebase';
          }
          
          // PDF and canvas
          if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('canvas')) {
            return 'pdf-canvas';
          }
          
          // UI libraries
          if (id.includes('lucide-react') || id.includes('react-hot-toast') || id.includes('react-dropzone')) {
            return 'ui-libs';
          }
          
          // Utility libraries
          if (id.includes('lodash') || id.includes('date-fns') || id.includes('uuid')) {
            return 'utils';
          }
          
          // State management (if any Zustand remains)
          if (id.includes('zustand') || id.includes('redux')) {
            return 'state';
          }
          
          // Core vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
