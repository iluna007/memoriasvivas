import { SPHERE_CONTENT } from './cmsSphereData'

/** Número de esferas (desde CMS / conceptos). */
const COUNT = SPHERE_CONTENT.length

/**
 * Color de acento y de la esfera en la escena por índice (no viene del CMS).
 * Debe tener al menos COUNT entradas; si añades conceptos, amplía este array.
 */
export const SPHERE_COLORS = [
  '#e53935',
  '#d81b60',
  '#8e24aa',
  '#5e35b1',
  '#3949ab',
  '#1e88e5',
  '#039be5',
  '#00acc1',
  '#00897b',
  '#43a047',
  '#7cb342',
  '#c0ca33',
  '#fdd835',
  '#ffb300',
  '#fb8c00',
  '#f4511e',
  '#757575',
  '#546e7a',
  '#78909c'
]

function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// Posiciones iniciales repartidas en el espacio (tantas como conceptos en CMS)
export function getSphereInitialPositions() {
  const positions = []
  const radius = 6
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
