import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { VideoLoopBackground } from './VideoLoopBackground'
import { markIntroSeen } from '../utils/introSession'

const LOOP_BG_SRC = '/intro/introweb-loop.mp4'
const LOGO_SRC = '/branding/memorias-vivas-lockup-white-bold.png'
const LOGO_VIDEO = '/intro/animacion-logo-memorias-vivas.mp4'
/** Segundo en que el trazo ya está completo y el fundido a negro todavía no empieza. */
const LOGO_HOLD = 2.4
/** El lockup ocupa 392×420 dentro del cuadro 1920×1080, un poco por encima del centro. */
const LOGO_ANCHO_CUADRO = 392
const LOGO_ALTO_CUADRO = 1080
const LOGO_CENTRO_Y = 518

/**
 * Home / intro: video en loop a pantalla completa + logo que se dibuja + click para entrar.
 */
export default function IntroSplash({ onDismiss }) {
  const { t } = useTranslation()
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const closingRef = useRef(false)
  const [logoFijo, setLogoFijo] = useState(false)

  const enterSite = useCallback(() => {
    if (closingRef.current || !rootRef.current) return
    closingRef.current = true

    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.out',
      onComplete: () => {
        markIntroSeen()
        document.body.style.overflow = ''
        onDismiss?.()
      },
    })
  }, [onDismiss])

  useEffect(() => {
    if (logoFijo) return undefined
    const video = videoRef.current
    if (!video) return undefined

    let cancelado = false
    video.muted = true
    video.defaultMuted = true
    video.setAttribute('muted', '')
    video.playsInline = true

    const sostener = () => {
      if (video.currentTime < LOGO_HOLD) return
      video.pause()
    }

    const fallar = () => {
      if (!cancelado) setLogoFijo(true)
    }

    const play = () => {
      if (cancelado) return
      const intento = video.play()
      if (intento && typeof intento.catch === 'function') intento.catch(fallar)
    }

    video.addEventListener('timeupdate', sostener)
    video.addEventListener('error', fallar)
    video.addEventListener('ended', fallar)
    if (video.readyState >= 2) play()
    else video.addEventListener('canplay', play, { once: true })

    return () => {
      cancelado = true
      video.removeEventListener('timeupdate', sostener)
      video.removeEventListener('error', fallar)
      video.removeEventListener('ended', fallar)
    }
  }, [logoFijo])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        enterSite()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [enterSite])

  return (
    <div
      ref={rootRef}
      className="intro-splash fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
      role="dialog"
      aria-label={t('intro.dialogo')}
      aria-modal="true"
    >
      {/* Misma estructura que Contacto: wrapper fixed + video absoluto */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <VideoLoopBackground
          src={LOOP_BG_SRC}
          overlayClassName=""
          startAt={4}
        />
      </div>

      <button
        type="button"
        onClick={enterSite}
        className="intro-splash__enter group relative flex flex-col items-center gap-6 px-6 text-center outline-none"
        aria-label={t('intro.entrar')}
      >
        <span className="relative block h-56 w-56 sm:h-72 sm:w-72">
          {logoFijo ? (
            <img
              src={LOGO_SRC}
              alt=""
              className="h-full w-full select-none object-contain drop-shadow-lg"
              draggable={false}
            />
          ) : (
            <video
              ref={videoRef}
              src={LOGO_VIDEO}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none mix-blend-screen"
              style={{
                width: `${(1920 / LOGO_ANCHO_CUADRO) * 100}%`,
                transform: `translate(-50%, -${((LOGO_CENTRO_Y / LOGO_ALTO_CUADRO) * 100).toFixed(2)}%)`,
              }}
            />
          )}
        </span>
        <span className="intro-splash__cta inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/80 backdrop-blur-sm transition-colors group-hover:border-white/40 group-hover:text-white group-focus-visible:text-white">
          {t('intro.click')}
        </span>
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/55">
          {t('intro.prototipo')}
        </span>
      </button>
    </div>
  )
}
