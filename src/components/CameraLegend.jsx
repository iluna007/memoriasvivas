import { useState } from 'react'

export default function CameraLegend() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed bottom-4 right-4 z-[21] flex items-end gap-3 pointer-events-auto select-none">
      <div className="rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 px-3 py-2.5 text-[11px] text-white/60 leading-relaxed shadow-lg space-y-1.5">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60">
            <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 3V1M8 15v-2M3 8H1M15 8h-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <span>
            <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px] font-mono text-white/70">Clic izq</kbd> + arrastrar → rotar
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60">
            <rect x="5" y="2" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.2" />
            <line x1="8" y1="4" x2="8" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M5 14l-2 2M11 14l2 2" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
          <span>
            <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px] font-mono text-white/70">Scroll</kbd> → zoom in / out
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60">
            <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M4 8L6 6M4 8L6 10M12 8L10 6M12 8L10 10M8 4L6 6M8 4L10 6M8 12L6 10M8 12L10 10" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
          </svg>
          <span>
            <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px] font-mono text-white/70">Clic der</kbd> + arrastrar → desplazar
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="mb-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/50 hover:bg-white/20 hover:text-white/80 transition-colors"
        aria-label="Cerrar leyenda"
        title="Cerrar"
      >
        ×
      </button>
    </div>
  )
}
