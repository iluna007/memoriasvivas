function conBarra(url) {
  if (!url) return ''
  return url.endsWith('/') ? url : `${url}/`
}

const BASE = conBarra(import.meta.env.VITE_MEDIA_BASE_URL || '/actividades-media/')
const THUMB_BASE = conBarra(import.meta.env.VITE_MEDIA_THUMB_BASE_URL) || BASE
const FULL_BASE = conBarra(import.meta.env.VITE_MEDIA_FULL_BASE_URL) || BASE

function unir(base, ruta) {
  if (!ruta) return null
  const s = String(ruta).trim()
  if (!s) return null
  if (/^https?:\/\//i.test(s)) return s
  return base + encodeURI(s)
}

/** Ruta con VITE_MEDIA_BASE_URL. Sirve para video, PDF y cualquier archivo del CMS. */
export const mediaUrl = (ruta) => unir(BASE, ruta)

/** Miniatura. Por defecto usa la misma base que mediaUrl. */
export const thumbUrl = (ruta) => unir(THUMB_BASE, ruta)

/** Archivo grande (visor). Por defecto usa la misma base que mediaUrl. */
export const fullUrl = (ruta) => unir(FULL_BASE, ruta)

/** True cuando miniatura y grande viven en el mismo host y se puede armar srcset. */
export function mismasEscalas() {
  return THUMB_BASE === FULL_BASE
}

/** Ancho real de cada archivo según la carpeta (mock 320/1024, web 480/1600). */
export function anchosEscala() {
  if (FULL_BASE.includes('actividades-web')) return { thumb: 480, full: 1600 }
  return { thumb: 320, full: 1024 }
}
