/**
 * Datos del equipo construidos desde CMS/7_equipo.js.
 * Si un miembro no tiene bio, se usa un placeholder.
 */
import equipoCMS from './CMS/7_equipo.js'

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

export const EQUIPO = equipoCMS.map((m) => ({
  key: slugify(m.nombre ?? '', m.apellidos ?? ''),
  nombre: m.nombre ?? '',
  apellidos: m.apellidos ?? '',
  cargo: m.cargo ?? '',
  escuela: m.escuela ?? '',
  sede: m.sede ?? '',
  bio: (m.bio && typeof m.bio === 'string' && m.bio.trim()) ? m.bio : LOREM_BIO
}))
