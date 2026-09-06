import { useEffect, useRef } from 'react'

/**
 * Video a pantalla completa en loop (muted), con capa oscura opcional.
 * Fuerza play() explícito (muted) para evitar autoplay bloqueado al montar.
 */
export function VideoLoopBackground({
  src,
  className = '',
  overlayClassName = 'bg-black/55',
}) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    let cancelled = false
    video.muted = true
    video.defaultMuted = true
    video.setAttribute('muted', '')
    video.playsInline = true
    video.loop = true

    const tryPlay = () => {
      if (cancelled) return
      const p = video.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          /* autoplay bloqueado: reintentar al primer gesto */
        })
      }
    }

    if (video.readyState >= 2) tryPlay()
    else {
      video.addEventListener('loadeddata', tryPlay, { once: true })
      video.addEventListener('canplay', tryPlay, { once: true })
      tryPlay()
    }

    const unlock = () => tryPlay()
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })

    return () => {
      cancelled = true
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      try {
        video.pause()
      } catch {
        /* ignore */
      }
    }
  }, [src])

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      />
      {overlayClassName ? <div className={`absolute inset-0 ${overlayClassName}`} /> : null}
    </div>
  )
}
