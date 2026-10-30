/**
 * Versiones localizadas de los datos del CMS.
 * El español sale tal cual del CMS; el inglés se superpone desde src/data/en/,
 * así una nueva exportación de la hoja de cálculo no borra las traducciones.
 */
import conceptosCms from './CMS/6_conceptos.js'
import archivoCms from './CMS/1_archivo.js'
import conceptosEn from './en/conceptos.js'
import ejesEn from './en/conceptosEjes.js'
import { relatosEn, valoresEn } from './en/archivo.js'
import videosEn from './en/videos.js'
import documentalesEn from './en/documentales.js'
import { pedagogiasEn, formatosEn, licenciaEn } from './en/pedagogias.js'

export function esIngles(lang) {
  return String(lang ?? '').toLowerCase().startsWith('en')
}

const cache = new Map()
function memo(clave, fn) {
  if (!cache.has(clave)) cache.set(clave, fn())
  return cache.get(clave)
}

/** Conceptos con concepto, eje y descripción_breve en el idioma pedido. */
export function conceptosLocalizados(lang) {
  if (!esIngles(lang)) return conceptosCms
  return memo('conceptos-en', () =>
    conceptosCms.map((c) => {
      const en = conceptosEn[c.id_concepto]
      return {
        ...c,
        concepto: en?.concepto ?? c.concepto,
        eje: en?.eje ?? ejesEn[c.eje] ?? c.eje,
        descripción_breve: en?.descripcion_breve ?? c.descripción_breve,
      }
    })
  )
}

function valorEn(campo, valor) {
  if (valor == null) return valor
  const mapa = valoresEn[campo]
  return mapa?.[valor] ?? mapa?.[String(valor).toLowerCase()] ?? valor
}

/** Relatos del archivo con título y vocabulario controlado en el idioma pedido. */
export function archivoLocalizado(lang) {
  if (!esIngles(lang)) return archivoCms
  return memo('archivo-en', () =>
    archivoCms.map((r) => ({
      ...r,
      título: relatosEn[r.id_relato] ?? r.título,
      tipo: valorEn('tipo', r.tipo),
      idioma: valorEn('idioma', r.idioma),
      consentimiento: valorEn('consentimiento', r.consentimiento),
    }))
  )
}

/** Título de un relato por id, en el idioma pedido. */
export function tituloRelato(idRelato, tituloEs, lang) {
  if (esIngles(lang) && relatosEn[idRelato]) return relatosEn[idRelato]
  return tituloEs
}

/** Título de un video de YouTube del mapa, por id de YouTube, en el idioma pedido. */
export function tituloVideo(youtubeId, tituloEs, lang) {
  return esIngles(lang) ? (videosEn[youtubeId] ?? tituloEs) : tituloEs
}

/** Documental destacado (title, subtitle) en el idioma pedido. */
export function documentalLocalizado(item, lang) {
  const en = esIngles(lang) ? documentalesEn[item.id] : null
  return { ...item, title: en?.title ?? item.title, subtitle: en?.subtitle ?? item.subtitle }
}

/** Material pedagógico (titulo, descripcion, formato) en el idioma pedido. */
export function pedagogiaLocalizada(item, lang) {
  if (!esIngles(lang)) return item
  const en = pedagogiasEn[item.id]
  return {
    ...item,
    titulo: en?.titulo ?? item.titulo,
    descripcion: en?.descripcion ?? item.descripcion,
    formato: formatosEn[item.formato] ?? item.formato,
  }
}

/** Licencia de la sección de divulgación en el idioma pedido. */
export function licenciaLocalizada(licenciaEs, lang) {
  return esIngles(lang) ? { ...licenciaEs, ...licenciaEn } : licenciaEs
}
