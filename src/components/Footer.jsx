import { useState, useEffect } from 'react'
import { getContentPageTheme } from '../utils/pageThemeClasses'
import { CITATION_HELP, CITATION_APA, CITATION_CHICAGO } from '../data/citationStrings'

const LINKS = {
  sedeSur: 'https://sededelsur.ucr.ac.cr/',
  accionSocial: 'https://www.accionsocial.ucr.ac.cr/',
  filosofia: 'https://filosofia.ucr.ac.cr/',
  arquitectura: 'https://arquis.ucr.ac.cr/',
  repo: 'https://github.com/iluna007/memoriasvivas',
  portfolio: 'https://ikerluna.netlify.app/',
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

function IconQuote({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M7.5 4.5h-3a2 2 0 00-2 2v4a2 2 0 002 2h1v3l3-3M17.5 4.5h-3a2 2 0 00-2 2v4a2 2 0 002 2h1v3l3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const VISITOR_COUNT_CACHE = 'memoriasvivas-visitor-count'

function VisitorCounter({ theme, t }) {
  const [count, setCount] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(VISITOR_COUNT_CACHE)
      if (cached != null) {
        const n = parseInt(cached, 10)
        if (!Number.isNaN(n)) {
          setCount(n)
          setStatus('done')
          return
        }
      }
    } catch {
      /* private mode */
    }

    setStatus('loading')
    fetch('/.netlify/functions/visitor-count')
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.count === 'number') {
          try {
            sessionStorage.setItem(VISITOR_COUNT_CACHE, String(data.count))
          } catch {
            /* ignore */
          }
          setCount(data.count)
          setStatus('done')
        } else {
          setCount(null)
          setStatus('unavailable')
        }
      })
      .catch(() => {
        setCount(null)
        setStatus('unavailable')
      })
  }, [])

  const box =
    theme === 'light'
      ? 'border border-zinc-200 bg-zinc-50/90 text-zinc-900'
      : 'border border-white/10 bg-white/[0.04] text-white'

  return (
    <div className={`rounded-xl px-4 py-3 text-center ${box}`} aria-live="polite">
      <p className={`text-[10px] font-semibold uppercase tracking-wide ${t.muted}`}>Visitas al sitio</p>
      <p className={`mt-1 min-h-[2rem] text-2xl font-semibold tabular-nums ${t.cardTitle}`}>
        {status === 'loading' ? '…' : typeof count === 'number' ? count.toLocaleString('es-CR') : '—'}
      </p>
      <p className={`mt-1.5 text-[10px] leading-snug ${t.muted}`}>
        {status === 'unavailable'
          ? 'Contador disponible en el sitio publicado (Netlify). En desarrollo local no hay función serverless.'
          : 'Total acumulado en producción (Netlify Blobs). En esta sesión se cuenta una visita al cargar la aplicación.'}
      </p>
    </div>
  )
}

