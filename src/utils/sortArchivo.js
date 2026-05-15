/**
 * Ordenación y agrupación del archivo (relatos) y del diccionario de conceptos.
 * Patrón similar a floarchive/src/utils/sortArchive.js
 */

export function filterValidRelatos(archivo) {
  if (!Array.isArray(archivo)) return []
  return archivo.filter(
    (r) =>
      r &&
      r.id_relato != null &&
      String(r.id_relato).trim() !== '' &&
      (r.título != null && String(r.título).trim() !== '')
  )
}

export function filterValidConceptos(conceptos) {
  if (!Array.isArray(conceptos)) return []
  return conceptos.filter(
    (c) => c && c.id_concepto != null && c.concepto != null && String(c.concepto).trim() !== ''
  )
}

export function yearKeyFromFecha(fecha) {
  if (!fecha) return 'Sin fecha'
  const d = new Date(fecha)
  const y = d.getFullYear()
  return Number.isFinite(y) ? String(y) : 'Sin fecha'
}

export function groupVideosByYear(items) {
  return items.reduce((acc, item) => {
    const key = yearKeyFromFecha(item.fecha_registro)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

export function groupVideosByTipo(items) {
  return items.reduce((acc, item) => {
    const key = (item.tipo && String(item.tipo).trim()) || 'sin tipo'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

export function sortVideosByDate(items, order = 'desc') {
  return [...items].sort((a, b) => {
    const ta = new Date(a.fecha_registro || 0).getTime()
    const tb = new Date(b.fecha_registro || 0).getTime()
    return order === 'desc' ? tb - ta : ta - tb
  })
}

export function sortVideosByTitle(items, order = 'asc') {
  return [...items].sort((a, b) => {
    const titleA = (a.título ?? '').toLowerCase()
    const titleB = (b.título ?? '').toLowerCase()
    const cmp = titleA.localeCompare(titleB, 'es')
    return order === 'asc' ? cmp : -cmp
  })
}

export function sortVideosByIdRelato(items, order = 'asc') {
  return [...items].sort((a, b) => {
    const idA = String(a.id_relato ?? '')
    const idB = String(b.id_relato ?? '')
    const cmp = idA.localeCompare(idB, 'es', { numeric: true })
    return order === 'asc' ? cmp : -cmp
  })
}

export const VIDEO_SORT_OPTIONS = {
  year: { label: 'Año', group: true, groupFn: groupVideosByYear },
  tipo: { label: 'Tipo', group: true, groupFn: groupVideosByTipo },
  date: { label: 'Fecha', group: false },
  title: { label: 'Título', group: false },
  id: { label: 'ID relato', group: false }
}

export function sortYearKeys(keys) {
  return [...keys].sort((a, b) => {
    if (a === 'Sin fecha') return 1
    if (b === 'Sin fecha') return -1
    return Number(b) - Number(a)
  })
}

export function sortTipoKeys(keys) {
  return [...keys].sort((a, b) => a.localeCompare(b, 'es'))
}

export function getSortedVideos(archivo, sortBy) {
  const items = filterValidRelatos(archivo)
  const opt = VIDEO_SORT_OPTIONS[sortBy]
  if (!opt) return { grouped: { todos: items }, keys: ['todos'] }

  if (opt.group) {
    const sorted =
      sortBy === 'year'
        ? sortVideosByDate(items, 'desc')
        : sortVideosByTitle(items, 'asc')
    const grouped = opt.groupFn(sorted)
    const rawKeys = Object.keys(grouped)
    const keys = sortBy === 'year' ? sortYearKeys(rawKeys) : sortTipoKeys(rawKeys)
    return { grouped, keys }
  }

  let sorted
  if (sortBy === 'date') sorted = sortVideosByDate(items, 'desc')
  else if (sortBy === 'title') sorted = sortVideosByTitle(items, 'asc')
  else if (sortBy === 'id') sorted = sortVideosByIdRelato(items, 'asc')
  else sorted = items

  return { grouped: { todos: sorted }, keys: ['todos'] }
}

/* ─── Conceptos ─── */

export function groupConceptosByEje(items) {
  return items.reduce((acc, item) => {
    const key = (item.eje && String(item.eje).trim()) || 'Sin eje'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

/** Primera letra para índice alfabético (español: Ñ propia; acentos → base; 0-9 y otros → #). */
export function initialLetterBucket(concepto) {
  const raw = String(concepto ?? '').trim()
  if (!raw) return '#'
  const first = raw[0]
  if (/[0-9]/.test(first)) return '#'
  const base = first
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
  if (base === 'Ñ') return 'Ñ'
  if (/^[A-Z]$/.test(base)) return base
  return '#'
}

export function groupConceptosByInitialLetter(items) {
  const sorted = sortConceptosByTitle(items, 'asc')
  return sorted.reduce((acc, item) => {
    const key = initialLetterBucket(item.concepto)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

/** Orden alfabético español: A–N, Ñ, O–Z, luego #. */
export function sortLetterKeys(keys) {
  const order = [...'ABCDEFGHIJKLMN'.split(''), 'Ñ', ...'OPQRSTUVWXYZ'.split(''), '#']
  const idx = (k) => {
    const i = order.indexOf(k)
    return i === -1 ? order.length + 1 : i
  }
  return [...keys].sort((a, b) => idx(a) - idx(b) || a.localeCompare(b, 'es'))
}

export function sortConceptosById(items, order = 'asc') {
  return [...items].sort((a, b) => {
    const idA = String(a.id_concepto ?? '')
    const idB = String(b.id_concepto ?? '')
    const cmp = idA.localeCompare(idB, 'es', { numeric: true })
    return order === 'asc' ? cmp : -cmp
  })
}

export function sortConceptosByTitle(items, order = 'asc') {
  return [...items].sort((a, b) => {
    const titleA = (a.concepto ?? '').toLowerCase()
    const titleB = (b.concepto ?? '').toLowerCase()
    const cmp = titleA.localeCompare(titleB, 'es')
    return order === 'asc' ? cmp : -cmp
  })
}

export const CONCEPT_SORT_OPTIONS = {
  abc: { label: 'ABC', group: true, groupFn: groupConceptosByInitialLetter },
  eje: { label: 'Eje', group: true, groupFn: groupConceptosByEje },
  id: { label: 'ID', group: false },
  title: { label: 'Término', group: false }
}

export function sortEjeKeys(keys) {
  return [...keys].sort((a, b) => {
    if (a === 'Sin eje') return 1
    if (b === 'Sin eje') return -1
    return a.localeCompare(b, 'es')
  })
}

export function getSortedConceptos(conceptos, sortBy) {
  const items = filterValidConceptos(conceptos)
  const opt = CONCEPT_SORT_OPTIONS[sortBy]
  if (!opt) return { grouped: { todos: items }, keys: ['todos'] }

  if (opt.group && sortBy === 'eje') {
    const sorted = sortConceptosByTitle(items, 'asc')
    const grouped = opt.groupFn(sorted)
    const keys = sortEjeKeys(Object.keys(grouped))
    return { grouped, keys }
  }

  if (opt.group && sortBy === 'abc') {
    const sorted = sortConceptosByTitle(items, 'asc')
    const grouped = opt.groupFn(sorted)
    const keys = sortLetterKeys(Object.keys(grouped))
    return { grouped, keys }
  }

  let sorted
  if (sortBy === 'id') sorted = sortConceptosById(items, 'asc')
  else if (sortBy === 'title') sorted = sortConceptosByTitle(items, 'asc')
  else sorted = items

  return { grouped: { todos: sorted }, keys: ['todos'] }
}
