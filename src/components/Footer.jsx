import { getContentPageTheme } from '../utils/pageThemeClasses'

const LINKS = {
  ucr: 'https://www.ucr.ac.cr/',
  sedeSur: 'https://sededelsur.ucr.ac.cr/',
  accionSocial: 'https://www.accionsocial.ucr.ac.cr/',
  filosofia: 'https://filosofia.ucr.ac.cr/',
  arquitectura: 'https://arquis.ucr.ac.cr/',
  repo: 'https://github.com/iluna007/memoriasvivas',
  portfolio: 'https://ikerluna.netlify.app/',
  youtube: 'https://www.youtube.com/@MemoriasVivasdelsur',
  instagram: 'https://www.instagram.com/memo.riasvivas/',
}

function IconLink({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14 21 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconGitHub({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.631 1.032 1.631 1.032.89 1.524 2.341 1.084 2.91.828.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function IconCode({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconSpark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" />
    </svg>
  )
}

function IconYouTube({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function IconInstagram({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function SocialIconButton({ href, label, Icon, theme }) {
  const ring =
    theme === 'light'
      ? 'border border-zinc-300 bg-white/70 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-100'
      : 'border border-white/15 bg-white/5 text-white hover:border-white/25 hover:bg-white/10'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${ring}`}
    >
      <Icon className="h-5 w-5" />
    </a>
  )
}

function FooterLink({ href, children, icon: Icon, t }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-md py-1 text-sm underline-offset-2 transition-colors hover:underline ${t.link}`}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-80" /> : null}
      {children}
    </a>
  )
}

/**
 * @param {{ theme?: 'light' | 'dark' }} props
 */
export function Footer({ theme = 'dark' }) {
  const t = getContentPageTheme(theme)
  const frame = theme === 'light' ? 'border-zinc-200 bg-zinc-100/80' : 'border-white/10 bg-black/25'

  return (
    <footer className={`relative z-10 border-t ${frame} backdrop-blur-sm`} role="contentinfo">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="max-w-xl space-y-4">
            <div>
              <p className={`text-sm font-semibold leading-snug ${t.cardTitle}`}>Universidad de Costa Rica</p>
              <p className={`mt-2 text-sm leading-relaxed ${t.body}`}>
                Proyecto adscrito a la{' '}
                <a
                  href={LINKS.accionSocial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-medium underline-offset-2 hover:underline ${t.link}`}
                >
                  Vicerrectoría de Acción Social
                </a>{' '}
                de la Universidad de Costa Rica.
              </p>
            </div>
            <p
              className={`border-l-2 pl-4 text-sm leading-relaxed ${t.body} ${
                theme === 'light' ? 'border-zinc-300' : 'border-white/25'
              }`}
            >
              <span className={`font-semibold ${t.cardTitle}`}>EC 640 · Memorias Vivas</span>
              <span className={t.muted}> — </span>
              Preservación de la identidad local y patrimonio cultural de comunidades aledañas al Golfo Dulce en la
              Península de Osa.
            </p>
          </div>

          <div className="min-w-0 shrink-0 space-y-4 lg:max-w-sm">
            <p className={`text-xs font-semibold uppercase tracking-wide ${t.muted}`}>Enlaces institucionales</p>
            <ul className={`flex flex-col gap-2 text-sm ${t.body}`}>
              <li>
                <FooterLink href={LINKS.ucr} icon={IconLink} t={t}>
                  Universidad de Costa Rica
                </FooterLink>
              </li>
              <li>
                <FooterLink href={LINKS.sedeSur} icon={IconLink} t={t}>
                  Sede del Sur
                </FooterLink>
              </li>
              <li>
                <FooterLink href={LINKS.accionSocial} icon={IconLink} t={t}>
                  Vicerrectoría de Acción Social
                </FooterLink>
              </li>
              <li>
                <FooterLink href={LINKS.filosofia} icon={IconLink} t={t}>
                  Escuela de Filosofía
                </FooterLink>
              </li>
              <li>
                <FooterLink href={LINKS.arquitectura} icon={IconLink} t={t}>
                  Escuela de Arquitectura
                </FooterLink>
              </li>
            </ul>
            <div className="pt-2">
              <p className={`text-xs font-semibold uppercase tracking-wide ${t.muted}`}>Redes del proyecto</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <SocialIconButton
                  href={LINKS.youtube}
                  label="Memorias Vivas en YouTube"
                  Icon={IconYouTube}
                  theme={theme}
                />
                <SocialIconButton
                  href={LINKS.instagram}
                  label="Memorias Vivas en Instagram"
                  Icon={IconInstagram}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-10 border-t pt-8 ${t.divider}`}>
          <div
            className={`mx-auto flex max-w-2xl flex-col gap-5 text-sm leading-relaxed ${t.body} sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-12 sm:gap-y-3`}
          >
            <p className="flex items-start gap-2.5 sm:items-center">
              <IconCode className={`mt-0.5 h-4 w-4 shrink-0 sm:mt-0 ${theme === 'light' ? 'text-zinc-500' : 'text-white/45'}`} aria-hidden />
              <span>
                Sitio de <span className="font-medium">código abierto</span>.{' '}
                <FooterLink href={LINKS.repo} icon={IconGitHub} t={t}>
                  Ver en GitHub
                </FooterLink>
              </span>
            </p>
            <p className="flex items-start gap-2.5 sm:items-center">
              <IconSpark className={`mt-0.5 h-4 w-4 shrink-0 sm:mt-0 ${theme === 'light' ? 'text-zinc-500' : 'text-white/45'}`} aria-hidden />
              <span>
                Diseño{' '}
                <a
                  href={LINKS.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-medium underline-offset-2 hover:underline ${t.link}`}
                >
                  Iker Luna
                </a>
                .
              </span>
            </p>
          </div>
          <p className={`mt-8 text-xs sm:text-center ${t.muted}`}>
            © {new Date().getFullYear()} Universidad de Costa Rica · Memorias Vivas
          </p>
        </div>
      </div>
    </footer>
  )
}
