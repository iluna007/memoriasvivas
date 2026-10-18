/** Español sin prefijo. Inglés bajo /en. */
export const LANG_KEY = 'memoriasvivas-lang'

export function idiomaDeRuta(pathname = '') {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es'
}

export function ruta(path, lang) {
  const limpio = path.startsWith('/') ? path : `/${path}`
  const hashIdx = limpio.indexOf('#')
  const solo = hashIdx === -1 ? limpio : limpio.slice(0, hashIdx)
  const hash = hashIdx === -1 ? '' : limpio.slice(hashIdx)
  const base = solo === '/' ? '/' : solo.replace(/\/$/, '')
  const conIdioma = lang === 'en' ? (base === '/' ? '/en' : `/en${base}`) : base
  return `${conIdioma}${hash}`
}

export function rutaAlterna(pathname, hash, destino) {
  const sin = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  const siguiente = destino === 'en' ? (sin === '/' ? '/en' : `/en${sin}`) : sin
  return `${siguiente}${hash || ''}`
}
