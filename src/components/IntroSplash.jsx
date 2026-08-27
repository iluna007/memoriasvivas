import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const INTRO_KEY = 'memoriasvivas-intro-seen'
const VIDEO_SRC = '/intro/animacion-logo-memorias-vivas.mp4'
const SAFETY_MS = 8000

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
 * Intro a pantalla completa (una vez por sesión de pestaña).
 * Se monta encima de toda la app; al terminar/saltar se desmonta.
 */
export default function IntroSplash() {
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return false
    if (hasSeenIntro()) return false
    if (prefersReducedMotion()) {
      markIntroSeen()
      return false
    }
    return true
  })

  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const closingRef = useRef(false)
  const safetyTimerRef = useRef(null)

  const dismiss = useCallback(() => {
    if (closingRef.current || !rootRef.current) return
    closingRef.current = true

    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = null
    }

    const video = videoRef.current
    if (video) {
      try { video.pause() } catch { /* ignore */ }
    }

    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        markIntroSeen()
        document.body.style.overflow = ''
        setActive(false)
      },
    })
  }, [])

  useEffect(() => {
    if (!active) return undefined

    document.body.style.overflow = 'hidden'

    const onKey = () => dismiss()
    const onPointer = (event) => {
      if (event.target.closest('[data-intro-skip]')) return
      dismiss()
    }

    window.addEventListener('keydown', onKey)
    const root = rootRef.current
    root?.addEventListener('pointerdown', onPointer)

    safetyTimerRef.current = window.setTimeout(dismiss, SAFETY_MS)

    return () => {
      window.removeEventListener('keydown', onKey)
      root?.removeEventListener('pointerdown', onPointer)
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current)
        safetyTimerRef.current = null
      }
      document.body.style.overflow = ''
    }
  }, [active, dismiss])

  if (!active) return null

  return (
    <div
      ref={rootRef}
      className="intro-splash fixed inset-0 z-[100] flex items-center justify-center bg-black"
      role="dialog"
      aria-label="Introducción Memorias Vivas"
      aria-modal="true"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain"
        src={VIDEO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={dismiss}
        onError={dismiss}
      />

      <button
        type="button"
        data-intro-skip
        onClick={(event) => {
          event.stopPropagation()
          dismiss()
        }}
        className="absolute bottom-6 right-6 z-10 rounded-md px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/45 transition-opacity hover:text-white/90"
      >
        Saltar
      </button>
    </div>
  )
}
