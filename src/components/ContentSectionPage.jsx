import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getContentPageTheme } from '../utils/pageThemeClasses'

/**
 * Plantilla para secciones de contenido del sitio.
 * @param {{ title?: string, lead?: string, children?: import('react').ReactNode, wide?: boolean }} props
 */
export default function ContentSectionPage({ title, lead, children, wide = false }) {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const t = getContentPageTheme(theme)
  const { t: tr } = useTranslation()

  return (
    <main className="min-h-full pt-16">
      <div className={`mx-auto px-6 py-10 sm:py-14 ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
        {title ? <h1 className="mb-2 text-3xl font-bold leading-tight sm:text-4xl">{title}</h1> : null}
        {lead ? <p className={`mb-8 text-sm leading-relaxed sm:text-base ${t.lead}`}>{lead}</p> : null}
        {children ?? (
          <div className={`rounded-xl border px-5 py-6 text-sm leading-relaxed ${t.card}`}>
            <p className={t.body}>{tr('comun.enConstruccion')}</p>
          </div>
        )}
      </div>
    </main>
  )
}
