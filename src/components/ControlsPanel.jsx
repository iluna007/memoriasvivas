import { useState } from 'react'

function IconSliders() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function ControlsPanel({ theme = 'dark', params, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const isLight = theme === 'light'
  const {
    motionSpeed,
    proximityThreshold,
    motionAmplitude,
    showBoundingBox,
    showWeb,
    backgroundColor = '#000000',
    spaceRadius = 10,
    ownAxisSpin = 1,
    opacityTwinkle = 1,
    brightnessTwinkle = 1,
    lineTwinkle = 1
  } = params

  const handleChange = (key, value) => {
    onChange({ ...params, [key]: value })
  }

  const safeStyle = {
    top: 'calc(3.5rem + max(0.5rem, env(safe-area-inset-top)))',
    right: 'max(1rem, env(safe-area-inset-right))'
  }

  const floatBtn = isLight
    ? 'fixed z-[22] flex h-12 min-h-[48px] w-12 min-w-[48px] items-center justify-center rounded-lg border border-black/15 bg-white/95 text-zinc-800 shadow-lg shadow-black/10 backdrop-blur-sm transition-colors hover:bg-zinc-100 hover:text-zinc-950 active:bg-zinc-200 touch-manipulation'
    : 'fixed z-[22] flex h-12 min-h-[48px] w-12 min-w-[48px] items-center justify-center rounded-lg border border-white/10 bg-black/90 text-white/90 shadow-xl backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white active:bg-white/15 touch-manipulation'

  const panel = isLight
    ? 'fixed z-[22] max-h-[calc(100vh-2rem)] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-black/15 bg-white/95 p-4 text-zinc-900 shadow-xl shadow-black/10 backdrop-blur-sm touch-manipulation'
    : 'fixed z-[22] max-h-[calc(100vh-2rem)] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-white/10 bg-black/90 p-4 text-white shadow-xl backdrop-blur-sm touch-manipulation'

  const headBorder = isLight ? 'border-b border-black/10' : 'border-b border-white/10'
  const titleCls = isLight ? 'pr-2 text-sm font-semibold text-zinc-900' : 'pr-2 text-sm font-semibold text-white'
  const closeCls = isLight
    ? 'flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded text-zinc-600 transition-colors hover:bg-black/10 hover:text-zinc-950 active:bg-black/[0.12] touch-manipulation'
    : 'flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded text-white/70 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15 touch-manipulation'

  const labelRow = isLight ? 'mb-1 flex items-center justify-between text-xs text-zinc-800' : 'mb-1 flex items-center justify-between text-xs text-white/90'
  const valMuted = isLight ? 'tabular-nums text-zinc-500' : 'tabular-nums text-white/60'
  const hint = isLight ? 'mt-0.5 text-[10px] text-zinc-500' : 'mt-0.5 text-[10px] text-white/50'
  const rangeTrack = isLight
    ? 'h-3 w-full cursor-pointer touch-manipulation appearance-none rounded-lg bg-zinc-200 accent-blue-600 sm:h-2'
    : 'h-3 w-full cursor-pointer touch-manipulation appearance-none rounded-lg bg-white/20 accent-blue-500 sm:h-2'
  const check = isLight
    ? 'h-5 w-5 cursor-pointer touch-manipulation rounded border-zinc-300 bg-white accent-blue-600 sm:h-4 sm:w-4'
    : 'h-5 w-5 cursor-pointer touch-manipulation rounded border-white/30 bg-white/10 accent-blue-500 sm:h-4 sm:w-4'
  const labelPlain = isLight ? 'text-xs text-zinc-800' : 'text-xs text-white/90'
  const monoHex = isLight ? 'font-mono text-[10px] text-zinc-500' : 'font-mono text-[10px] text-white/60'
  const colorInput = isLight ? 'h-8 w-10 cursor-pointer rounded-md border border-zinc-300 bg-transparent' : 'h-8 w-10 cursor-pointer rounded-md border border-white/20 bg-transparent'
  const textInput = isLight
    ? 'flex-1 rounded-md border border-zinc-300 bg-white px-2 py-1.5 font-mono text-xs text-zinc-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400/50'
    : 'flex-1 rounded-md border border-white/20 bg-black/60 px-2 py-1.5 font-mono text-xs text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white/30'

  if (!isOpen) {
    return (
      <button type="button" onClick={() => setIsOpen(true)} style={safeStyle} className={floatBtn} title="Abrir controles" aria-label="Abrir controles">
        <IconSliders />
      </button>
    )
  }

  return (
    <aside style={safeStyle} className={panel}>
      <div className={`mb-3 flex items-center justify-between pb-2 ${headBorder}`}>
        <h3 className={titleCls}>Controles de comportamiento</h3>
        <button type="button" onClick={() => setIsOpen(false)} className={closeCls} title="Cerrar controles" aria-label="Cerrar controles">
          <IconChevronRight />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelRow}>
            <span>Velocidad</span>
            <span className={valMuted}>{motionSpeed.toFixed(1)}×</span>
          </label>
          <input type="range" min="0.1" max="3" step="0.1" value={motionSpeed} onChange={(e) => handleChange('motionSpeed', parseFloat(e.target.value))} className={rangeTrack} />
        </div>

        <div>
          <label className={labelRow}>
            <span>Distancia conexión (proximidad)</span>
            <span className={valMuted}>{proximityThreshold.toFixed(1)}</span>
          </label>
          <input type="range" min="1" max="12" step="0.5" value={proximityThreshold} onChange={(e) => handleChange('proximityThreshold', parseFloat(e.target.value))} className={rangeTrack} />
          <p className={hint}>Líneas entre esferas a esta distancia o menor</p>
        </div>

        <div>
          <label className={labelRow}>
            <span>Amplitud del movimiento</span>
            <span className={valMuted}>{motionAmplitude.toFixed(1)}×</span>
          </label>
          <input type="range" min="0" max="4" step="0.1" value={motionAmplitude} onChange={(e) => handleChange('motionAmplitude', parseFloat(e.target.value))} className={rangeTrack} />
        </div>

        <div>
          <label className={labelRow}>
            <span>Tamaño del espacio</span>
            <span className={valMuted}>{spaceRadius.toFixed(0)}</span>
          </label>
          <input type="range" min="4" max="30" step="1" value={spaceRadius} onChange={(e) => handleChange('spaceRadius', parseFloat(e.target.value))} className={rangeTrack} />
          <p className={hint}>Radio de distribución de las estrellas</p>
        </div>

        <div>
          <label className={labelRow}>
            <span>Rotación eje propio</span>
            <span className={valMuted}>{ownAxisSpin.toFixed(1)}×</span>
          </label>
          <input type="range" min="0" max="2" step="0.1" value={ownAxisSpin} onChange={(e) => handleChange('ownAxisSpin', parseFloat(e.target.value))} className={rangeTrack} />
          <p className={hint}>Giro de cada estrella sobre su eje (0 = sin giro)</p>
        </div>

        <div>
          <label className={labelRow}>
            <span>Oscilación de opacidad (estrellas)</span>
            <span className={valMuted}>{opacityTwinkle.toFixed(2)}</span>
          </label>
          <input type="range" min="0" max="1" step="0.05" value={opacityTwinkle} onChange={(e) => handleChange('opacityTwinkle', parseFloat(e.target.value))} className={rangeTrack} />
          <p className={hint}>0 = sin parpadeo; 1 = máximo contraste de transparencia</p>
        </div>

        <div>
          <label className={labelRow}>
            <span>Oscilación de brillo (estrellas)</span>
            <span className={valMuted}>{brightnessTwinkle.toFixed(2)}</span>
          </label>
          <input type="range" min="0" max="1" step="0.05" value={brightnessTwinkle} onChange={(e) => handleChange('brightnessTwinkle', parseFloat(e.target.value))} className={rangeTrack} />
          <p className={hint}>0 = brillo fijo; 1 = pulso de intensidad del color</p>
        </div>

        <div>
          <label className={labelRow}>
            <span>Pulso de la red (líneas)</span>
            <span className={valMuted}>{lineTwinkle.toFixed(2)}</span>
          </label>
          <input type="range" min="0" max="1" step="0.05" value={lineTwinkle} onChange={(e) => handleChange('lineTwinkle', parseFloat(e.target.value))} className={rangeTrack} />
          <p className={hint}>0 = opacidad fija; 1 = la red respira en opacidad</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className={labelPlain}>Mostrar cubo delimitador</label>
          <input type="checkbox" checked={showBoundingBox} onChange={(e) => handleChange('showBoundingBox', e.target.checked)} className={check} />
        </div>

        <div className="flex items-center justify-between">
          <label className={labelPlain}>Mostrar red de líneas</label>
          <input type="checkbox" checked={showWeb} onChange={(e) => handleChange('showWeb', e.target.checked)} className={check} />
        </div>

        <div>
          <label className={labelRow}>
            <span>Color de fondo</span>
            <span className={monoHex}>{backgroundColor}</span>
          </label>
          <div className="flex items-center gap-2">
            <input type="color" value={backgroundColor} onChange={(e) => handleChange('backgroundColor', e.target.value)} className={colorInput} />
            <input type="text" value={backgroundColor} onChange={(e) => handleChange('backgroundColor', e.target.value)} className={textInput} placeholder="#000000" />
          </div>
        </div>
      </div>
    </aside>
  )
}
