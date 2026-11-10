/**
 * Convierte el listado `tree /a` del disco del archivo en src/data/archivoDisco.json.
 * Uso: node scripts/generar_archivo_disco.mjs "ruta/al/mapa_carpetas.txt"
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = process.argv[2] || 'C:/Users/ikerl/.cursor/projects/x-Proyectos-2026-WebPortfolio-memoriasvivas/attachments/20d9db9e-8db3-435d-97be-a3b1d4705d18/mapa_carpetas.txt'
const thumbsDir = path.join(root, 'public', 'actividades-media', 'thumb')
const out = path.join(root, 'src', 'data', 'archivoDisco.json')

const FIX = { '±': 'ñ', 'φ': 'í', '≤': 'ó', 'ß': 'á', 'Θ': 'é', '┐': '¿' }
const fix = (s) => s.replace(/[±φ≤ßΘ┐]/g, (ch) => FIX[ch] || ch)
const stem = (name) => fix(name).normalize('NFC').toLowerCase().replace(/\.[^.]+$/, '').replace(/\s+/g, ' ').trim()

function walk(dir, acc, base) {
  if (!fs.existsSync(dir)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full, acc, base)
    else {
      const rel = path.relative(base, full).split(path.sep).join('/')
      const key = stem(ent.name)
      const list = acc.get(key)
      if (list) list.push(rel)
      else acc.set(key, [rel])
    }
  }
}

const thumbs = new Map()
walk(thumbsDir, thumbs, path.join(root, 'public', 'actividades-media'))

const text = fs.readFileSync(src, 'utf8').replace(/^\uFEFF/, '')
const disco = { name: 'D:', children: [], files: [] }
const stack = [{ depth: -1, node: disco }]

for (const raw of text.split(/\r?\n/)) {
  const line = raw.replace(/\s+$/, '')
  if (!line || line.startsWith('Folder ') || line.startsWith('Volume ') || line === 'D:.') continue
  const dir = line.match(/^(.*?)(\+---|\\---)\s*(.+)$/)
  if (dir) {
    const depth = Math.floor(dir[1].length / 4)
    const node = { name: fix(dir[3].trim()), children: [], files: [] }
    while (stack.length && stack.at(-1).depth >= depth) stack.pop()
    stack.at(-1).node.children.push(node)
    stack.push({ depth, node })
    continue
  }
  const file = line.replace(/^[\s|]+/, '').trim()
  if (!file || file === '|') continue
  stack.at(-1).node.files.push(fix(file))
}

let matched = 0
let files = 0
function annotate(node) {
  node.files = node.files.map((name) => {
    files += 1
    const hits = thumbs.get(stem(name))
    if (!hits || hits.length !== 1) return name
    matched += 1
    return [name, hits[0]]
  })
  for (const child of node.children) annotate(child)
}
annotate(disco)

fs.writeFileSync(out, JSON.stringify(disco))
const kb = Math.round(fs.statSync(out).size / 1024)
console.log(JSON.stringify({ files, matched, thumbs: thumbs.size, folders: disco.children.length, kb }, null, 2))
