import { Fragment, useMemo, useState } from 'react'
import archivo from '../data/CMS/1_archivo.js'
import conceptos from '../data/CMS/6_conceptos.js'
import { normalizeConceptId } from '../data/cmsSphereData'
import {
  VIDEO_SORT_OPTIONS,
  CONCEPT_SORT_OPTIONS,
  getSortedVideos,
  getSortedConceptos
} from '../utils/sortArchivo.js'

function getYoutubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      if (u.pathname.startsWith('/embed/')) return url
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/')[2]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
    }
    return url
  } catch {
    return url
  }
}

function truncate(str, max) {
  if (str == null || str === '') return ''
  const s = String(str)
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}

/** Claves mostradas en el panel expandido o en columnas (evitar duplicar en «otros»). */
const RELATO_KNOWN_KEYS = new Set([
  'id_relato',
  'título',
  'tipo',
  'fecha_registro',
  'idioma',
  'url',
  'duracion',
  'consentimiento',
  'ids_conceptos',
  'Entrevista',
  'Registro Audiovisual',
  'Post-Producción',
  'Responsables y colaboradores',
  'ids_lugares',
  'ids_emociones',
  'ids_personas',
  'ids_practicas'
])

function SortToolbar({ sortBy, onSort, optionsMap }) {
  const keys = Object.keys(optionsMap)
  return (
    <div className="flex flex-wrap gap-1 border-b border-zinc-500/25 bg-black/[0.03] px-2 py-1.5 sm:px-3 sm:py-2">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onSort(key)}
          className={
            'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ' +
            (sortBy === key
              ? 'bg-white/15 text-inherit'
              : 'text-inherit/70 hover:bg-white/10 hover:text-inherit')
          }
        >
          {optionsMap[key].label}
        </button>
      ))}
    </div>
  )
}

function buildConceptLookup(rows) {
  const map = new Map()
  for (const c of rows) {
    const id = normalizeConceptId(c.id_concepto)
    if (id) map.set(id, c.concepto ?? id)
  }
  return map
}

function formatConceptIds(str, lookup) {
  if (!str || typeof str !== 'string') return '—'
  const parts = str.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
  if (parts.length === 0) return '—'
  return parts
    .map((raw) => {
      const id = normalizeConceptId(raw)
      if (!id) return raw
      const name = lookup.get(id)
      return name ? `${id} · ${name}` : id
    })
    .join(' · ')
}

const VIDEO_COL_COUNT = 9

function MetaBlock({ label, children }) {
  if (children == null || children === '') return null
  return (
    <div className="min-w-0">
      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-inherit/50">{label}</p>
      <div className="break-words text-xs leading-relaxed text-inherit/90">{children}</div>
    </div>
  )
}

