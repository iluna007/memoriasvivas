import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import ExpandableMediaCard from '../components/ExpandableMediaCard'
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
                  <ExpandableMediaCard
                    key={m.key}
                    id={`equipo-${m.key}`}
                    theme={theme}
                    imageSrc={imgSrc}
                    imageAlt={fullName}
                    title={fullName}
                    subtitle={m.cargo}
                    hint={[m.escuela, m.sede].filter(Boolean).join(' · ') || undefined}
                    isOpen={isOpen}
                    onToggle={() => toggle(m.key)}
                    expandLabel="Ver más"
                    collapseLabel="Ocultar biografía"
                  >
                    <p className={`select-text text-sm leading-relaxed ${t.cardBio}`}>{m.bio}</p>
                  </ExpandableMediaCard>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
