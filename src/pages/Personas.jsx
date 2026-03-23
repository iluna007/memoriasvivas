import { useState } from 'react'
import { getPersonasFromVideos } from '../data/videoPersonas'

const personas = getPersonasFromVideos()

export default function Personas() {
  const [expanded, setExpanded] = useState(() => ({}))

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <main className="pt-16 min-h-full bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Personas en los relatos</h1>
        <p className="text-white/75 text-sm sm:text-base max-w-2xl mb-10 leading-relaxed">
          Incluye participantes referidos en los relatos (ids de personas), más nombres extraídos de los créditos de
          cada audiovisual: entrevista, registro, post-producción y responsables. Cada tarjeta puede ampliarse para
          ver la biografía del proyecto y/o el detalle por relato.
        </p>

        {/* Mampostería: columnas CSS + break-inside-avoid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {personas.map((p) => {
            const isOpen = !!expanded[p.key]
            return (
              <article
                key={p.key}
                className="break-inside-avoid mb-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden shadow-lg"
              >
                <div className="relative aspect-[5/6] w-full bg-zinc-900">
                  <img
                    src={p.imagePlaceholder}
                    alt=""
                    className="h-full w-full object-cover object-center opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="p-4 sm:p-5">
                  <h2
                    className={`text-lg font-semibold text-white ${p.id_persona ? 'mb-1' : 'mb-3'}`}
                  >
                    {p.nombre}
                  </h2>
                  {p.id_persona && (
                    <p className="text-[11px] text-white/40 font-mono mb-3">{p.id_persona}</p>
                  )}

                  <button
                    type="button"
                    onClick={() => toggle(p.key)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 active:bg-white/15 px-3 py-2.5 text-sm font-medium text-white/90 transition-colors touch-manipulation"
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
                    <div className="overflow-hidden min-h-0">
                      <p className="text-sm text-white/80 leading-relaxed pt-4 border-t border-white/10 mt-4 select-text whitespace-pre-line">
                        {p.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {personas.length === 0 && (
          <p className="text-white/60 text-sm">No hay personas asociadas aún en el archivo de relatos.</p>
        )}
      </div>
    </main>
  )
}
