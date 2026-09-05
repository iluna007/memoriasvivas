import citas from './CMS/citas.js'
import entidades from './CMS/8_comunidad_entidades.json'
import { normalizeConceptId } from './cmsSphereData.js'

/** "C01, C08" -> ["C01", "C08"] */
function parseIdsConceptos(str) {
  return (str || '')
    .split(/[,;]/)
    .map((s) => normalizeConceptId(s.trim()) ?? s.trim())
    .filter(Boolean)
}

/** Todas las citas donde aparece un concepto (ej. "C05" o "c05"). */
export function getCitasPorConcepto(idConcepto) {
  const id = normalizeConceptId(idConcepto) ?? String(idConcepto ?? '').trim().toUpperCase()
  if (!id) return []
  return citas.filter((cita) => parseIdsConceptos(cita.ids_conceptos).includes(id))
}

/** "YR" -> nombre completo desde entidades de comunidad. */
export function getNombreEntidad(codigo) {
  const entidad = entidades.find((e) => e.codigo === codigo)
  return entidad ? entidad.nombre : codigo
}

/**
 * "6:10 - 6:30; 7:04 - 7:55" -> 370 (segundos del inicio del primer rango).
 * Soporta M:SS y H:MM:SS.
 */
export function timestampInicioEnSegundos(timestamps) {
  if (!timestamps) return null
  const primerRango = String(timestamps).split(';')[0].trim()
  const inicio = primerRango.split('-')[0].trim()
  const partes = inicio.split(':').map((n) => parseInt(n, 10))
  if (partes.length < 2 || partes.some(Number.isNaN)) return null
  if (partes.length === 2) return partes[0] * 60 + partes[1]
  if (partes.length === 3) return partes[0] * 3600 + partes[1] * 60 + partes[2]
  return null
}

/** Primera URL http(s) del campo (por si viene basura o varios enlaces). */
function primeraUrl(raw) {
  if (!raw) return null
  const m = String(raw).match(/https?:\/\/[^\s]+/i)
  return m ? m[0].replace(/[),.;]+$/, '') : null
}

/** Link de YouTube saltando al timestamp de inicio del primer rango. */
export function urlYoutubeConTimestamp(url, timestamps) {
  const clean = primeraUrl(url) ?? (url ? String(url).trim() : null)
  if (!clean) return null
  const segundos = timestampInicioEnSegundos(timestamps)
  if (segundos == null) return clean
  const separador = clean.includes('?') ? '&' : '?'
  return `${clean}${separador}t=${segundos}s`
}
