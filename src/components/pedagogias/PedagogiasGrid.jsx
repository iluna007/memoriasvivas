import { useEffect, useMemo, useState } from 'react'
import ExpandableMediaCard from '../ExpandableMediaCard'
import { getContentPageTheme } from '../../utils/pageThemeClasses'
import {
  PEDAGOGIAS_POR_CATEGORIA,
  PEDAGOGIAS_LICENCIA,
  isExternalPedagogiasUrl,
} from '../../data/pedagogias'

function CCIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="10.5" />
      <path d="M8.6 9.3a3 3 0 100 5.4M15.4 9.3a3 3 0 100 5.4" strokeLinecap="round" />
    </svg>
  )
}

function AvisoLicencia({ theme }) {
  const isLight = theme === 'light'
  const box = isLight
    ? 'border border-zinc-200 bg-white text-zinc-800'
    : 'border border-white/15 bg-white/[0.06] text-white/90'
  const iconWrap = isLight ? 'text-zinc-700' : 'text-white'
  const linkCls = isLight
    ? 'underline decoration-zinc-400 hover:text-zinc-600'
    : 'underline decoration-white/50 hover:text-white'

  return (
    <div className={`mb-8 flex items-start gap-3 rounded-xl px-5 py-4 text-sm leading-relaxed sm:text-[15px] ${box}`}>
      <CCIcon className={`mt-0.5 h-6 w-6 flex-shrink-0 ${iconWrap}`} />
      <p>
        Todo el material de esta sección se publica bajo licencia{' '}
        <a href={PEDAGOGIAS_LICENCIA.url} target="_blank" rel="noopener noreferrer" className={`font-semibold ${linkCls}`}>
          {PEDAGOGIAS_LICENCIA.nombre}
        </a>
        : puedes descargarlo, usarlo y adaptarlo citando la fuente, siempre que no sea con fines comerciales y compartiendo bajo la misma licencia.
      </p>
    </div>
  )
}

/** Mini-tarjeta de un archivo individual, dentro de una categoría expandida. */
function MaterialItemCard({ item, theme }) {
  const isLight = theme === 'light'
  const t = getContentPageTheme(theme)
  const disponible = Boolean(item.url)
  const externo = isExternalPedagogiasUrl(item.url)
  const placeholderImg = `https://placehold.co/320x200/${isLight ? 'e4e4e7/71717a' : '1a1a1a/666'}?text=${encodeURIComponent(item.titulo.slice(0, 20))}`

  const badgeCls = isLight
    ? 'inline-flex w-fit items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500'
    : 'inline-flex w-fit items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/50'

  const btnBase =
    'inline-flex min-h-[40px] w-full items-center justify-center rounded-lg px-3 py-2 text-xs font-medium touch-manipulation'
  const btnCls = disponible
    ? `${btnBase} transition-colors ${t.btnOutline}`
    : isLight
      ? `${btnBase} cursor-not-allowed border border-zinc-200 bg-zinc-50 text-zinc-400`
      : `${btnBase} cursor-not-allowed border border-white/10 bg-white/[0.03] text-white/35`

  return (
    <div className={`overflow-hidden rounded-lg ${t.card}`}>
      <div className="aspect-[8/5] w-full bg-zinc-900">
        <img src={item.foto || placeholderImg} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="p-3.5">
        <h4 className={`mb-1 text-sm font-semibold ${t.cardTitle}`}>{item.titulo}</h4>
        {item.descripcion && <p className={`mb-2.5 text-xs leading-relaxed ${t.cardSub}`}>{item.descripcion}</p>}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className={badgeCls}>{item.formato}</span>
          {item.fecha && <span className={badgeCls}>{item.fecha}</span>}
        </div>
        {disponible ? (
          <a
            href={item.url}
            {...(externo
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : { download: true })}
            className={btnCls}
          >
            Descargar
          </a>
        ) : (
          <span className={btnCls} aria-disabled="true" title="Añade archivo_url en el CMS para activar la descarga">
            Descargar
          </span>
        )}
      </div>
    </div>
  )
}

function portadaCategoria(grupo, isLight) {
  const conFoto = grupo.materiales.find((m) => m.foto)
  if (conFoto?.foto) return conFoto.foto
  const bg = isLight ? 'e4e4e7/71717a' : '1a1a1a/666'
  return `https://placehold.co/400x480/${bg}?text=${encodeURIComponent(grupo.categoria.slice(0, 22))}`
}

/** Reparte ítems en columnas fijas (mismo criterio que /equipo). */
function splitIntoColumns(items, cols) {
  if (cols <= 1) return [items]
  const columns = Array.from({ length: cols }, () => [])
  items.forEach((item, i) => {
    columns[i % cols].push(item)
  })
  return columns
}

function usePedagogiasColumns() {
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

export default function PedagogiasGrid({ theme = 'dark' }) {
  const isLight = theme === 'light'
  const [expanded, setExpanded] = useState(() => ({}))
  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  const cols = usePedagogiasColumns()
  const columns = useMemo(
    () => splitIntoColumns(PEDAGOGIAS_POR_CATEGORIA, cols),
    [cols],
  )

  return (
    <div>
      <AvisoLicencia theme={theme} />
      <div className="flex items-start gap-6">
        {columns.map((colItems, colIndex) => (
          <div key={colIndex} className="flex min-w-0 flex-1 flex-col gap-6">
            {colItems.map((grupo) => {
              const isOpen = !!expanded[grupo.key]
              const n = grupo.materiales.length
              return (
                <ExpandableMediaCard
                  key={grupo.key}
                  id={`pedagogias-${grupo.key}`}
                  theme={theme}
                  imageSrc={portadaCategoria(grupo, isLight)}
                  imageAlt={grupo.categoria}
                  title={grupo.categoria}
                  subtitle={`${n} ${n === 1 ? 'material' : 'materiales'}`}
                  hint={PEDAGOGIAS_LICENCIA.nombre}
                  isOpen={isOpen}
                  onToggle={() => toggle(grupo.key)}
                  expandLabel="Ver materiales"
                  collapseLabel="Ocultar materiales"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {grupo.materiales.map((item) => (
                      <MaterialItemCard key={item.id} item={item} theme={theme} />
                    ))}
                  </div>
                </ExpandableMediaCard>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
