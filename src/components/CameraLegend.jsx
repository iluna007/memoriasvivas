import { useState } from 'react'

export default function CameraLegend({ theme = 'dark' }) {
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60">
            <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 3V1M8 15v-2M3 8H1M15 8h-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <span>
            <kbd className={kbd}>Clic izq</kbd> + arrastrar → rotar
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60">
            <rect x="5" y="2" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.2" />
            <line x1="8" y1="4" x2="8" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M5 14l-2 2M11 14l2 2" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
          <span>
            <kbd className={kbd}>Scroll</kbd> → zoom in / out
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60">
            <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M4 8L6 6M4 8L6 10M12 8L10 6M12 8L10 10M8 4L6 6M8 4L10 6M8 12L6 10M8 12L10 10" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
          </svg>
          <span>
            <kbd className={kbd}>Clic der</kbd> + arrastrar → desplazar
          </span>
        </div>
      </div>
      <button type="button" onClick={() => setDismissed(true)} className={closeBtn} aria-label="Cerrar leyenda" title="Cerrar">
        ×
      </button>
    </div>
  )
}
