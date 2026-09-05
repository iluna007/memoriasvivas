import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const csvPath = path.join(root, 'Claude outputs', '06_Conceptos_actual.csv')
const outPath = path.join(root, 'src', 'data', 'CMS', '6_conceptos.js')

function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let i = 0
  let inQ = false
  while (i < text.length) {
    const c = text[i]
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQ = false
        i++
        continue
      }
      field += c
      i++
      continue
    }
    if (c === '"') {
      inQ = true
      i++
      continue
    }
    if (c === ',') {
      row.push(field)
      field = ''
      i++
      continue
    }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i++
      continue
    }
    field += c
    i++
  }
  if (field.length || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((cell) => String(cell ?? '').trim()))
}

const raw = fs.readFileSync(csvPath, 'utf8')
const rows = parseCSV(raw)
const header = rows[0].map((h) => h.trim())
const items = rows
  .slice(1)
  .map((r) => {
    const o = {}
    header.forEach((h, idx) => {
      o[h] = (r[idx] ?? '').trim()
    })
    return {
      id_concepto: o.id_concepto,
      concepto: o.concepto,
      autor_referencia: o.autor_referencia ? o.autor_referencia : null,
      descripción_breve: o['descripción_breve'] || o.descripcion_breve || '',
      eje: o.eje || null,
    }
  })
  .filter((x) => x.id_concepto)

const out = `// Generado desde: 06_Conceptos_actual.csv
// Archivo: CMS Memorias vivas | 5/9/2026

const conceptos = ${JSON.stringify(items, null, 2)};

export default conceptos;
`
fs.writeFileSync(outPath, out, 'utf8')
console.log(`Wrote ${items.length} conceptos → ${outPath}`)
