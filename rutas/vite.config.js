import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  // Base vacía si lo quieres en la raíz, o '/ahorcado/' si quieres subruta
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
    outDir: 'dist',  // Carpeta que Netlify servirá
    emptyOutDir: true
  }
})
