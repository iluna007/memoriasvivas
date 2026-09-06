import { getSphereContent } from '../data/cmsSphereData'
import { getSphereColor } from '../data/spheres'

export function RightPanel({ selectedSphereId, onClose, theme = 'dark' }) {
  const isLight = theme === 'light'
  const content = selectedSphereId != null ? getSphereContent(selectedSphereId) : null
  const color = selectedSphereId != null ? getSphereColor(selectedSphereId) : null
  const title = content?.title ?? ''
  const description = content?.description ?? ''

  const panelShell = isLight
    ? 'fixed right-0 top-14 bottom-0 z-[25] flex w-[380px] max-w-[90vw] flex-col border-l border-black/10 bg-white/95 text-zinc-900 shadow-2xl backdrop-blur-md'
    : 'fixed right-0 top-14 bottom-0 z-[25] flex w-[380px] max-w-[90vw] flex-col border-l border-white/10 bg-black/80 text-white shadow-2xl backdrop-blur-md'

  const closeBtn = isLight
    ? 'absolute left-2 top-2 flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full bg-zinc-200/90 text-xl leading-none text-zinc-800 transition-colors hover:bg-zinc-300 active:bg-zinc-400 touch-manipulation'
    : 'absolute left-2 top-2 flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full bg-white/10 text-xl leading-none text-white transition-colors hover:bg-white/20 active:bg-white/25 touch-manipulation'

  const descCls = isLight
    ? 'select-text text-sm leading-relaxed text-zinc-700'
    : 'select-text text-sm leading-relaxed text-white/80'

  return (
    <aside
      className={panelShell}
      style={{
        borderRightWidth: color ? 4 : 0,
        borderRightStyle: 'solid',
        borderRightColor: color ?? 'transparent',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="relative flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
        <button type="button" onClick={onClose} className={closeBtn} aria-label="Cerrar">
          ×
        </button>
        <h2
          className="mb-4 pl-12 text-xl font-semibold sm:text-2xl"
          style={{ color: color ?? (isLight ? '#18181b' : '#fff') }}
        >
          {title}
        </h2>
        {description && <p className={descCls}>{description}</p>}
      </div>
    </aside>
  )
}
