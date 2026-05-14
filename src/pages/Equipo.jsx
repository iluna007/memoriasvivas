import { useState } from 'react'
import { EQUIPO } from '../data/equipo'

export default function Equipo() {
  const [expanded, setExpanded] = useState(() => ({}))
  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <main className="min-h-full bg-black pt-16 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Miembros de la comunidad</h1>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          Equipo de trabajo detrás de Memorias Vivas. Cada tarjeta puede ampliarse para leer una breve
          biografía.
        </p>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {EQUIPO.map((m) => {
            const isOpen = !!expanded[m.key]
            const fullName = `${m.nombre} ${m.apellidos}`
            const placeholder = `https://placehold.co/400x480/1a1a1a/666?text=${encodeURIComponent(fullName.slice(0, 18))}`

            return (
              <article
                key={m.key}
                className="mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg backdrop-blur-sm"
              >
                <div className="relative aspect-[5/6] w-full bg-zinc-900">
                  <img
                    src={placeholder}
                    alt=""
                    className="h-full w-full object-cover object-center opacity-90"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="p-4 sm:p-5">
                  <h2 className="mb-1 text-lg font-semibold text-white">{fullName}</h2>
                  <p className="mb-1 text-xs font-medium text-white/55">{m.cargo}</p>
                  {(m.escuela || m.sede) && (
                    <p className="mb-3 text-[11px] text-white/40">
                      {[m.escuela, m.sede].filter(Boolean).join(' · ')}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => toggle(m.key)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 active:bg-white/15 touch-manipulation"
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'Ocultar biografía' : 'Ver más'}
                    <span
                      className={`inline-block transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    >
                      ▼
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="mt-4 select-text border-t border-white/10 pt-4 text-sm leading-relaxed text-white/80">
                        {m.bio}
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
