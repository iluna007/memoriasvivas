import { useEffect, useState } from 'react'
import { ACTIVIDADES_GALERIA } from '../../data/actividadesGaleria'
import { getContentPageTheme } from '../../utils/pageThemeClasses'

function Lightbox({ item, onClose, theme }) {
  const isLight = theme === 'light'

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Cerrar" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] max-w-5xl">
        <button
          type="button"
          onClick={onClose}
          className={
            'absolute -right-1 -top-1 z-20 flex h-10 w-10 items-center justify-center rounded-full text-xl ' +
            (isLight ? 'bg-white text-zinc-900' : 'bg-white/15 text-white hover:bg-white/25')
          }
          aria-label="Cerrar"
        >
          ×
        </button>
        <img
          src={item.src}
          alt=""
          width={item.width}
          height={item.height}
          className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
        />
      </div>
    </div>
  )
}

export default function ActividadesGaleria({ theme = 'dark' }) {
  const t = getContentPageTheme(theme)
  const [open, setOpen] = useState(null)

  return (
    <>
      <div className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3 xl:columns-4">
        {ACTIVIDADES_GALERIA.map((item) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpen(item)}
            className={`mb-3 block w-full break-inside-avoid overflow-hidden rounded-lg sm:mb-4 ${t.card} focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40`}
          >
            <img
              src={item.src}
              alt=""
              width={item.width}
              height={item.height}
              loading="lazy"
              decoding="async"
              className="h-auto w-full object-cover transition-opacity duration-300 hover:opacity-90"
              style={{ aspectRatio: `${item.width} / ${item.height}` }}
            />
          </button>
        ))}
      </div>

      {open && <Lightbox item={open} onClose={() => setOpen(null)} theme={theme} />}
    </>
  )
}
