/**
 * Contenido de las esferas construido desde la carpeta CMS.
 * - Títulos y textos: 6_conceptos.js
 * - Vídeos (YouTube): 1_archivo.js, enlazados por ids_conceptos
 * Los colores se definen en spheres.js (SPHERE_COLORS), no aquí.
 */
import archivo from './CMS/1_archivo.js'
import { conceptosLocalizados } from './localizado.js'

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

const ETIQUETAS = {
  es: { referencia: 'Referencia', eje: 'Eje', concepto: 'Concepto' },
  en: { referencia: 'Reference', eje: 'Axis', concepto: 'Concept' },
}

/** Conceptos ordenados C01…C18 (una esfera por concepto). */
function ordenar(conceptos) {
  return [...conceptos].sort((a, b) => {
    const na = normalizeConceptId(a.id_concepto) ?? ''
    const nb = normalizeConceptId(b.id_concepto) ?? ''
    return na.localeCompare(nb, undefined, { numeric: true })
  })
}

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
function buildVideosByConcept(conceptosSorted) {
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

function buildDescription(c, et) {
  const breve = c['descripción_breve'] ?? c.descripción_breve
  const parts = [breve].filter(Boolean)
  if (c.autor_referencia) parts.push(`${et.referencia}: ${c.autor_referencia}`)
  if (c.eje) parts.push(`${et.eje}: ${c.eje}`)
  return parts.join('\n\n')
}

function construirContenido(lang) {
  const et = ETIQUETAS[lang]
  const conceptosSorted = ordenar(conceptosLocalizados(lang))
  const videosByConcept = buildVideosByConcept(conceptosSorted)
  return conceptosSorted.map((c, index) => {
    const cid = normalizeConceptId(c.id_concepto) ?? `C${String(index + 1).padStart(2, '0')}`
    return {
      id: cid.toLowerCase(),
      title: c.concepto ?? `${et.concepto} ${index + 1}`,
      description: buildDescription(c, et),
      image: '',
      images: [],
      videos: videosByConcept.get(cid) ?? []
    }
  })
}

const CONTENIDO = { es: construirContenido('es'), en: construirContenido('en') }

/** Contenido en español (el número de esferas es igual en ambos idiomas). */
export const SPHERE_CONTENT = CONTENIDO.es

export const SPHERE_COUNT = SPHERE_CONTENT.length

/**
 * @param {number} id - Índice de la esfera (0 … SPHERE_COUNT - 1)
 * @param {string} [lang] - 'es' (por defecto) o 'en'
 */
export function getSphereContent(id, lang = 'es') {
  return (String(lang).startsWith('en') ? CONTENIDO.en : CONTENIDO.es)[id]
}
