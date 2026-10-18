import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ContentSectionPage from '../components/ContentSectionPage'
import ActividadesTimeline from '../components/actividades/ActividadesTimeline'

export default function Actividades() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const { t } = useTranslation()

  return (
    <ContentSectionPage
      wide
      lead={t('actividades.lead')}
    >
      <ActividadesTimeline theme={theme} />
    </ContentSectionPage>
  )
}
