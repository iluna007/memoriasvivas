/**
 * Lee un CSV de WizTree y escribe el peso de 0_Memorias Vivas.
 * Uso: node scripts/generar_peso_archivo.mjs "ruta/al/WizTree.csv"
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import disco from '../src/data/archivoDisco.json' with { type: 'json' }

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = process.argv[2] || 'C:/Users/ikerl/.cursor/projects/x-Proyectos-2026-WebPortfolio-memoriasvivas/attachments/20d9db9e-8db3-435d-97be-a3b1d4705d18/WizTree_20261110103050.csv'
const out = path.join(root, 'src', 'data', 'archivoPeso.json')

const GRUPOS = [
  { id: 'foto', ext: ['jpg', 'jpeg', 'png', 'gif', 'tif', 'tiff', 'webp', 'heic', 'heif', 'bmp'] },
  { id: 'raw', ext: ['nef', 'cr2', 'cr3', 'arw', 'rw2', 'dng', 'orf', 'raf', 'srw', 'raw'] },
  { id: 'video', ext: ['mp4', 'mov', 'mts', 'm2ts', 'avi', 'mxf', 'mpg', 'mpeg', 'mkv', 'wmv', 'm4v'] },
  { id: 'audio', ext: ['wav', 'mp3', 'aac', 'm4a', 'flac', 'aiff', 'aif'] },
  { id: 'camara', ext: ['xml', 'xmp', 'cpi', 'acr', 'bdm'] },
  { id: 'zip', ext: ['zip', '7z', 'rar'] },
  { id: 'documento', ext: ['pdf', 'doc', 'docx', 'ott', 'dotx', 'otp', 'potx', 'pptx', 'thmx', 'txt', 'csv'] },
  { id: 'diseno', ext: ['psd', 'psb', 'ai', 'indd', 'emf', 'prproj', 'hprj', 'mogrt'] },
]

function parseLine(line) {
  const out = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i += 1
        } else quoted = false
      } else cur += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out
}

function encontrar(node, name) {
  if (node.name === name) return node
  for (const child of node.children) {
    const hit = encontrar(child, name)
    if (hit) return hit
  }
  return null
}

const text = fs.readFileSync(src, 'utf8').replace(/^\uFEFF/, '')
const carpetas = {}
const porExt = new Map()
let archivos = 0

for (const raw of text.split(/\r?\n/)) {
  if (!raw.startsWith('"D:\\')) continue
  const [nombre, sizeRaw, , , , filesRaw] = parseLine(raw)
  const bytes = Number(sizeRaw)
  if (!Number.isFinite(bytes)) continue
  const esCarpeta = nombre.endsWith('\\')
  const rel = nombre.replace(/^D:\\/, '').replace(/\\$/, '').split('\\').join('/')
  if (esCarpeta) {
    carpetas[rel] = { bytes, files: Number(filesRaw) || 0 }
    continue
  }
  archivos += 1
  const base = rel.slice(rel.lastIndexOf('/') + 1)
  const dot = base.lastIndexOf('.')
  const ext = dot > 0 ? base.slice(dot + 1).toLowerCase() : ''
  const prev = porExt.get(ext) || { bytes: 0, count: 0 }
  prev.bytes += bytes
  prev.count += 1
  porExt.set(ext, prev)
}

const usado = new Set()
const grupos = GRUPOS.map((grupo) => {
  let bytes = 0
  let count = 0
  const detalle = []
  for (const ext of grupo.ext) {
    const hit = porExt.get(ext)
    if (!hit) continue
    usado.add(ext)
    bytes += hit.bytes
    count += hit.count
    detalle.push([ext, hit.bytes])
  }
  detalle.sort((a, b) => b[1] - a[1])
  return { id: grupo.id, bytes, count, exts: detalle.slice(0, 4).map(([ext]) => ext.toUpperCase()) }
})

let otrosBytes = 0
let otrosCount = 0
const otras = []
for (const [ext, hit] of porExt) {
  if (usado.has(ext)) continue
  otrosBytes += hit.bytes
  otrosCount += hit.count
  otras.push([ext, hit.bytes])
}
otras.sort((a, b) => b[1] - a[1])
if (otrosCount) {
  grupos.push({
    id: 'otros',
    bytes: otrosBytes,
    count: otrosCount,
    exts: otras.filter(([ext]) => ext).slice(0, 4).map(([ext]) => ext.toUpperCase()),
  })
}

const memorias = encontrar(disco, '0_Memorias Vivas')
let carpetasArbol = 0
const sinPeso = []
function walk(node, rel) {
  carpetasArbol += 1
  if (!carpetas[rel]) sinPeso.push(rel)
  node.children.forEach((child) => walk(child, `${rel}/${child.name}`))
}
walk(memorias, '0_Memorias Vivas')

const data = {
  bytes: carpetas['0_Memorias Vivas']?.bytes || 0,
  grupos: grupos.filter((grupo) => grupo.count > 0).sort((a, b) => b.bytes - a.bytes),
  carpetas,
}
fs.writeFileSync(out, JSON.stringify(data))
console.log(JSON.stringify({
  bytes: data.bytes,
  archivos,
  carpetas: Object.keys(carpetas).length,
  carpetasArbol,
  sinPeso: sinPeso.length,
  faltan: sinPeso.length,
  kb: Math.round(fs.statSync(out).size / 1024),
  grupos: data.grupos.map((g) => ({ id: g.id, gb: Math.round(g.bytes / 1024 ** 3), count: g.count })),
}, null, 2))
