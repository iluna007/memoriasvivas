import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { getContentPageTheme } from '../../utils/pageThemeClasses'

export default function PublicacionModal({ item, theme = 'dark', reducedMotion, onClose }) {
  const t = getContentPageTheme(theme)
  const isLight = theme === 'light'
  const rootRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const panel = panelRef.current
    if (!reducedMotion && panel) {
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' },
      )
    }

    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, reducedMotion])

  if (!item) return null

  return (
    <div
      ref={rootRef}
      className={`pub-modal ${isLight ? 'is-light' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pub-modal-title"
    >
      <button type="button" className="pub-modal__backdrop" aria-label="Cerrar" onClick={onClose} />
      <div ref={panelRef} className={`pub-modal__panel rounded-xl ${t.card}`}>
        <p className={`mb-2 text-[11px] uppercase tracking-[0.18em] ${t.muted}`}>
          {[item.fuente, item.anio, item.idioma].filter(Boolean).join(' · ')}
        </p>
        <h2 id="pub-modal-title" className={`text-xl font-semibold leading-snug ${t.cardTitle}`}>
          {item.titulo}
        </h2>
        {item.tituloAlt ? <p className={`mt-1 text-sm italic ${t.cardSub}`}>{item.tituloAlt}</p> : null}
        {item.autores?.length ? (
          <p className={`mt-3 text-sm ${t.cardBio}`}>{item.autores.join(', ')}</p>
        ) : null}
        {item.detalle ? <p className={`mt-2 text-sm ${t.muted}`}>{item.detalle}</p> : null}
        {item.resumen ? <p className={`mt-4 text-sm leading-relaxed ${t.body}`}>{item.resumen}</p> : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex rounded-md px-3 py-2 text-sm ${t.btnOutline}`}
            >
              {item.enlaceTipo === 'doi' || item.doi ? 'Ver DOI' : 'Abrir enlace'}
            </a>
          ) : null}
          {item.archivoLocal ? (
            <a
              href={item.archivoLocal}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex rounded-md px-3 py-2 text-sm ${t.btnPrimary}`}
            >
              Abrir PDF
            </a>
          ) : null}
          <button type="button" className={`inline-flex rounded-md px-3 py-2 text-sm ${t.btnOutline}`} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
