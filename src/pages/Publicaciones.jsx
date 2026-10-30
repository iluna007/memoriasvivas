import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicacionesWall from '../components/publicaciones/PublicacionesWall'
import { hashStr } from '../components/publicaciones/PublicacionTile'
import publicacionesData from '../data/publicaciones.json'
import publicacionesEn from '../data/en/publicaciones.js'
import '../components/publicaciones/publicacionesWall.css'

function isRocioPub(item) {
  return (item.autores ?? []).some((a) => /roc[ií]o\s+zamora/i.test(String(a)))
}

function buildWallItems(lang) {
  const base = String(lang).startsWith('en')
    ? publicacionesData.map((p) => ({ ...p, ...(publicacionesEn[p.id] ?? {}) }))
    : publicacionesData
  const filtered = base.filter((item) => {
    if (item.id === 'pub-001') return false // The Art of Memory
    if (item.tipo === 'documental') return false
    if (item.tipo === 'placeholder') return true
    return isRocioPub(item)
  })

  const documentos = filtered
    .filter((item) => item.tipo !== 'placeholder')
    .sort((a, b) => String(a.titulo).localeCompare(String(b.titulo), 'es'))

  const placeholders = filtered
    .filter((item) => item.tipo === 'placeholder')
    .sort((a, b) => hashStr(a.id) - hashStr(b.id))

  // Documento · espacio · documento, y el resto de placeholders después.
  const [entreEllos, ...restoPlaceholders] = placeholders
  const inicio =
    documentos.length >= 2 && entreEllos
      ? [documentos[0], entreEllos, ...documentos.slice(1)]
      : [...documentos, ...(entreEllos ? [entreEllos] : [])]

  return [...inicio, ...restoPlaceholders]
}

export default function Publicaciones() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const { i18n } = useTranslation()
  const items = useMemo(() => buildWallItems(i18n.language), [i18n.language])

  return (
    <main className="min-h-full pt-16">
      <PublicacionesWall items={items} theme={theme} />
    </main>
  )
}
