import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cmsPath = path.join(root, 'src', 'data', 'CMS', 'medios.js')
const origen = path.join(root, '_actividades-mock')
const destino = path.join(root, 'public', 'actividades-media')

const texto = readFileSync(cmsPath, 'utf8')
const inicio = texto.indexOf('[')
const fin = texto.lastIndexOf(']')
if (inicio < 0 || fin < inicio) {
  throw new Error('No se encontro el arreglo de medios en medios.js')
}
const medios = JSON.parse(texto.slice(inicio, fin + 1))

const rutas = new Set()
for (const medio of medios) {
  const tipo = String(medio.tipo || '').trim().toLowerCase()
  if (tipo !== 'foto' || medio.visible !== true || !medio.archivo_web) continue
  rutas.add(String(medio.archivo_web).trim())
  if (medio.archivo_miniatura) rutas.add(String(medio.archivo_miniatura).trim())
}

const faltantes = []
let bytes = 0
let archivos = 0
let pesado = null

for (const rel of rutas) {
  if (!rel) continue
  const desde = path.join(origen, rel)
  const hacia = path.join(destino, rel)
  if (!existsSync(desde)) {
    faltantes.push(rel)
    continue
  }
  const tam = statSync(desde).size
  mkdirSync(path.dirname(hacia), { recursive: true })
  const ya = existsSync(hacia) ? statSync(hacia).size : -1
  if (ya !== tam) copyFileSync(desde, hacia)
  bytes += tam
  archivos += 1
  if (!pesado || tam > pesado.tam) pesado = { rel, tam }
}

const mb = bytes / (1024 * 1024)
const kbPesado = pesado ? pesado.tam / 1024 : 0
console.log(`Archivos: ${archivos}`)
console.log(`Total MB: ${mb.toFixed(1)}`)
console.log(`Faltantes: ${faltantes.length}`)
for (const rel of faltantes) console.log(`  falta ${rel}`)
if (pesado) console.log(`Mas pesado: ${pesado.rel} (${kbPesado.toFixed(0)} KB)`)

if (mb >= 70 || (pesado && pesado.tam > 1024 * 1024)) {
  console.log('NO CUMPLE el limite de 70 MB o de 1 MB por archivo')
  process.exitCode = 2
}
