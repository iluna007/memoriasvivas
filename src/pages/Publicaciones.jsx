import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import PublicacionesWall from '../components/publicaciones/PublicacionesWall'
import { hashStr } from '../components/publicaciones/PublicacionTile'
import publicacionesData from '../data/publicaciones.json'
import { DOCUMENTALES_YOUTUBE } from '../data/documentalesYoutube'
import '../components/publicaciones/publicacionesWall.css'

function mapDocumentalToItem(doc) {
  return {
    id: `doc-${doc.id}`,
    tipo: 'documental',
    titulo: doc.title,
    tituloAlt: null,
    autores: [],
    anio: doc.year ? Number(doc.year) || doc.year : null,
    idioma: 'ES',
    fuente: 'YouTube · Memorias Vivas',
    detalle: null,
    doi: null,
    resumen: null,
    url: doc.url,
    enlaceTipo: 'youtube',
    archivoLocal: null,
    portada: doc.image ?? null,
  }
}

function buildWallItems() {
  const documentalesItems = DOCUMENTALES_YOUTUBE.map(mapDocumentalToItem)
  return [...publicacionesData, ...documentalesItems].sort(
    (a, b) => hashStr(a.id) - hashStr(b.id),
  )
}

export default function Publicaciones() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const items = useMemo(() => buildWallItems(), [])

  return (
    <main className="min-h-full pt-16">
      <PublicacionesWall items={items} theme={theme} />
    </main>
  )
}
