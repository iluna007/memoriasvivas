import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

/** v2: evita que sesión marcada por la intro anterior se salte el flujo nuevo */
const INTRO_KEY = 'memoriasvivas-intro-v2'
const VIDEO_SRC = '/intro/animacion-logo-memorias-vivas.mp4'
const LOGO_SRC = '/branding/memorias-vivas-lockup-white-bold.png'
const VIDEO_SAFETY_MS = 10000

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* private mode */
  }
}

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/**
 * Puerta de entrada a pantalla completa (una vez por sesión de pestaña).
 * Fase 1 "playing": se reproduce el video del logo.
 * Fase 2 "holding": el video termina (o se salta) y queda el logo fijo con
 * un llamado a la acción — el sitio solo se revela con un clic/Enter explícito.
 */
export default function IntroSplash() {
  const navigate = useNavigate()

  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return false
    return !hasSeenIntro()
  })
  const [stage, setStage] = useState(() => (prefersReducedMotion() ? 'holding' : 'playing'))
  const [playBlocked, setPlayBlocked] = useState(false)

  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const logoWrapRef = useRef(null)
  const closingRef = useRef(false)
  const videoSafetyTimerRef = useRef(null)
  const reducedMotionRef = useRef(false)
  const holdingReachedRef = useRef(false)

  const goToHolding = useCallback(() => {
    if (holdingReachedRef.current) return
    holdingReachedRef.current = true

    if (videoSafetyTimerRef.current) {
      clearTimeout(videoSafetyTimerRef.current)
      videoSafetyTimerRef.current = null
    }
    const video = videoRef.current
    if (video) {
      try { video.pause() } catch { /* ignore */ }
    }
    setStage('holding')
  }, [])

  const enterSite = useCallback(() => {
    if (closingRef.current || !rootRef.current) return
    closingRef.current = true

    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        markIntroSeen()
        document.body.style.overflow = ''
        setActive(false)
        navigate('/')
      },
    })
  }, [navigate])

  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion()
  }, [])

  // Forzar muted + play() (React a veces no aplica muted a tiempo para autoplay).
  useEffect(() => {
    if (!active || stage !== 'playing') return undefined

    const video = videoRef.current
    if (!video) return undefined

    let cancelled = false
    video.muted = true
    video.defaultMuted = true
    video.setAttribute('muted', '')
    video.playsInline = true

    const tryPlay = () => {
      if (cancelled) return
      const playPromise = video.play()
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            if (!cancelled) setPlayBlocked(false)
          })
          .catch(() => {
            if (!cancelled) setPlayBlocked(true)
          })
      }
    }

    // Esperar a que haya datos suficientes, o intentar de inmediato.
    if (video.readyState >= 2) tryPlay()
    else {
      video.addEventListener('loadeddata', tryPlay, { once: true })
      video.addEventListener('canplay', tryPlay, { once: true })
      // Intento temprano por si el evento ya pasó.
      tryPlay()
    }

    return () => {
      cancelled = true
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
    }
  }, [active, stage])

  // Timeout de seguridad solo en fase playing.
  useEffect(() => {
    if (!active || stage !== 'playing') return undefined
    videoSafetyTimerRef.current = window.setTimeout(goToHolding, VIDEO_SAFETY_MS)
    return () => {
      if (videoSafetyTimerRef.current) {
        clearTimeout(videoSafetyTimerRef.current)
        videoSafetyTimerRef.current = null
      }
    }
  }, [active, stage, goToHolding])

  // Fade-in del logo estático al entrar en la fase "holding".
  useEffect(() => {
    if (!active || stage !== 'holding') return
    const el = logoWrapRef.current
    if (!el) return
    if (reducedMotionRef.current) {
      gsap.set(el, { opacity: 1, scale: 1 })
      return
    }
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
    )
  }, [active, stage])

  // Bloquear scroll de fondo mientras la intro está activa.
  useEffect(() => {
    if (!active) return undefined
    document.body.style.overflow = 'hidden'

    const onKey = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        if (stage === 'playing') {
          if (playBlocked && videoRef.current) {
            videoRef.current.play().then(() => setPlayBlocked(false)).catch(() => goToHolding())
          } else {
            goToHolding()
          }
        } else {
          enterSite()
        }
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, stage, goToHolding, enterSite, playBlocked])

  if (!active) return null

  return (
    <div
      ref={rootRef}
      className="intro-splash fixed inset-0 z-[100] flex items-center justify-center bg-black"
      role="dialog"
      aria-label="Introducción Memorias Vivas"
      aria-modal="true"
    >
      {stage === 'playing' && (
        <>
          {/* Poster detrás por si el primer frame es negro o el autoplay tarda */}
          <img
            src={LOGO_SRC}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[min(56vw,420px)] -translate-x-1/2 -translate-y-1/2 opacity-40"
            draggable={false}
          />
          <video
            ref={videoRef}
            className="absolute inset-0 z-[1] h-full w-full object-contain"
            src={VIDEO_SRC}
            poster={LOGO_SRC}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={goToHolding}
            onError={() => {
              // Solo saltar si el recurso no carga; no por rechazo de autoplay.
              goToHolding()
            }}
          />
          {playBlocked ? (
            <button
              type="button"
              onClick={() => {
                const video = videoRef.current
                if (!video) {
                  goToHolding()
                  return
                }
                video.muted = true
                video.play().then(() => setPlayBlocked(false)).catch(() => goToHolding())
              }}
              className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 rounded-md border border-white/25 bg-black/50 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm hover:text-white"
            >
              Reproducir intro
            </button>
          ) : null}
          <button
            type="button"
            onClick={goToHolding}
            className="absolute bottom-6 right-6 z-10 rounded-md px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/45 transition-opacity hover:text-white/90"
          >
            Saltar
          </button>
        </>
      )}

      {stage === 'holding' && (
        <button
          type="button"
          onClick={enterSite}
          className="intro-splash__enter group flex flex-col items-center gap-6 px-6 text-center outline-none"
          aria-label="Entrar al sitio Memorias Vivas"
        >
          <span ref={logoWrapRef} className="block w-56 opacity-0 sm:w-64">
            <img src={LOGO_SRC} alt="Memorias Vivas" className="w-full select-none" draggable={false} />
          </span>
          <span className="intro-splash__cta motion-safe:animate-pulse inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/60 transition-colors group-hover:text-white group-focus-visible:text-white">
            Click para entrar
          </span>
        </button>
      )}
    </div>
  )
}
