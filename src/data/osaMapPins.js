/**
 * 17 puntos aleatorios dentro de la península de Osa, cada uno enlazado a un relato
 * distinto de 1_archivo.js (solo entradas con URL de vídeo).
 */
import archivo from './CMS/1_archivo.js'

/** Recuadro aproximado península de Osa (WGS84) */
const OSA_BBOX = {
  minLng: -83.72,
  maxLng: -83.14,
  minLat: 8.38,
  maxLat: 8.72
}

function rand01(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123
  return x - Math.floor(x)
}

function randomLngLat(index) {
  const lng = OSA_BBOX.minLng + rand01(index * 17.31 + 2.17) * (OSA_BBOX.maxLng - OSA_BBOX.minLng)
  const lat = OSA_BBOX.minLat + rand01(index * 19.07 + 5.41) * (OSA_BBOX.maxLat - OSA_BBOX.minLat)
  return { longitude: lng, latitude: lat }
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const PIN_COUNT = 17

/**
 * Construye los 17 pines: posiciones pseudoaleatorias en Osa + vídeos del archivo
 * mezclados aleatoriamente (cada carga puede cambiar qué vídeo va en qué pin).
 * @returns {Array<{ pinId: number, longitude: number, latitude: number, idRelato: string, titulo: string, url: string }>}
 */
export function buildOsaMapPins() {
  const relatos = archivo
    .filter((r) => r.url && typeof r.url === 'string' && r.url.includes('http'))
    .map((r) => ({
      idRelato: r.id_relato ?? '',
      titulo: r['título'] ?? r.título ?? 'Relato',
      url: r.url
    }))

  if (relatos.length < PIN_COUNT) {
    console.warn(`[osaMapPins] Solo hay ${relatos.length} vídeos; se repetirán relatos para llegar a ${PIN_COUNT}.`)
  }

  const pool = shuffleInPlace([...relatos])
  const chosen = []
  for (let i = 0; i < PIN_COUNT; i++) {
    chosen.push(pool[i % pool.length])
  }

  return chosen.map((rel, i) => {
    const { longitude, latitude } = randomLngLat(i)
    return {
      pinId: i,
      longitude,
      latitude,
      idRelato: rel.idRelato,
      titulo: rel.titulo,
      url: rel.url
    }
  })
}
