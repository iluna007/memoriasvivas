/**
 * ÚNICA FUENTE DE CONTENIDO DE LAS ESFERAS.
 * Todo lo que se muestra (escena 3D, panel lateral, títulos al hover) se lee de aquí.
 * El índice en el array es el id de la esfera (0, 1, 2, …).
 *
 * Propiedades por esfera:
 *   - title: texto que se muestra al hacer hover y en el panel
 *   - color: color hex de la esfera y del acento del panel
 *   - description: párrafo en el panel lateral
 *   - image: URL de la imagen principal (opcional)
 *   - images: array de URLs de imágenes adicionales (opcional)
 *   - videos: array de URLs de vídeos (opcional)
 */
export const SPHERE_CONTENT = [
  {
    title: 'Esfera 1',
    color: '#e53935',
    description: 'Descripción de la primera memoria. Puedes editar este texto para cada esfera.',
    image: 'https://placehold.co/400x240/1a1a1a/666?text=Imagen+1',
    images: [],
    videos: []
  },
  {
    title: 'Esfera 2',
    color: '#d81b60',
    description: 'Descripción de la segunda memoria.',
    image: 'https://placehold.co/400x240/1a1a1a/666?text=Imagen+2',
    images: [],
    videos: []
  },
  { title: 'Esfera 3', color: '#8e24aa', description: 'Descripción de la tercera memoria.', image: '', images: [], videos: [] },
  { title: 'Esfera 4', color: '#5e35b1', description: 'Descripción de la cuarta memoria.', image: '', images: [], videos: [] },
  { title: 'Esfera 5', color: '#3949ab', description: 'Descripción de la quinta memoria.', image: '', images: [], videos: [] },
  { title: 'Esfera 6', color: '#1e88e5', description: 'Descripción de la sexta memoria.', image: '', images: [], videos: [] },
  { title: 'Esfera 7', color: '#00acc1', description: 'Descripción de la séptima memoria.', image: '', images: [], videos: [] },
  { title: 'Esfera 8', color: '#00897b', description: 'Descripción de la octava memoria.', image: '', images: [], videos: [] },
  { title: 'Esfera 9', color: '#43a047', description: 'Descripción de la novena memoria.', image: '', images: [], videos: [] },
  { title: 'Esfera 10', color: '#7cb342', description: 'Descripción de la décima memoria.', image: '', images: [], videos: [] },
  { title: 'Esfera 11', color: '#c0ca33', description: 'Descripción de la memoria 11.', image: '', images: [], videos: [] },
  { title: 'Esfera 12', color: '#fdd835', description: 'Descripción de la memoria 12.', image: '', images: [], videos: [] },
  { title: 'Esfera 13', color: '#ffb300', description: 'Descripción de la memoria 13.', image: '', images: [], videos: [] },
  { title: 'Esfera 14', color: '#fb8c00', description: 'Descripción de la memoria 14.', image: '', images: [], videos: [] },
  { title: 'Esfera 15', color: '#f4511e', description: 'Descripción de la memoria 15.', image: '', images: [], videos: [] },
  { title: 'Esfera 16', color: '#6d4c41', description: 'Descripción de la memoria 16.', image: '', images: [], videos: [] },
  { title: 'Esfera 17', color: '#757575', description: 'Descripción de la memoria 17.', image: '', images: [], videos: [] },
  { title: 'Esfera 18', color: '#546e7a', description: 'Descripción de la memoria 18.', image: '', images: [], videos: [] }
]

/** Número de esferas (derivado del contenido). */
export const SPHERE_COUNT = SPHERE_CONTENT.length

/**
 * Obtiene el contenido de una esfera por su id.
 * @param {number} id - Índice de la esfera (0 a SPHERE_COUNT - 1)
 * @returns {object|undefined}
 */
export function getSphereContent(id) {
  return SPHERE_CONTENT[id]
}
