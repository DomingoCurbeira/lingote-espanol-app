// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- ¡Este es el que faltaba!
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Mantenemos Tailwind para que el diseño se vea perfecto
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'lingote-192.png', 'lingote-512.png'],
      manifest: {
        name: 'El Lingote Español - Cartago',
        short_name: 'Lingote',
        description: 'Fusión Ibérica y Sabor Tico en el corazón de Cartago',
        theme_color: '#D4AF37',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'lingote-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'lingote-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
