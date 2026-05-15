import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { COMUNIDAD } from '../data/comunidad'
import { getContentPageTheme } from '../utils/pageThemeClasses'

const BIO_PENDIENTE =
  'Próximamente añadiremos una biografía y más información sobre esta persona de la comunidad.'

export default function Personas() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const t = getContentPageTheme(theme)
  const [expanded, setExpanded] = useState(() => ({}))
  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <main className="min-h-full pt-16">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Comunidad</h1>
        <p className={`mb-10 max-w-2xl text-sm leading-relaxed sm:text-base ${t.lead}`}>
          Personas que forman parte de esta constelación. Las fichas se irán completando con fotografía y biografía.
        </p>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {COMUNIDAD.map((p) => {
            const isOpen = !!expanded[p.key]
            const placeholder = `https://placehold.co/400x480/1a1a1a/666?text=${encodeURIComponent(p.nombre.slice(0, 18))}`
            const imgSrc = p.imagenSrc?.trim() ? p.imagenSrc : placeholder
            const bioText = p.bio?.trim() ? p.bio : BIO_PENDIENTE

            return (
              <article key={p.key} className={`mb-6 break-inside-avoid overflow-hidden rounded-2xl ${t.card}`}>
                <div className="relative aspect-[5/6] w-full bg-zinc-900">
                  <img
                    src={imgSrc}
                    alt=""
                    className="h-full w-full object-cover object-center opacity-90"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="p-4 sm:p-5">
                  <h2
                    className={`text-lg font-semibold ${t.cardTitle} ${
                      p.cargo || p.subtitulo ? 'mb-1' : 'mb-3'
                    }`}
                  >
                    {p.nombre}
                  </h2>
                  {p.cargo ? <p className={`mb-1 text-xs font-medium ${t.cardSub}`}>{p.cargo}</p> : null}
                  {p.subtitulo ? <p className={`mb-3 text-[11px] ${t.cardHint}`}>{p.subtitulo}</p> : null}
                  {p.cargo && !p.subtitulo ? <div className="mb-3" aria-hidden /> : null}

                  <button
                    type="button"
                    onClick={() => toggle(p.key)}
                    className={`flex w-full touch-manipulation items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${t.btnOutline}`}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'Ocultar biografía' : 'Ver más'}
                    <span className={`inline-block transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden>
                      ▼
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className={`mt-4 select-text border-t pt-4 text-sm leading-relaxed ${t.cardBio} ${t.divider}`}>
                        {bioText}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
