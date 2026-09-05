import entidades from './CMS/8_comunidad_entidades.json'

const SIN_LUGAR = 'Otros'

function slugifyNombreCompleto(nombre) {
  return String(nombre ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Orden de despliegue: T1..T9 en orden numérico, "Otros" (sin lugar) al final. */
function lugarOrden(lugar) {
  if (!lugar) return [1, 0]
  const m = /^T(\d+)/.exec(lugar)
  return [0, m ? Number(m[1]) : 99]
}

/**
 * Solo personas (se excluyen grupos y paisajes) del CMS de entidades,
 * con la misma forma que usaba el equipo: nombre, cargo, subtitulo, bio, imagenSrc.
 * Deja cargo/bio/imagenSrc vacíos hasta completar contenido; subtitulo = lugar.
 * @typedef {{ key: string, nombre: string, codigo: string, lugar: string | null, cargo: string, subtitulo: string, bio: string, imagenSrc: string }} ComunidadMiembro
 */

/** @type {ComunidadMiembro[]} */
export const COMUNIDAD = entidades
  .filter((e) => e.tipo === 'Persona')
  .map((e) => ({
    key: slugifyNombreCompleto(e.nombre),
    nombre: e.nombre,
    codigo: e.codigo ?? '',
    lugar: e.lugar ?? null,
    cargo: '',
    subtitulo: e.lugar ?? '',
    bio: '',
    imagenSrc: '',
  }))

/**
 * Las mismas personas, agrupadas por lugar y ordenadas T1, T2, T3... con
 * quienes no tienen lugar asignado al final bajo "Otros". Cada grupo viene
 * ordenado alfabéticamente por nombre.
 * @typedef {{ lugar: string, personas: ComunidadMiembro[] }} ComunidadGrupo
 */

/** @type {ComunidadGrupo[]} */
export const COMUNIDAD_POR_LUGAR = Object.values(
  COMUNIDAD.reduce((acc, persona) => {
    const lugar = persona.lugar ?? SIN_LUGAR
    if (!acc[lugar]) acc[lugar] = { lugar, personas: [] }
    acc[lugar].personas.push(persona)
    return acc
  }, {})
)
  .map((grupo) => ({
    ...grupo,
    personas: [...grupo.personas].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    ),
  }))
  .sort((a, b) => {
    const la = lugarOrden(a.lugar === SIN_LUGAR ? null : a.lugar)
    const lb = lugarOrden(b.lugar === SIN_LUGAR ? null : b.lugar)
    if (la[0] !== lb[0]) return la[0] - lb[0]
    return la[1] - lb[1]
  })
