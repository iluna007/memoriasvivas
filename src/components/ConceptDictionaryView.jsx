import { useMemo, useState } from 'react'
import conceptos from '../data/CMS/6_conceptos.js'
import { CONCEPT_SORT_OPTIONS, getSortedConceptos } from '../utils/sortArchivo.js'
import SortToolbar from './archivo/SortToolbar.jsx'

function ConceptoArchiveRow({ item, expanded, onToggle }) {
  const id = item.id_concepto
  const open = !!expanded[id]
  const full = item.descripción_breve ?? ''
  const hasMore = full.length > 280

  return (
    <div className="border-b border-zinc-500/15 last:border-b-0">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full flex-col gap-1 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06] sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-4"
      >
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[11px] text-inherit/55">{id}</span>
          <span className="mx-2 text-inherit/30">·</span>
          <span className="text-sm font-semibold">{item.concepto}</span>
          {item.eje && (
            <span className="mt-1 block text-[11px] uppercase tracking-wide text-inherit/45">{item.eje}</span>
          )}
        </div>
        <span className="shrink-0 text-[11px] text-inherit/50">{open ? 'Ocultar' : hasMore ? 'Ampliar' : ''}</span>
      </button>
      <div className="px-3 pb-2.5 text-xs leading-relaxed text-inherit/80 sm:px-4">
        {open ? (
          <p className="whitespace-pre-wrap border-t border-zinc-500/15 bg-black/[0.04] py-3">{full || '—'}</p>
        ) : (
          <p className={`text-inherit/75 ${hasMore ? 'line-clamp-3' : ''}`}>{full || '—'}</p>
        )}
      </div>
    </div>
  )
}

/** Índice alfabético: letra desplegable con términos bajo esa letra. */
function LetterAccordion({ letter, count, children }) {
  const [open, setOpen] = useState(false)
  const label = letter === '#' ? '0–9 · otros' : letter

  return (
    <div className="border-b border-zinc-500/20 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06] sm:px-4"
        aria-expanded={open}
      >
        <span className="flex min-w-0 flex-1 items-baseline gap-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-500/30 bg-black/[0.08] font-serif text-xl font-semibold tabular-nums text-inherit/90"
            aria-hidden
          >
            {letter === '#' ? '#' : letter}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-inherit/90">{label}</span>
            <span className="text-[11px] text-inherit/50">
              {count} {count === 1 ? 'término' : 'términos'}
            </span>
          </span>
        </span>
        <span className="shrink-0 text-lg leading-none text-inherit/45 tabular-nums">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="border-t border-zinc-500/15 bg-black/[0.02]">{children}</div>}
    </div>
  )
}

export function ConceptDictionaryView() {
  const [conceptSort, setConceptSort] = useState('abc')
  const [expanded, setExpanded] = useState(() => ({}))

  const conceptData = useMemo(() => getSortedConceptos(conceptos, conceptSort), [conceptSort])
  const dictionaryByLetter = conceptSort === 'abc'

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const { grouped, keys } = conceptData

  return (
    <section className="mb-4 sm:mb-5 last:mb-0" aria-labelledby="diccionario-panel-title">
      <h2 id="diccionario-panel-title" className="sr-only">
        Listado del diccionario
      </h2>
      <div className="w-full overflow-hidden border border-zinc-500/25 shadow-sm sm:rounded-md">
        <SortToolbar sortBy={conceptSort} onSort={setConceptSort} optionsMap={CONCEPT_SORT_OPTIONS} />
        <div>
          {keys.map((groupKey) => (
            <section key={groupKey}>
              {keys.length > 1 && !dictionaryByLetter && (
                <h3 className="border-b border-zinc-500/20 bg-black/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-inherit/60 sm:px-4 sm:py-2">
                  {groupKey}
                </h3>
              )}
              {dictionaryByLetter ? (
                <LetterAccordion letter={groupKey} count={grouped[groupKey].length}>
                  {grouped[groupKey].map((item) => (
                    <ConceptoArchiveRow key={item.id_concepto} item={item} expanded={expanded} onToggle={toggle} />
                  ))}
                </LetterAccordion>
              ) : (
                grouped[groupKey].map((item) => (
                  <ConceptoArchiveRow key={item.id_concepto} item={item} expanded={expanded} onToggle={toggle} />
                ))
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
