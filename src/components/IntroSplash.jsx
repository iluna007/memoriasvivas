import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { VideoLoopBackground } from './VideoLoopBackground'
import { markIntroSeen, prefersReducedMotion } from '../utils/introSession'

const LOOP_BG_SRC = '/intro/introweb-loop.mp4'
const LOGO_SRC = '/branding/memorias-vivas-lockup-white-bold.png'

/**
 * Home / intro: video en loop a pantalla completa + logo + click para entrar.
 * Sin fase previa de animación (así el loop se monta igual que en Contacto).
 */
export default function IntroSplash({ onDismiss }) {
  const rootRef = useRef(null)
  const logoWrapRef = useRef(null)
  const closingRef = useRef(false)
  const reducedMotion = prefersReducedMotion()

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
    const el = logoWrapRef.current
    if (!el) return
    if (reducedMotion) {
      gsap.set(el, { opacity: 1, scale: 1 })
      return
    }
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
    )
  }, [reducedMotion])

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
      className="intro-splash fixed inset-0 z-[100] flex items-center justify-center bg-black"
      role="dialog"
      aria-label="Introducción Memorias Vivas"
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
        className="intro-splash__enter group relative z-10 flex flex-col items-center gap-6 px-6 text-center outline-none"
        aria-label="Entrar al sitio Memorias Vivas"
      >
        <span ref={logoWrapRef} className="block w-56 opacity-0 sm:w-72">
          <img
            src={LOGO_SRC}
            alt="Memorias Vivas"
            className="w-full select-none drop-shadow-lg"
            draggable={false}
          />
        </span>
        <span className="intro-splash__cta inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/80 backdrop-blur-sm transition-colors group-hover:border-white/40 group-hover:text-white group-focus-visible:text-white">
          Click para entrar
        </span>
      </button>
    </div>
  )
}
