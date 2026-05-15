import { COMUNIDAD_NOMBRES } from './comunidadNombres'

function slugifyNombreCompleto(nombre) {
  return String(nombre ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Misma forma que miembros de equipo: nombre, cargo, subtitulo, bio, imagenSrc.
 * Deja cargo/subtitulo/bio/imagenSrc vacíos hasta completar contenido.
 * @typedef {{ key: string, nombre: string, cargo: string, subtitulo: string, bio: string, imagenSrc: string }} ComunidadMiembro
 */

/** @type {ComunidadMiembro[]} */
export const COMUNIDAD = COMUNIDAD_NOMBRES.map((nombre) => ({
  key: slugifyNombreCompleto(nombre),
  nombre,
  cargo: '',
  subtitulo: '',
  bio: '',
  imagenSrc: '',
}))
