import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const OMITIR = new Set([
  'Actividades MV',
  'actividades-mock',
  'actividades-web',
  'Equipo fotos en la compañía',
])

function copiarFiltrado(desde, hacia) {
  mkdirSync(hacia, { recursive: true })
  for (const entrada of readdirSync(desde, { withFileTypes: true })) {
    if (OMITIR.has(entrada.name)) continue
    const origen = path.join(desde, entrada.name)
    const destino = path.join(hacia, entrada.name)
    if (entrada.isDirectory()) copiarFiltrado(origen, destino)
    else cpSync(origen, destino)
  }
}

function copiarPublicoUtil() {
  return {
    name: 'copiar-publico-util',
    apply: 'build',
    config() {
      return { publicDir: false }
    },
    closeBundle() {
      const root = path.dirname(fileURLToPath(import.meta.url))
      const desde = path.join(root, 'public')
      const hacia = path.join(root, 'dist')
      if (!existsSync(desde)) return
      copiarFiltrado(desde, hacia)
    },
  }
}

export default defineConfig({
  plugins: [react(), copiarPublicoUtil()],
  build: {
    chunkSizeWarningLimit: 1000, // R3F, mapbox y dependencias 3D aumentan el bundle
  },
})
