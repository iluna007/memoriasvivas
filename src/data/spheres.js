import { SPHERE_CONTENT } from './cmsSphereData'

/** Número de esferas (desde CMS / conceptos). */
const COUNT = SPHERE_CONTENT.length

/**
 * Color de acento y de la esfera en la escena por índice (no viene del CMS).
 * Debe tener al menos COUNT entradas; si añades conceptos, amplía este array.
 */
export const SPHERE_COLORS = [
  '#ffffff',
  '#e8f0ff',
  '#d0e4ff',
  '#f0f4ff',
  '#c8dffe',
  '#dfe9ff',
  '#b8d4fe',
  '#f5f8ff',
  '#e0ecff',
  '#ccd8f0',
  '#ffffff',
  '#d8e6ff',
  '#eaf0ff',
  '#b0c8ee',
  '#f2f6ff',
  '#c0d6f8',
  '#e4ecff',
  '#d4dff5',
  '#ffffff'
]

function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Posiciones iniciales. `radius` controla el tamaño del volumen esférico
 * donde se reparten las estrellas (default 6, se puede subir desde controles).
 */
export function getSphereInitialPositions(radius = 6) {
  const positions = []
  for (let i = 0; i < COUNT; i++) {
    const theta = seededRandom(i * 2.1) * Math.PI * 2
    const phi = Math.acos(2 * seededRandom(i * 3.7) - 1)
    const r = radius * (0.5 + seededRandom(i * 5.3) * 0.5)
    positions.push({
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi)
    })
  }
  return positions
}

// Parámetros de movimiento flotante por esfera
export function getSphereMotionParams() {
  return Array.from({ length: COUNT }, (_, i) => ({
    speedX: 0.3 + seededRandom(i * 7) * 0.4,
    speedY: 0.3 + seededRandom(i * 11) * 0.4,
    speedZ: 0.3 + seededRandom(i * 13) * 0.4,
    phaseX: seededRandom(i) * Math.PI * 2,
    phaseY: seededRandom(i + 10) * Math.PI * 2,
    phaseZ: seededRandom(i + 20) * Math.PI * 2,
    amplitude: 0.4 + seededRandom(i * 17) * 0.5
  }))
}

/** Color hex para la esfera `i` (repite el último si faltan entradas). */
export function getSphereColor(i) {
  const list = SPHERE_COLORS
  if (i >= 0 && i < list.length) return list[i]
  return list[list.length - 1] ?? '#888888'
}
