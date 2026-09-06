/**
 * Pines del mapa: uno por cada territorio real (territorio.js), cada uno
 * con los videos de MAPA_VIDEOS_PLAYLISTS que le corresponden.
 */
import territorios from './CMS/territorio.js'
import { MAPA_VIDEOS_PLAYLISTS } from './mapaVideosPlaylists.js'

/**
 * @returns {Array<{ pinId: string, territorioId: string, nombre: string, longitude: number, latitude: number, videos: Array<{ id: string, titulo: string, url: string, image: string }> }>}
 */
export function buildOsaMapPins() {
  return territorios.map((t) => {
    const videos = MAPA_VIDEOS_PLAYLISTS.filter((v) => v.territorioId === t.id_territorio).map((v) => ({
      id: v.id,
      titulo: v.title,
      url: `https://www.youtube.com/watch?v=${v.id}`,
      image: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    }))

    return {
      pinId: t.id_territorio,
      territorioId: t.id_territorio,
      nombre: t.nombre,
      longitude: t.lon,
      latitude: t.lat,
      videos,
    }
  })
}
