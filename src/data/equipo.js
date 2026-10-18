/**
 * Datos del equipo construidos desde CMS/7_equipo.js.
 * Si un miembro no tiene bio, se usa un placeholder.
 * Las fotos viven en /public/equipo y se sirven desde /equipo/<archivo>.
 * Si hay más de una foto, Equipo.jsx elige una al azar en cada visita.
 */
import equipoCMS from './CMS/7_equipo.js'
import equipoEn from './equipoEn.js'

const LOREM_BIO =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras vehicula, mi eget laoreet varius, libero nunc ultricies nulla, at hendrerit nisi lacus vel sapien. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris.'

function slugify(nombre, apellidos) {
  return `${nombre}-${apellidos}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Archivos dentro de /public/equipo (uno o varios por persona).
const FOTOS = {
  'carolina-bello-may': ['carolina-bello-may.jpg'],
  'rocio-zamora-sauma': [
    'rocio-zamora-sauma-1.jpeg',
    'rocio-zamora-sauma-2.jpeg',
    'rocio-zamora-sauma-3.jpeg',
  ],
  'iker-luna': ['iker-luna.jpeg'],
  'giselle-hidalgo-redondo': [
    'giselle-hidalgo-redondo-1.jpeg',
    'giselle-hidalgo-redondo-2.jpeg',
    'giselle-hidalgo-redondo-3.jpeg',
  ],
  'adrian-vergara-heidke': [
    'adrian-vergara-heidke-1.jpeg',
    'adrian-vergara-heidke-2.jpeg',
  ],
  'felipe-barrantes': [
    'felipe-barrantes-1.jpg',
    'felipe-barrantes-2.jpg',
    'felipe-barrantes-3.jpg',
    'felipe-barrantes-4.jpg',
    'felipe-barrantes-5.jpg',
  ],
  'daniela-matamoros': [
    'daniela-matamoros-1.jpg',
    'daniela-matamoros-2.jpg',
    'daniela-matamoros-3.jpg',
    'daniela-matamoros-4.jpg',
    'daniela-matamoros-5.jpg',
  ],
  'kai-odio-lagos': ['kai-odio-lagos.jpg'],
  'esteban-lobo-quesada': [
    'esteban-lobo-quesada-1.jpg',
    'esteban-lobo-quesada-2.jpg',
  ],
  'montserrat-mora-gomez': [
    'montserrat-mora-gomez-1.jpg',
    'montserrat-mora-gomez-2.jpg',
  ],
}

/**
 * Elige una foto al azar si hay varias; si hay una sola, siempre esa.
 * @param {string[]} fotos
 * @returns {string | null}
 */
export function pickEquipoFoto(fotos) {
  if (!Array.isArray(fotos) || fotos.length === 0) return null
  if (fotos.length === 1) return fotos[0]
  return fotos[Math.floor(Math.random() * fotos.length)]
}

/** Orden de visualización en /equipo */
const ORDEN = [
  'rocio-zamora-sauma',
  'adrian-vergara-heidke',
  'giselle-hidalgo-redondo',
  'felipe-barrantes',
  'esteban-lobo-quesada',
  'daniela-matamoros',
  'carolina-bello-may',
  'kai-odio-lagos',
  'montserrat-mora-gomez',
  'iker-luna',
]

function numeroIdEquipo(id) {
  const n = parseInt(String(id ?? '').slice(1), 10)
  return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n
}

// El Sheet ordena E1, E10, E2… como texto. Aquí el orden base es numérico;
// ORDEN (abajo) sigue definiendo el orden editorial de la página.
const equipoOrdenado = [...equipoCMS].sort(
  (a, b) => numeroIdEquipo(a.id_equipo) - numeroIdEquipo(b.id_equipo)
)

const mapped = equipoOrdenado.map((m) => {
  const key = slugify(m.nombre ?? '', m.apellidos ?? '')
  const archivos = FOTOS[key] ?? []
  const en = equipoEn[m.id_equipo] ?? {}
  return {
    key,
    nombre: m.nombre ?? '',
    apellidos: m.apellidos ?? '',
    cargo: m.cargo ?? '',
    cargo_en: m.cargo_en || en.cargo || '',
    escuela: m.escuela ?? '',
    escuela_en: m.escuela_en || en.escuela || '',
    sede: m.sede ?? '',
    sede_en: m.sede_en || en.sede || '',
    bio: (m.bio && typeof m.bio === 'string' && m.bio.trim()) ? m.bio : LOREM_BIO,
    bio_en: m.bio_en || en.bio || '',
    fotos: archivos.map((archivo) => `/equipo/${archivo}`),
  }
})

export const EQUIPO = [...mapped].sort((a, b) => {
  const ia = ORDEN.indexOf(a.key)
  const ib = ORDEN.indexOf(b.key)
  const ra = ia === -1 ? Number.MAX_SAFE_INTEGER : ia
  const rb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib
  return ra - rb
})