function RelatoExpandedPanel({ item, conceptLookup }) {
  const embed = item.url ? getYoutubeEmbedUrl(item.url) : null
  const concepts = formatConceptIds(item.ids_conceptos, conceptLookup)

  const extras = Object.entries(item).filter(([k, v]) => {
    if (RELATO_KNOWN_KEYS.has(k)) return false
    if (v == null || v === '') return false
    return true
  })

  return (
    <div className="border-t border-zinc-500/15 bg-black/[0.03] p-3 sm:p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,34%)] lg:items-start lg:gap-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <MetaBlock label="Identificador (ISAD 3.1.1)">{item.id_relato}</MetaBlock>
          <MetaBlock label="Título (ISAD 3.1.2)">{item.título}</MetaBlock>
          <MetaBlock label="Nivel de descripción (ISAD 3.1.4)">{item.tipo}</MetaBlock>
          <MetaBlock label="Extensión / duración (ISAD 3.1.5)">{item.duracion}</MetaBlock>
          <MetaBlock label="Fecha de registro (ISAD 3.1.3)">{item.fecha_registro}</MetaBlock>
          <MetaBlock label="Idioma (ISAD 3.4.3)">{item.idioma}</MetaBlock>
          <MetaBlock label="Objeto digital (URL)">
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-400">
                {item.url}
              </a>
            ) : null}
          </MetaBlock>
          <MetaBlock label="Consentimiento / condiciones (resumen)">{item.consentimiento}</MetaBlock>
          <MetaBlock label="Puntos de acceso — conceptos">{concepts}</MetaBlock>
          <MetaBlock label="Entrevista">{item.Entrevista}</MetaBlock>
          <MetaBlock label="Registro audiovisual">{item['Registro Audiovisual']}</MetaBlock>
          <MetaBlock label="Post-producción">{item['Post-Producción']}</MetaBlock>
          <MetaBlock label="Responsables y colaboradores">{item['Responsables y colaboradores']}</MetaBlock>
          <MetaBlock label="Ids lugares">{item.ids_lugares}</MetaBlock>
          <MetaBlock label="Ids emociones">{item.ids_emociones}</MetaBlock>
          <MetaBlock label="Ids personas">{item.ids_personas}</MetaBlock>
          <MetaBlock label="Ids prácticas">{item.ids_practicas}</MetaBlock>
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-inherit/50">Vista previa (objeto digital)</p>
          {embed ? (
            <div className="aspect-video w-full max-w-lg overflow-hidden rounded-lg border border-zinc-500/25 bg-black shadow-inner lg:max-w-none">
              <iframe
                src={embed}
                title={item.título ? String(item.título).slice(0, 80) : 'Vídeo'}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <p className="text-xs text-inherit/50">No hay URL embebible para vista previa.</p>
          )}
        </div>
      </div>

      {extras.length > 0 && (
        <div className="mt-4 border-t border-zinc-500/15 pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-inherit/50">Otros campos</p>
          <dl className="grid grid-cols-1 gap-2 font-mono text-[11px] sm:grid-cols-2">
            {extras.map(([k, v]) => (
              <Fragment key={k}>
                <dt className="text-inherit/45">{k}</dt>
                <dd className="break-words text-inherit/80">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}

function ArchivoVideoTable({ grouped, keys, conceptLookup, expanded, onToggle, dictionaryByLetter }) {
  const th = 'border-b border-zinc-500/20 bg-black/[0.06] px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-inherit/55 sm:px-2.5'
  const td = 'border-b border-zinc-500/15 px-2 py-2 align-top text-xs sm:px-2.5 sm:text-sm'

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-left">
        <thead>
          <tr>
            <th className={th} title="ISAD(G) 3.1.1 · Identificador">
              Ref.
            </th>
            <th className={th} title="ISAD(G) 3.1.2 · Título">
              Título
            </th>
            <th className={`${th} hidden md:table-cell`} title="ISAD(G) 3.1.4 · Nivel de descripción">
              Nivel
            </th>
            <th className={`${th} hidden lg:table-cell`} title="ISAD(G) 3.1.5 · Extensión y soporte">
              Extensión
            </th>
            <th className={th} title="ISAD(G) 3.1.3 · Fechas">
              Fecha
            </th>
            <th className={`${th} hidden sm:table-cell`} title="ISAD(G) 3.4.3 · Idioma y alfabeto">
              Idioma
            </th>
            <th className={`${th} hidden xl:table-cell`} title="Puntos de acceso (conceptos)">
              Acceso
            </th>
            <th className={`${th} hidden 2xl:table-cell`} title="ISAD(G) 3.4.1 · Condiciones de acceso (resumen)">
              Cond. acceso
            </th>
            <th className={`${th} w-12 text-center`} title="Desplegar ficha y vista previa">
              {' '}
            </th>
          </tr>
        </thead>
        {keys.map((groupKey) => (
          <tbody key={groupKey}>
            {keys.length > 1 && !dictionaryByLetter && (
              <tr className="bg-black/[0.08]">
                <td colSpan={VIDEO_COL_COUNT} className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-inherit/65 sm:px-3">
                  {groupKey}
                </td>
              </tr>
            )}
            {grouped[groupKey].map((item) => {
              const id = item.id_relato
              const isOpen = !!expanded[id]
              const conceptsShort = truncate(formatConceptIds(item.ids_conceptos, conceptLookup), 36)
              const consentShort = truncate(item.consentimiento, 14)

              return (
                <Fragment key={id}>
                  <tr className="transition-colors hover:bg-white/[0.04]">
                    <td className={`${td} font-mono text-[11px] text-inherit/70`}>{id}</td>
                    <td className={`${td} max-w-0`}>
                      <span className="line-clamp-2 font-medium text-inherit/95" title={item.título}>
                        {item.título}
                      </span>
                    </td>
                    <td className={`${td} hidden text-inherit/80 md:table-cell`}>{item.tipo ?? '—'}</td>
                    <td className={`${td} hidden font-mono text-inherit/75 lg:table-cell`}>{item.duracion ?? '—'}</td>
                    <td className={`${td} whitespace-nowrap font-mono text-[11px] text-inherit/75`}>{item.fecha_registro ?? '—'}</td>
                    <td className={`${td} hidden text-inherit/75 sm:table-cell`}>{item.idioma ?? '—'}</td>
                    <td className={`${td} hidden max-w-[10rem] truncate text-[11px] text-inherit/70 xl:table-cell`} title={conceptsShort}>
                      {conceptsShort === '—' ? '—' : conceptsShort}
                    </td>
                    <td className={`${td} hidden max-w-[6rem] truncate text-[11px] text-inherit/70 2xl:table-cell`} title={item.consentimiento ? String(item.consentimiento) : ''}>
                      {consentShort || '—'}
                    </td>
                    <td className={`${td} w-12 text-center`}>
                      <button
                        type="button"
                        onClick={() => onToggle(id)}
                        className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-md border border-zinc-500/30 text-inherit/80 transition-colors hover:bg-white/10 touch-manipulation"
                        aria-expanded={isOpen}
                        aria-label={isOpen ? 'Contraer ficha del relato' : 'Expandir ficha y vista previa'}
                        title={isOpen ? 'Contraer' : 'Expandir ficha'}
                      >
                        <span className="text-lg leading-none">{isOpen ? '−' : '+'}</span>
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-black/[0.02]">
                      <td colSpan={VIDEO_COL_COUNT} className="p-0">
                        <RelatoExpandedPanel item={item} conceptLookup={conceptLookup} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        ))}
      </table>
    </div>
  )
}

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
            <span className="mt-1 block text-[11px] uppercase tracking-wide text-inherit/45">
              {item.eje}
            </span>
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

function ArchiveListBlock({ title, sortBy, onSort, optionsMap, grouped, keys, kind, dictionaryByLetter }) {
  const [expanded, setExpanded] = useState(() => ({}))
  const conceptLookup = useMemo(() => buildConceptLookup(conceptos), [])

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="mb-4 sm:mb-5 last:mb-0">
      <h2 className="sr-only">{title}</h2>

      <div className="w-full overflow-hidden border border-zinc-500/25 shadow-sm sm:rounded-md">
        <SortToolbar sortBy={sortBy} onSort={onSort} optionsMap={optionsMap} />
        {kind === 'video' ? (
          <ArchivoVideoTable
            grouped={grouped}
            keys={keys}
            conceptLookup={conceptLookup}
            expanded={expanded}
            onToggle={toggle}
            dictionaryByLetter={dictionaryByLetter}
          />
        ) : (
          <div>
            {keys.map((groupKey) => (
              <section key={groupKey}>
                {keys.length > 1 && !dictionaryByLetter && (
                  <h3 className="border-b border-zinc-500/20 bg-black/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-inherit/60 sm:px-4 sm:py-2">
                    {groupKey}
                  </h3>
                )}
                {kind === 'concepto' && dictionaryByLetter ? (
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
        )}
      </div>
    </section>
  )
}

export default function Archivo() {
  const [videoSort, setVideoSort] = useState('year')
  const [conceptSort, setConceptSort] = useState('abc')

  const videoData = useMemo(() => getSortedVideos(archivo, videoSort), [videoSort])
  const conceptData = useMemo(() => getSortedConceptos(conceptos, conceptSort), [conceptSort])
  const dictionaryByLetter = conceptSort === 'abc'

  return (
    <main className="min-h-full w-full pt-16">
      <h1 className="sr-only">Archivo</h1>
      <div className="w-full max-w-none px-2 pb-6 pt-2 sm:px-4 lg:px-6">
        <ArchiveListBlock
          title="Relatos audiovisuales"
          sortBy={videoSort}
          onSort={setVideoSort}
          optionsMap={VIDEO_SORT_OPTIONS}
          grouped={videoData.grouped}
          keys={videoData.keys}
          kind="video"
          dictionaryByLetter={false}
        />

        <ArchiveListBlock
          title="Diccionario de conceptos"
          sortBy={conceptSort}
          onSort={setConceptSort}
          optionsMap={CONCEPT_SORT_OPTIONS}
          grouped={conceptData.grouped}
          keys={conceptData.keys}
          kind="concepto"
          dictionaryByLetter={dictionaryByLetter}
        />
      </div>
    </main>
  )
}
