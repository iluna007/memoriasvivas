import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ContentSectionPage from '../components/ContentSectionPage'
import PedagogiasGrid from '../components/pedagogias/PedagogiasGrid'

export default function MaterialDivulgacion() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const { t } = useTranslation()

  return (
    <ContentSectionPage
      wide
      lead={t('divulgacion.lead')}
    >
      <PedagogiasGrid theme={theme} />
    </ContentSectionPage>
  )
}
