import { useRef } from 'react'

export default function BackgroundColorPicker({ theme = 'dark', currentColor, onColorChange }) {
  const inputRef = useRef(null)
  const displayHex = currentColor || '#000000'
  const isLight = theme === 'light'

  const btnMain = isLight
    ? 'flex h-9 w-9 items-center justify-center rounded-full text-lg text-zinc-700 transition-colors hover:bg-black/10 hover:text-zinc-950'
    : 'flex h-9 w-9 items-center justify-center rounded-full text-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white'

  const btnReset = isLight
    ? 'flex h-6 w-6 items-center justify-center rounded-full text-xs text-zinc-500 transition-colors hover:bg-black/10 hover:text-zinc-900'
    : 'flex h-6 w-6 items-center justify-center rounded-full text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white'

  return (
    <div className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="color"
        className="sr-only"
        value={displayHex}
        onChange={(e) => onColorChange(e.target.value)}
        aria-hidden="true"
        tabIndex={-1}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={btnMain}
        aria-label="Color de fondo"
        title="Color de fondo"
      >
        <span aria-hidden>☼</span>
      </button>
      {currentColor && (
        <button type="button" onClick={() => onColorChange(null)} className={btnReset} aria-label="Restablecer fondo" title="Restablecer">
          ×
        </button>
      )}
    </div>
  )
}
