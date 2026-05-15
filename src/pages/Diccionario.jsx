import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getContentPageTheme } from '../utils/pageThemeClasses'
import { ConceptDictionaryView } from '../components/ConceptDictionaryView.jsx'

const ZOOM_STORAGE = 'memoriasvivas-diccionario-zoom'
const ZOOM_MIN = 50
const ZOOM_MAX = 250
const ZOOM_DEFAULT = 50
const ZOOM_STEP = 5

export default function Diccionario() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const t = getContentPageTheme(theme)
  const [zoomPercent, setZoomPercent] = useState(() => {
    try {
      const raw = localStorage.getItem(ZOOM_STORAGE)
      if (raw != null) {
        const n = parseInt(raw, 10)
        if (!Number.isNaN(n) && n >= ZOOM_MIN && n <= ZOOM_MAX) return n
      }
    } catch {
      /* private mode */
    }
    return ZOOM_DEFAULT
  })

  useEffect(() => {
    try {
      localStorage.setItem(ZOOM_STORAGE, String(zoomPercent))
    } catch {
      /* ignore */
    }
  }, [zoomPercent])

  const zoom = zoomPercent / 100
  const panelFrame =
    theme === 'light'
      ? 'border border-zinc-200 bg-white/80 text-zinc-900'
      : 'border border-white/10 bg-white/[0.04] text-white/90'

  return (
    <main className="min-h-full w-full pt-16">
      <div className="w-full max-w-none px-2 pb-6 pt-2 sm:px-4 lg:px-6">
        <div className={`mb-4 rounded-xl px-3 py-3 sm:px-4 ${panelFrame}`}>
          <label
            htmlFor="diccionario-tamano-texto"
            className={`mb-2 block text-sm font-medium ${theme === 'light' ? 'text-zinc-800' : 'text-white/90'}`}
          >
            Tamaño del texto en esta página
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`w-11 shrink-0 text-center text-xs tabular-nums ${t.muted}`}>{ZOOM_MIN}%</span>
            <input
              id="diccionario-tamano-texto"
              type="range"
              min={ZOOM_MIN}
              max={ZOOM_MAX}
              step={ZOOM_STEP}
              value={zoomPercent}
              onChange={(e) => setZoomPercent(Number(e.target.value))}
              aria-valuemin={ZOOM_MIN}
              aria-valuemax={ZOOM_MAX}
              aria-valuenow={zoomPercent}
              aria-label="Porcentaje de tamaño del texto del diccionario"
              className={`h-2 min-w-[min(100%,14rem)] flex-1 cursor-pointer touch-manipulation ${
                theme === 'light' ? 'accent-zinc-800' : 'accent-white'
              }`}
            />
            <span className={`w-11 shrink-0 text-center text-xs tabular-nums ${t.muted}`}>{ZOOM_MAX}%</span>
            <output
              htmlFor="diccionario-tamano-texto"
              className={`min-w-[3rem] shrink-0 text-center text-sm font-semibold tabular-nums ${t.cardTitle}`}
              aria-live="polite"
            >
              {zoomPercent}%
            </output>
          </div>
          <p className={`mt-2 text-[11px] leading-snug ${t.muted}`}>
            Ajuste local a esta página. En el navegador también puede usar Ctrl+ + / Ctrl+ − (⌘ en Mac).
          </p>
        </div>

        <div className="origin-top" style={{ zoom }}>
          <h1 className={`mb-2 text-2xl font-bold sm:text-3xl ${t.cardTitle}`}>Diccionario de conceptos</h1>
          <p className={`mb-4 max-w-2xl text-sm leading-relaxed ${t.lead}`}>
            Términos y definiciones breves utilizados en el proyecto Memorias Vivas. Este índice se encuentra en proceso
            de construcción y puede incorporar nuevos conceptos con el tiempo.
          </p>
          <ConceptDictionaryView />
        </div>
      </div>
    </main>
  )
}
