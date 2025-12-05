import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  // <-- Importante: base debe coincidir con la subruta que usarás en Netlify
  base: '/ahorcado/',

  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({
      sassVariables: fileURLToPath(
        new URL('./src/quasar-variables.sass', import.meta.url)
      )
    })
  ],

  build: {
    outDir: 'dist' // <-- Vite generará los archivos aquí
  }
})
