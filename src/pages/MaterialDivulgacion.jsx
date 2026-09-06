import { useOutletContext } from 'react-router-dom'
import ContentSectionPage from '../components/ContentSectionPage'
import PedagogiasGrid from '../components/pedagogias/PedagogiasGrid'

export default function MaterialDivulgacion() {
  const { theme = 'dark' } = useOutletContext() ?? {}

  return (
    <ContentSectionPage
      wide
      lead="Recursos para compartir el proyecto en contextos comunitarios, educativos e institucionales: guías de taller, fichas pedagógicas, infografías, presentaciones y otros materiales."
    >
      <PedagogiasGrid theme={theme} />
    </ContentSectionPage>
  )
}
