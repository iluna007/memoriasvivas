/**
 * Adaptador entre filas tipo plantilla ISAD (AtoM 2.6) y el objeto «relato» que usa Memorias Vivas.
 *
 * Referencia de columnas oficiales:
 * https://wiki.accesstomemory.org/Resources/CSV_templates
 *
 * El CSV ISAD no define ids de conceptos internos ni créditos desglosados. Para no romper
 * `cmsSphereData`, `videoPersonas`, `Archivo`, `osaMapPins`, etc., cada fila ISAD puede
 * incluir campos opcionales con prefijo memorias* (misma fila / mismo objeto JSON).
 */

/**
 * @param {Record<string, unknown>} row
 * @returns {boolean}
 */
export function isLegacyMemoriasRelato(row) {
  if (!row || typeof row !== 'object') return false
  /** Las filas exportadas desde el CMS Memorias incluyen siempre la clave `título` (aunque sea null). Las filas ISAD usan `title`. */
  return Object.prototype.hasOwnProperty.call(row, 'título')
}

function firstPipeSegment(value) {
  if (value == null || typeof value !== 'string') return ''
  return value.split('|')[0].trim()
}

function firstIsoDateFromEventDates(value) {
  if (value == null || typeof value !== 'string') return null
  const chunks = value.split('|').map((x) => x.trim())
  for (const chunk of chunks) {
    const m = chunk.match(/\d{4}-\d{2}-\d{2}/)
    if (m) return m[0]
  }
  const m2 = value.match(/\d{4}-\d{2}-\d{2}/)
  return m2 ? m2[0] : null
}

function mapLanguage(isadLanguage) {
  const code = firstPipeSegment(String(isadLanguage ?? '')).toLowerCase()
  if (!code) return null
  if (code.startsWith('es')) return 'ESP'
  if (code.startsWith('en')) return 'ENG'
  if (code.startsWith('fr')) return 'FRA'
  return code.slice(0, 3).toUpperCase()
}

function splitEventActors(eventActors) {
  if (eventActors == null || typeof eventActors !== 'string') {
    return { entrevista: null, registro: null, post: null, responsables: null }
  }
  const parts = eventActors
    .split('|')
    .map((x) => x.trim())
    .filter(Boolean)
  return {
    entrevista: parts[0] ?? null,
    registro: parts[1] ?? null,
    post: parts[2] ?? null,
    responsables: parts.length > 3 ? parts.slice(3).join(', ') : null
  }
}

function pickUrl(row) {
  const uri = row.digitalObjectURI
  const path = row.digitalObjectPath
  if (uri != null && String(uri).trim()) return String(uri).trim()
  if (path != null && String(path).trim()) return String(path).trim()
  return null
}

function inferTipo(url, levelOfDescription) {
  const u = String(url ?? '').toLowerCase()
  if (u.includes('youtu') || u.includes('vimeo')) return 'audiovisual'
  const lev = String(levelOfDescription ?? '').toLowerCase()
  if (lev) return lev
  return 'item'
}

function pickExtension(r, keyCamel, keySnake) {
  const a = r[keyCamel]
  const b = r[keySnake]
  if (a != null && String(a).trim() !== '') return String(a).trim()
  if (b != null && String(b).trim() !== '') return String(b).trim()
  return null
}

/**
 * Convierte una fila con nombres de columna ISAD (AtoM 2.6) al shape usado en el sitio.
 *
 * Campos ISAD usados de forma directa: identifier o legacyId, title, digitalObjectURI|digitalObjectPath,
 * language, levelOfDescription, eventStartDates (primera fecha ISO), eventActors (| → créditos por posición).
 *
 * Campos opcionales Memorias (mismo objeto; no existen en la plantilla ISAD oficial):
 * - memoriasIdsConceptos → ids_conceptos
 * - memoriasDuracion → duracion
 * - memoriasConsentimiento → consentimiento
 * - memoriasIdsLugares, memoriasIdsEmociones, memoriasIdsPersonas, memoriasIdsPracticas
 *
 * Alternativa snake_case en JSON: memorias_ids_conceptos, etc.
 *
 * @param {Record<string, unknown>} r
 * @returns {Record<string, unknown>}
 */
export function isadRowToRelato(r) {
  let idRelato = String(r.identifier ?? '').trim()
  if (!idRelato && r.legacyId != null && String(r.legacyId).trim() !== '') {
    idRelato = `L${String(r.legacyId).trim()}`
  }
  const title = String(r.title ?? '').trim()
  const url = pickUrl(r)
  const credits = splitEventActors(r.eventActors != null ? String(r.eventActors) : '')

  return {
    id_relato: idRelato || null,
    título: title,
    tipo: inferTipo(url, r.levelOfDescription),
    fecha_registro: firstIsoDateFromEventDates(r.eventStartDates) ?? firstIsoDateFromEventDates(r.eventDates),
    idioma: mapLanguage(r.language),
    url,
    duracion: pickExtension(r, 'memoriasDuracion', 'memorias_duracion'),
    Entrevista: credits.entrevista,
    'Registro Audiovisual': credits.registro,
    'Post-Producción': credits.post,
    'Responsables y colaboradores': credits.responsables,
    consentimiento: pickExtension(r, 'memoriasConsentimiento', 'memorias_consentimiento'),
    ids_conceptos: pickExtension(r, 'memoriasIdsConceptos', 'memorias_ids_conceptos'),
    ids_lugares: pickExtension(r, 'memoriasIdsLugares', 'memorias_ids_lugares'),
    ids_emociones: pickExtension(r, 'memoriasIdsEmociones', 'memorias_ids_emociones'),
    ids_personas: pickExtension(r, 'memoriasIdsPersonas', 'memorias_ids_personas'),
    ids_practicas: pickExtension(r, 'memoriasIdsPracticas', 'memorias_ids_practicas')
  }
}

/**
 * Normaliza un array mezclado: relatos legacy (Memorias) o filas ISAD → siempre shape legacy.
 * @param {unknown[]} rows
 * @returns {Record<string, unknown>[]}
 */
export function normalizeArchivoRows(rows) {
  if (!Array.isArray(rows)) return []
  const out = []
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    if (isLegacyMemoriasRelato(/** @type {Record<string, unknown>} */ (row))) {
      out.push(/** @type {Record<string, unknown>} */ (row))
    } else {
      out.push(isadRowToRelato(/** @type {Record<string, unknown>} */ (row)))
    }
  }
  return out
}
