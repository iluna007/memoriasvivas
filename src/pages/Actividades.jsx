import { useOutletContext } from 'react-router-dom'
import ContentSectionPage from '../components/ContentSectionPage'
import ActividadesTimeline from '../components/actividades/ActividadesTimeline'

export default function Actividades() {
  const { theme = 'dark' } = useOutletContext() ?? {}

  return (
    <ContentSectionPage
      wide
      lead="Talleres, caminatas, encuentros y otras actividades realizadas o programadas con comunidades de la región sur de Costa Rica."
    >
      <ActividadesTimeline theme={theme} />
    </ContentSectionPage>
  )
}
