import { useRef } from 'react'

export default function BackgroundColorPicker({ currentColor, onColorChange }) {
  const inputRef = useRef(null)
  const displayHex = currentColor || '#000000'

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
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Color de fondo"
        title="Color de fondo"
      >
        <span aria-hidden>☼</span>
      </button>
      {currentColor && (
        <button
          type="button"
          onClick={() => onColorChange(null)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Restablecer fondo"
          title="Restablecer"
        >
          ×
        </button>
      )}
    </div>
  )
}
