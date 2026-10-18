import { useOutletContext } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { getContentPageTheme } from '../utils/pageThemeClasses'

export default function Sobre() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const tema = getContentPageTheme(theme)
  const { t } = useTranslation()

  return (
    <main className="min-h-full pt-16">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <div className={`mb-10 aspect-[21/9] w-full overflow-hidden rounded-2xl ${tema.heroFrame}`}>
          <img
            src="/sobre/lancha_portada.jpg"
            alt={t('sobre.alt')}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <h1 className="mb-2 text-3xl font-bold leading-tight sm:text-4xl">{t('sobre.titulo')}</h1>

        <div className={`mt-8 space-y-6 text-[15px] leading-[1.8] ${tema.body}`}>
          {['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].map((clave) => (
            <p key={clave}>
              <Trans i18nKey={`sobre.${clave}`} components={{ em: <em /> }} />
            </p>
          ))}
        </div>

        <p className={`mt-10 text-right text-sm font-medium italic ${tema.muted}`}>{t('sobre.firma')}</p>
      </div>
    </main>
  )
}
