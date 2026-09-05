import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { EQUIPO, pickEquipoFoto } from '../data/equipo'
import { getContentPageTheme } from '../utils/pageThemeClasses'

/** Reparte ítems en columnas fijas (LTR: índice % cols). No rebalancea al expandir. */
function splitIntoColumns(items, cols) {
  if (cols <= 1) return [items]
  const columns = Array.from({ length: cols }, () => [])
  items.forEach((item, i) => {
    columns[i % cols].push(item)
  })
  return columns
}

function useEquipoColumns() {
  const [cols, setCols] = useState(1)

  useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1024px)')
    const mqSm = window.matchMedia('(min-width: 640px)')
    const sync = () => {
      if (mqLg.matches) setCols(3)
      else if (mqSm.matches) setCols(2)
      else setCols(1)
    }
    sync()
    mqLg.addEventListener('change', sync)
    mqSm.addEventListener('change', sync)
    return () => {
      mqLg.removeEventListener('change', sync)
      mqSm.removeEventListener('change', sync)
    }
  }, [])

  return cols
}

export default function Equipo() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const t = getContentPageTheme(theme)
  const cols = useEquipoColumns()
  const [expanded, setExpanded] = useState(() => ({}))
  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))

  // Una foto por persona por visita a la página (aleatoria solo si hay varias).
  const fotoByKey = useMemo(() => {
    const map = {}
    for (const m of EQUIPO) {
      map[m.key] = pickEquipoFoto(m.fotos)
    }
    return map
  }, [])

  const columns = useMemo(() => splitIntoColumns(EQUIPO, cols), [cols])

  return (
    <main className="min-h-full pt-16">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="flex items-start gap-6">
          {columns.map((colItems, colIndex) => (
            <div key={colIndex} className="flex min-w-0 flex-1 flex-col gap-6">
              {colItems.map((m) => {
                const isOpen = !!expanded[m.key]
                const fullName = `${m.nombre} ${m.apellidos}`
                const placeholder = `https://placehold.co/400x480/1a1a1a/666?text=${encodeURIComponent(fullName.slice(0, 18))}`
                const imgSrc = fotoByKey[m.key] || placeholder

                return (
                  <article
                    key={m.key}
                    id={`equipo-${m.key}`}
                    className={`overflow-hidden rounded-2xl ${t.card}`}
                  >
                    <div className="relative aspect-[5/6] w-full bg-zinc-900">
                      <img
                        src={imgSrc}
                        alt={fullName}
                        className={`h-full w-full object-cover object-center opacity-90 transition-[filter] duration-500 ease-out ${
                          isOpen ? 'grayscale-0' : 'grayscale'
                        }`}
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    <div className="p-4 sm:p-5">
                      <h2 className={`mb-1 text-lg font-semibold ${t.cardTitle}`}>{fullName}</h2>
                      <p className={`mb-1 text-xs font-medium ${t.cardSub}`}>{m.cargo}</p>
                      {(m.escuela || m.sede) && (
                        <p className={`mb-3 text-[11px] ${t.cardHint}`}>
                          {[m.escuela, m.sede].filter(Boolean).join(' · ')}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          toggle(m.key)
                          if (!isOpen) {
                            requestAnimationFrame(() => {
                              document.getElementById(`equipo-${m.key}`)?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest',
                              })
                            })
                          }
                        }}
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
                            {m.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
