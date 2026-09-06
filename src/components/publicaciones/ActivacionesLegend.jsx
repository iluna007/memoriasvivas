import { useState } from 'react'

/** Indicaciones de navegación del muro de Activaciones (mismo patrón que CameraLegend). */
export default function ActivacionesLegend({ theme = 'dark' }) {
  const [dismissed, setDismissed] = useState(false)
  const isLight = theme === 'light'

  if (dismissed) return null

  const box = isLight
    ? 'space-y-1.5 rounded-lg border border-black/10 bg-white/90 px-3 py-2.5 text-[11px] leading-relaxed text-zinc-700 shadow-lg backdrop-blur-sm'
    : 'space-y-1.5 rounded-lg border border-white/10 bg-black/70 px-3 py-2.5 text-[11px] leading-relaxed text-white/60 shadow-lg backdrop-blur-sm'

  const kbd = isLight
    ? 'rounded bg-black/10 px-1 py-0.5 font-mono text-[10px] text-zinc-700'
    : 'rounded bg-white/10 px-1 py-0.5 font-mono text-[10px] text-white/70'

  const closeBtn = isLight
    ? 'mb-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px] text-zinc-500 transition-colors hover:bg-black/15 hover:text-zinc-800'
    : 'mb-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/50 transition-colors hover:bg-white/20 hover:text-white/80'

  return (
    <div className="pointer-events-auto fixed bottom-4 right-4 z-[21] flex select-none items-end gap-3">
      <div className={box}>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60" aria-hidden>
            <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path
              d="M3 8l2-2M3 8l2 2M13 8l-2-2M13 8l-2 2M8 3l-2 2M8 3l2 2M8 13l-2-2M8 13l2-2"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
          </svg>
          <span>
            <kbd className={kbd}>Arrastrar</kbd> o <kbd className={kbd}>Scroll</kbd> → explorar
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60" aria-hidden>
            <rect x="3" y="2" width="7" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6 13h5a1 1 0 001-1V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span>
            <kbd className={kbd}>Clic</kbd> → abrir documento
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60" aria-hidden>
            <rect x="5" y="2" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="11" r="0.8" fill="currentColor" />
          </svg>
          <span>
            <kbd className={kbd}>Tocar</kbd> + deslizar en móvil
          </span>
        </div>
      </div>
      <button type="button" onClick={() => setDismissed(true)} className={closeBtn} aria-label="Cerrar leyenda" title="Cerrar">
        ×
      </button>
    </div>
  )
}
