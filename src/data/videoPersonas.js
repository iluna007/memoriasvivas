/**
 * Personas en la página /personas:
 * - ids en ids_personas (relatos) + ficha 2_personas.js
 * - nombres en Entrevista, Registro Audiovisual, Post-Producción, Responsables y colaboradores (1_archivo.js)
 */
import archivo from './CMS/1_archivo.js'
import personas from './CMS/2_personas.js'

function normalizePersonaId(raw) {
  const s = String(raw ?? '')
    .trim()
    .toUpperCase()
  const m = s.match(/^P(\d+)$/)
  if (!m) return null
  return `P${String(parseInt(m[1], 10)).padStart(2, '0')}`
}

function parseIdsPersonas(str) {
  if (!str || typeof str !== 'string') return []
  return str
    .split(/[,;]/)
    .map((x) => normalizePersonaId(x))
    .filter(Boolean)
}

/** Clave estable para deduplicar nombres (minúsculas, espacios) */
function normalizeName(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/**
 * Separa nombres en listas tipo "A, B, C" (coma).
 * @returns {string[]}
 */
function splitNameList(str) {
  if (!str || typeof str !== 'string') return []
  return str
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
}

/**
 * @typedef {{ displayName: string, entrevista: string[], registro: string[], post: string[], responsables: string[] }} CreditAgg
 */

/** Agrega por nombre normalizado todo lo que aparece en los cuatro campos del archivo */
function collectCreditsFromArchivo() {
  /** @type {Map<string, CreditAgg>} */
  const map = new Map()

  for (const rel of archivo) {
    const rid = rel.id_relato
    const add = (field, role) => {
      if (!field || typeof field !== 'string') return
      for (const raw of splitNameList(field)) {
        const displayName = raw.trim()
        if (!displayName) continue
        const k = normalizeName(displayName)
        if (!map.has(k)) {
          map.set(k, {
            displayName,
            entrevista: [],
            registro: [],
            post: [],
            responsables: []
          })
        }
        const agg = map.get(k)
        if (displayName.length > agg.displayName.length) {
          agg.displayName = displayName
        }
        const list = agg[role]
        if (rid && !list.includes(rid)) list.push(rid)
      }
    }

    add(rel['Entrevista'], 'entrevista')
    add(rel['Registro Audiovisual'], 'registro')
    add(rel['Post-Producción'], 'post')
    add(rel['Responsables y colaboradores'], 'responsables')
  }

  return map
}

const CREDIT_LABELS = {
  entrevista: 'Entrevista',
  registro: 'Registro audiovisual',
  post: 'Post-producción',
  responsables: 'Responsables y colaboradores'
}

function buildCreditBio(agg) {
  const lines = []
  for (const role of ['entrevista', 'registro', 'post', 'responsables']) {
    const ids = agg[role]
    if (ids.length) {
      lines.push(`${CREDIT_LABELS[role]}: ${ids.join(', ')}.`)
    }
  }
  return lines.join('\n\n')
}

function buildBio(p) {
  const parts = []
  if (p.rol_comunitario) parts.push(`Rol comunitario: ${p.rol_comunitario}.`)
  if (p.generación) parts.push(`Generación: ${p.generación}.`)
  const gen = p['género_autodefinido'] ?? p.género_autodefinido
  if (gen) parts.push(`Género autodefinido: ${gen}.`)
  if (p.notas) parts.push(p.notas)
  return parts.join(' ')
}

/**
 * @returns {Array<{ key: string, id_persona: string | null, nombre: string, bio: string, imagePlaceholder: string }>}
 */
export function getPersonasFromVideos() {
  const creditMap = collectCreditsFromArchivo()
  const byId = new Map(personas.map((p) => [p.id_persona, p]))

  /** ids de persona que aparecen en algún relato (ids_personas) */
  const seenInRelatos = new Set()
  for (const rel of archivo) {
    for (const pid of parseIdsPersonas(rel.ids_personas)) {
      seenInRelatos.add(pid)
    }
  }

  /** nombre normalizado → id_persona (2_personas) */
  const nameNormToPersonaId = new Map()
  for (const p of personas) {
    nameNormToPersonaId.set(normalizeName(p.nombre), p.id_persona)
  }

  /** Incluir en fichas CMS a quien solo sale en créditos pero coincide con 2_personas */
  const personaIdsToShow = new Set(seenInRelatos)
  for (const norm of creditMap.keys()) {
    const pid = nameNormToPersonaId.get(norm)
    if (pid) personaIdsToShow.add(pid)
  }

  const usedCreditNorms = new Set()

  const cards = []

  const orderedIds = [...personaIdsToShow].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  )

  for (const pid of orderedIds) {
    const p = byId.get(pid)
    const nombre = p?.nombre ?? pid
    const norm = normalizeName(nombre)
    let bio = p ? buildBio(p) : 'Ficha pendiente en el archivo de personas.'

    const agg = creditMap.get(norm)
    if (agg) {
      usedCreditNorms.add(norm)
      const creditText = buildCreditBio(agg)
      bio = `${bio}\n\n— Créditos en los audiovisuales del archivo:\n${creditText}`
    }

    cards.push({
      key: pid,
      id_persona: pid,
      nombre,
      bio,
      imagePlaceholder: `https://placehold.co/400x480/1a1a1a/666?text=${encodeURIComponent(nombre.slice(0, 18))}`
    })
  }

  /** Nombres que solo están en campos de texto (no coinciden con 2_personas) */
  const creditOnly = []
  for (const [norm, agg] of creditMap) {
    if (usedCreditNorms.has(norm)) continue
    creditOnly.push({ norm, agg })
  }
  creditOnly.sort((a, b) =>
    a.agg.displayName.localeCompare(b.agg.displayName, 'es', { sensitivity: 'base' })
  )

  for (const { norm, agg } of creditOnly) {
    const nombre = agg.displayName
    const bio = `Participación en el archivo de relatos:\n\n${buildCreditBio(agg)}`
    cards.push({
      key: `name:${norm}`,
      id_persona: null,
      nombre,
      bio,
      imagePlaceholder: `https://placehold.co/400x480/1a1a1a/666?text=${encodeURIComponent(nombre.slice(0, 18))}`
    })
  }

  return cards
}
