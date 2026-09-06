import { useEffect, useRef } from 'react'

/**
 * Video a pantalla completa en loop (muted), con capa oscura opcional.
 * Fuerza play() explícito (muted) para evitar autoplay bloqueado al montar.
 * @param {{ src: string, className?: string, overlayClassName?: string, startAt?: number }} props
 */
export function VideoLoopBackground({
  src,
  className = '',
  overlayClassName = 'bg-black/55',
  startAt = 0,
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
    // Si arranca a mitad, manejamos el reinicio a mano para no volver al segundo 0.
    video.loop = startAt <= 0

    const seekStart = () => {
      if (cancelled || !(startAt > 0)) return
      try {
        if (Math.abs(video.currentTime - startAt) > 0.05) {
          video.currentTime = startAt
        }
      } catch {
        /* ignore */
      }
    }

    const tryPlay = () => {
      if (cancelled) return
      seekStart()
      const p = video.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          /* autoplay bloqueado: reintentar al primer gesto */
        })
      }
    }

    const onLoadedMeta = () => {
      seekStart()
      tryPlay()
    }

    const onEnded = () => {
      if (cancelled || !(startAt > 0)) return
      seekStart()
      tryPlay()
    }

    // Por si el navegador reinicia el loop nativo cerca de 0.
    const onTimeUpdate = () => {
      if (cancelled || !(startAt > 0)) return
      if (video.currentTime > 0 && video.currentTime < startAt && video.currentTime < 0.2) {
        seekStart()
      }
    }

    video.addEventListener('loadedmetadata', onLoadedMeta)
    video.addEventListener('ended', onEnded)
    video.addEventListener('timeupdate', onTimeUpdate)

    if (video.readyState >= 1) onLoadedMeta()
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
      video.removeEventListener('loadedmetadata', onLoadedMeta)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('timeupdate', onTimeUpdate)
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
  }, [src, startAt])

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
        loop={startAt <= 0}
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      />
      {overlayClassName ? <div className={`absolute inset-0 ${overlayClassName}`} /> : null}
    </div>
  )
}
