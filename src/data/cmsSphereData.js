/**
 * Contenido de las esferas construido desde la carpeta CMS.
 * - Títulos y textos: 6_conceptos.js
 * - Vídeos (YouTube): 1_archivo.js, enlazados por ids_conceptos
 * Los colores se definen en spheres.js (SPHERE_COLORS), no aquí.
 */
import archivo from './CMS/1_archivo.js'
import conceptos from './CMS/6_conceptos.js'

/** Normaliza "C1", "c01", "C18" → "C01" … "C18" */
export function normalizeConceptId(raw) {
  const s = String(raw ?? '')
    .trim()
    .toUpperCase()
  const m = s.match(/^C(\d+)$/)
  if (!m) return null
  return `C${String(parseInt(m[1], 10)).padStart(2, '0')}`
}

function parseConceptIdsFromRelato(idsConceptos) {
  if (!idsConceptos || typeof idsConceptos !== 'string') return []
  return idsConceptos
    .split(/[,;]/)
    .map((x) => normalizeConceptId(x))
    .filter(Boolean)
}

/** Conceptos ordenados C01…C18 (una esfera por concepto). */
const conceptosSorted = [...conceptos].sort((a, b) => {
  const na = normalizeConceptId(a.id_concepto) ?? ''
  const nb = normalizeConceptId(b.id_concepto) ?? ''
  return na.localeCompare(nb, undefined, { numeric: true })
})

/**
 * Metadatos de producción por relato (1_archivo.js).
 * @param {object} rel
 * @returns {{ url: string, titulo?: string, entrevista: string | null, registroAudiovisual: string | null, postProduccion: string | null }}
 */
export function relatoToVideoEntry(rel) {
  const titulo = rel['título'] ?? rel.título ?? ''
  return {
    url: rel.url,
    titulo: titulo || undefined,
    entrevista: rel['Entrevista'] ?? null,
    registroAudiovisual: rel['Registro Audiovisual'] ?? null,
    postProduccion: rel['Post-Producción'] ?? null
  }
}

/** Array de entradas de vídeo por id de concepto normalizado */
function buildVideosByConcept() {
  const map = new Map()
  for (const c of conceptosSorted) {
    const id = normalizeConceptId(c.id_concepto)
    if (id) map.set(id, [])
  }
  for (const rel of archivo) {
    const url = rel.url
    if (!url) continue
    const entry = relatoToVideoEntry(rel)
    for (const cid of parseConceptIdsFromRelato(rel.ids_conceptos)) {
      if (!map.has(cid)) map.set(cid, [])
      const list = map.get(cid)
      if (!list.some((v) => v.url === entry.url)) list.push(entry)
    }
  }
  return map
}

const videosByConcept = buildVideosByConcept()

function buildDescription(c) {
  const breve = c['descripción_breve'] ?? c.descripción_breve
  const parts = [breve].filter(Boolean)
  if (c.autor_referencia) parts.push(`Referencia: ${c.autor_referencia}`)
  if (c.eje) parts.push(`Eje: ${c.eje}`)
  return parts.join('\n\n')
}

export const SPHERE_CONTENT = conceptosSorted.map((c, index) => {
  const cid = normalizeConceptId(c.id_concepto) ?? `C${String(index + 1).padStart(2, '0')}`
  return {
    id: cid.toLowerCase(),
    title: c.concepto ?? `Concepto ${index + 1}`,
    description: buildDescription(c),
    image: '',
    images: [],
    videos: videosByConcept.get(cid) ?? []
  }
})

export const SPHERE_COUNT = SPHERE_CONTENT.length

/**
 * @param {number} id - Índice de la esfera (0 … SPHERE_COUNT - 1)
 */
export function getSphereContent(id) {
  return SPHERE_CONTENT[id]
}
