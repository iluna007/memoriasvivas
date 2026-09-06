import { getContentPageTheme } from '../utils/pageThemeClasses'

/**
 * Tarjeta con portada + cuerpo expandible (misma base visual que /equipo).
 *
 * @param {{
 *   id?: string,
 *   theme?: 'light' | 'dark',
 *   imageSrc: string,
 *   imageAlt?: string,
 *   title: string,
 *   subtitle?: string,
 *   hint?: string,
 *   isOpen: boolean,
 *   onToggle: () => void,
 *   expandLabel?: string,
 *   collapseLabel?: string,
 *   grayscaleWhenClosed?: boolean,
 *   children?: import('react').ReactNode,
 * }} props
 */
export default function ExpandableMediaCard({
  id,
  theme = 'dark',
  imageSrc,
  imageAlt = '',
  title,
  subtitle,
  hint,
  isOpen,
  onToggle,
  expandLabel = 'Ver más',
  collapseLabel = 'Ocultar',
  grayscaleWhenClosed = true,
  children,
}) {
  const t = getContentPageTheme(theme)

  return (
    <article id={id} className={`overflow-hidden rounded-2xl ${t.card}`}>
      <div className="relative aspect-[5/6] w-full bg-zinc-900">
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`h-full w-full object-cover object-center opacity-90 transition-[filter] duration-500 ease-out ${
            grayscaleWhenClosed && !isOpen ? 'grayscale' : 'grayscale-0'
          }`}
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-3">
          <h2 className={`mb-1 text-lg font-semibold ${t.cardTitle}`}>{title}</h2>
          {subtitle ? <p className={`mb-1 text-xs font-medium ${t.cardSub}`}>{subtitle}</p> : null}
          {hint ? <p className={`text-[11px] ${t.cardHint}`}>{hint}</p> : null}
        </div>

        <button
          type="button"
          onClick={() => {
            onToggle()
            if (!isOpen && id) {
              requestAnimationFrame(() => {
                document.getElementById(id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                })
              })
            }
          }}
          className={`flex w-full touch-manipulation items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${t.btnOutline}`}
          aria-expanded={isOpen}
        >
          {isOpen ? collapseLabel : expandLabel}
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
            <div className={`mt-4 border-t pt-4 ${t.divider}`}>{children}</div>
          </div>
        </div>
      </div>
    </article>
  )
}
