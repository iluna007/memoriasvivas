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

export function ControlsPanel({ params, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    motionSpeed,
    proximityThreshold,
    motionAmplitude,
    showBoundingBox,
    showWeb,
    backgroundColor = '#000000',
    spaceRadius = 10,
    ownAxisSpin = 1
  } = params

  const handleChange = (key, value) => {
    onChange({ ...params, [key]: value })
  }

  const safeStyle = {
    top: 'calc(3.5rem + max(0.5rem, env(safe-area-inset-top)))',
    right: 'max(1rem, env(safe-area-inset-right))'
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={safeStyle}
        className="fixed w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg bg-black/90 backdrop-blur-sm border border-white/10 shadow-xl z-[22] text-white/90 hover:bg-white/10 hover:text-white active:bg-white/15 transition-colors touch-manipulation"
        title="Abrir controles"
        aria-label="Abrir controles"
      >
        <IconSliders />
      </button>
    )
  }

  return (
    <aside
      style={safeStyle}
      className="fixed w-72 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl z-[22] p-4 touch-manipulation"
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <h3 className="text-white font-semibold text-sm pr-2">
          Controles de comportamiento
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors touch-manipulation flex-shrink-0"
          title="Cerrar controles"
          aria-label="Cerrar controles"
        >
          <IconChevronRight />
        </button>
      </div>

      <div className="space-y-4">
        {/* Velocidad de movimiento */}
        <div>
          <label className="flex justify-between items-center text-xs text-white/90 mb-1">
            <span>Velocidad</span>
            <span className="text-white/60 tabular-nums">{motionSpeed.toFixed(1)}×</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={motionSpeed}
            onChange={(e) => handleChange('motionSpeed', parseFloat(e.target.value))}
            className="w-full h-3 sm:h-2 rounded-lg appearance-none cursor-pointer bg-white/20 accent-blue-500 touch-manipulation"
          />
        </div>

        {/* Distancia para conectar líneas (proximidad) */}
        <div>
          <label className="flex justify-between items-center text-xs text-white/90 mb-1">
            <span>Distancia conexión (proximidad)</span>
            <span className="text-white/60 tabular-nums">{proximityThreshold.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={proximityThreshold}
            onChange={(e) => handleChange('proximityThreshold', parseFloat(e.target.value))}
            className="w-full h-3 sm:h-2 rounded-lg appearance-none cursor-pointer bg-white/20 accent-blue-500 touch-manipulation"
          />
          <p className="text-[10px] text-white/50 mt-0.5">
            Líneas entre esferas a esta distancia o menor
          </p>
        </div>

        {/* Amplitud del flotado */}
        <div>
          <label className="flex justify-between items-center text-xs text-white/90 mb-1">
            <span>Amplitud del movimiento</span>
            <span className="text-white/60 tabular-nums">{motionAmplitude.toFixed(1)}×</span>
          </label>
          <input
            type="range"
            min="0"
            max="4"
            step="0.1"
            value={motionAmplitude}
            onChange={(e) => handleChange('motionAmplitude', parseFloat(e.target.value))}
            className="w-full h-3 sm:h-2 rounded-lg appearance-none cursor-pointer bg-white/20 accent-blue-500 touch-manipulation"
          />
        </div>

        {/* Radio del espacio */}
        <div>
          <label className="flex justify-between items-center text-xs text-white/90 mb-1">
            <span>Tamaño del espacio</span>
            <span className="text-white/60 tabular-nums">{spaceRadius.toFixed(0)}</span>
          </label>
          <input
            type="range"
            min="4"
            max="30"
            step="1"
            value={spaceRadius}
            onChange={(e) => handleChange('spaceRadius', parseFloat(e.target.value))}
            className="w-full h-3 sm:h-2 rounded-lg appearance-none cursor-pointer bg-white/20 accent-blue-500 touch-manipulation"
          />
          <p className="text-[10px] text-white/50 mt-0.5">
            Radio de distribución de las estrellas
          </p>
        </div>

        {/* Rotación sobre eje propio */}
        <div>
          <label className="flex justify-between items-center text-xs text-white/90 mb-1">
            <span>Rotación eje propio</span>
            <span className="text-white/60 tabular-nums">{ownAxisSpin.toFixed(1)}×</span>
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={ownAxisSpin}
            onChange={(e) => handleChange('ownAxisSpin', parseFloat(e.target.value))}
            className="w-full h-3 sm:h-2 rounded-lg appearance-none cursor-pointer bg-white/20 accent-blue-500 touch-manipulation"
          />
          <p className="text-[10px] text-white/50 mt-0.5">
            Giro de cada estrella sobre su eje (0 = sin giro)
          </p>
        </div>

        {/* Toggle cubo delimitador */}
        <div className="flex items-center justify-between pt-1">
          <label className="text-xs text-white/90">Mostrar cubo delimitador</label>
          <input
            type="checkbox"
            checked={showBoundingBox}
            onChange={(e) => handleChange('showBoundingBox', e.target.checked)}
            className="w-5 h-5 sm:w-4 sm:h-4 rounded border-white/30 bg-white/10 accent-blue-500 cursor-pointer touch-manipulation"
          />
        </div>

        {/* Toggle red de líneas */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-white/90">Mostrar red de líneas</label>
          <input
            type="checkbox"
            checked={showWeb}
            onChange={(e) => handleChange('showWeb', e.target.checked)}
            className="w-5 h-5 sm:w-4 sm:h-4 rounded border-white/30 bg-white/10 accent-blue-500 cursor-pointer touch-manipulation"
          />
        </div>

        {/* Color de fondo */}
        <div>
          <label className="flex justify-between items-center text-xs text-white/90 mb-1">
            <span>Color de fondo</span>
            <span className="text-[10px] font-mono text-white/60">{backgroundColor}</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-10 h-8 rounded-md border border-white/20 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="flex-1 bg-black/60 border border-white/20 text-white text-xs rounded-md px-2 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
