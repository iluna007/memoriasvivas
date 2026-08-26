import { useOutletContext } from 'react-router-dom'
import PublicacionesWall from '../components/publicaciones/PublicacionesWall'
import publicaciones from '../data/publicaciones.json'
import '../components/publicaciones/publicacionesWall.css'

export default function Publicaciones() {
  const { theme = 'dark' } = useOutletContext() ?? {}

  return (
    <main className="min-h-full pt-16">
      <PublicacionesWall items={publicaciones} theme={theme} />
    </main>
  )
}