function CitationDialog({ open, onClose, theme, t }) {
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const copy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      window.setTimeout(() => setCopied(null), 2200)
    } catch {
      setCopied('fail')
      window.setTimeout(() => setCopied(null), 3500)
    }
  }

  if (!open) return null

  const backdrop = theme === 'light' ? 'bg-zinc-900/45' : 'bg-black/65'
  const panel =
    theme === 'light'
      ? 'border border-zinc-200 bg-white text-zinc-900 shadow-2xl'
      : 'border border-white/12 bg-zinc-950 text-white shadow-2xl'
  const preBox =
    theme === 'light'
      ? 'border border-zinc-200 bg-zinc-50 text-zinc-800'
      : 'border border-white/10 bg-black/40 text-white/90'
  const closeBtn =
    theme === 'light'
      ? 'rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
      : 'rounded-lg px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 hover:text-white'
  const copyBtn =
    theme === 'light'
      ? 'rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50'
      : 'rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10'

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-center p-4 backdrop-blur-sm sm:items-center ${backdrop}`}
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="citation-dialog-title"
        className={`max-h-[min(88vh,760px)] w-full max-w-2xl overflow-y-auto rounded-2xl p-5 sm:p-6 ${panel}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="citation-dialog-title" className={`pr-4 text-lg font-semibold leading-snug ${t.cardTitle}`}>
            Citar este proyecto
          </h2>
          <button type="button" onClick={onClose} className={`shrink-0 touch-manipulation ${closeBtn}`}>
            Cerrar
          </button>
        </div>

        <p className={`mb-5 text-sm leading-relaxed ${t.body}`}>{CITATION_HELP}</p>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className={`text-sm font-semibold ${t.cardTitle}`}>APA (7.ª ed.)</h3>
              <button type="button" onClick={() => copy('apa', CITATION_APA)} className={`touch-manipulation ${copyBtn}`}>
                {copied === 'apa' ? 'Copiado' : 'Copiar APA'}
              </button>
            </div>
            <pre
              className={`max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-xl p-3 text-left text-[11px] leading-relaxed sm:text-xs ${preBox}`}
              tabIndex={0}
            >
              {CITATION_APA}
            </pre>
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className={`text-sm font-semibold ${t.cardTitle}`}>Chicago (17.ª ed., bibliografía)</h3>
              <button type="button" onClick={() => copy('chi', CITATION_CHICAGO)} className={`touch-manipulation ${copyBtn}`}>
                {copied === 'chi' ? 'Copiado' : 'Copiar Chicago'}
              </button>
            </div>
            <pre
              className={`max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-xl p-3 text-left text-[11px] leading-relaxed sm:text-xs ${preBox}`}
              tabIndex={0}
            >
              {CITATION_CHICAGO}
            </pre>
          </div>
        </div>

        {copied === 'fail' && (
          <p className={`mt-4 text-xs ${theme === 'light' ? 'text-amber-800' : 'text-amber-200/90'}`}>
            No se pudo usar el portapapeles desde el navegador. Selecciona el texto en los recuadros y copia manualmente
            (Ctrl+C o Cmd+C).
          </p>
        )}

        <p className={`mt-5 text-xs leading-relaxed ${t.muted}`}>
          Revisa el archivo <code className="rounded bg-black/10 px-1 py-0.5 dark:bg-white/10">CITATION.cff</code> en la raíz
          del repositorio para metadatos actualizados. Si el portapapeles no está disponible, selecciona el texto y copia
          manualmente (Ctrl+C / Cmd+C).
        </p>
      </div>
    </div>
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
  const [citeOpen, setCiteOpen] = useState(false)

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
              <span className={`font-semibold ${t.cardTitle}`}>EC 649 · Memorias Vivas</span>
              <span className={t.muted}> — </span>
              Preservación de la identidad local y patrimonio cultural de comunidades aledañas al Golfo Dulce en la
              Península de Osa.
            </p>
            <div className="mt-5 max-w-sm">
              <VisitorCounter theme={theme} t={t} />
            </div>
          </div>

          <div className="min-w-0 shrink-0 space-y-4 lg:max-w-md">
            <p className={`text-xs font-semibold uppercase tracking-wide ${t.muted}`}>Enlaces institucionales</p>
            <ul className="grid list-none grid-cols-2 grid-rows-3 gap-x-5 gap-y-5 p-0 sm:gap-x-6 sm:gap-y-6">
              {[
                {
                  src: '/branding/institucional-ef-filosofia.png',
                  alt: 'Escuela de Filosofía',
                  href: LINKS.filosofia,
                },
                {
                  src: '/branding/institucional-vas-accion-social.png',
                  alt: 'Vicerrectoría de Acción Social',
                  href: LINKS.accionSocial,
                },
                {
                  src: '/branding/institucional-ssur-sede-sur.png',
                  alt: 'Sede del Sur',
                  href: LINKS.sedeSur,
                },
                {
                  src: '/branding/institucional-efll-filologia.png',
                  alt: 'Escuela de Filología, Lingüística y Literatura',
                  href: null,
                },
                {
                  src: '/branding/institucional-eaq-arquitectura.png',
                  alt: 'Escuela de Arquitectura',
                  href: LINKS.arquitectura,
                },
                {
                  src: '/branding/institucional-ec649-memorias-vivas.png',
                  alt: 'EC 649 · Memorias Vivas',
                  href: null,
                },
              ].map((logo) => {
                const imgClass = `h-11 w-auto max-w-full object-contain opacity-80 transition-opacity hover:opacity-100 sm:h-14 ${
                  theme === 'light' ? 'brightness-90 invert' : ''
                }`
                const img = (
                  <img src={logo.src} alt={logo.alt} className={imgClass} draggable={false} />
                )
                return (
                  <li key={logo.src} className="flex items-center justify-center">
                    {logo.href ? (
                      <a
                        href={logo.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center"
                      >
                        {img}
                      </a>
                    ) : (
                      <span className="inline-flex items-center justify-center">{img}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className={`mt-10 border-t pt-8 ${t.divider}`}>
          <div
            className={`mx-auto flex max-w-4xl flex-nowrap items-center justify-center gap-x-2 overflow-x-auto pb-1 text-xs leading-snug sm:gap-x-4 sm:text-sm ${t.body}`}
          >
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
              <IconCode className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${theme === 'light' ? 'text-zinc-500' : 'text-white/45'}`} aria-hidden />
              Sitio de <span className="font-medium">código abierto</span>.{' '}
              <FooterLink href={LINKS.repo} icon={IconGitHub} t={t}>
                Ver en GitHub
              </FooterLink>
            </span>
            <span className={`shrink-0 px-0.5 ${t.muted}`} aria-hidden>
              ·
            </span>
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
              <IconSpark className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${theme === 'light' ? 'text-zinc-500' : 'text-white/45'}`} aria-hidden />
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
            <span className={`shrink-0 px-0.5 ${t.muted}`} aria-hidden>
              ·
            </span>
            <button
              type="button"
              onClick={() => setCiteOpen(true)}
              className={`inline-flex min-h-[44px] shrink-0 touch-manipulation items-center gap-1 whitespace-nowrap rounded-md px-1 py-2 font-medium underline-offset-2 transition-colors hover:underline sm:min-h-0 sm:py-1 ${t.link}`}
            >
              <IconQuote className="h-3.5 w-3.5 shrink-0 opacity-80 sm:h-4 sm:w-4" aria-hidden />
              Cómo citar · APA y Chicago
            </button>
          </div>

          <p className={`mt-6 text-xs sm:text-center ${t.muted}`}>
            © {new Date().getFullYear()} Universidad de Costa Rica · Memorias Vivas
          </p>
        </div>
      </div>

      <CitationDialog open={citeOpen} onClose={() => setCiteOpen(false)} theme={theme} t={t} />
    </footer>
  )
}
