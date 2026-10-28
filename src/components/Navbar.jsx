import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'
import BackgroundColorPicker from './BackgroundColorPicker'
import LanguageToggle from './LanguageToggle'
import { idiomaDeRuta, ruta } from '../i18n/ruta'

const ENLACES = [
  ['/constelaciones', 'nav.constelaciones'],
  ['/sobre', 'nav.sobre'],
  ['/comunidad', 'nav.comunidad'],
  ['/equipo', 'nav.equipo'],
  ['/mapa', 'nav.mapa'],
  ['/diccionario', 'nav.diccionario'],
  ['/documentales', 'nav.documentales'],
  ['/activaciones', 'nav.activaciones'],
  ['/pedagogias', 'nav.pedagogias'],
  ['/actividades', 'nav.actividades'],
  ['/contacto', 'nav.contacto'],
  ['/archivo', 'nav.archivo'],
]

const navStyle = {
  top: 'env(safe-area-inset-top, 0)',
  left: 'env(safe-area-inset-left, 0)',
  right: 'env(safe-area-inset-right, 0)',
}

const medidaClase =
  'inline-flex min-h-[44px] min-w-[44px] items-center whitespace-nowrap px-3 text-sm font-medium'

export function Navbar({ theme, onThemeToggle, bgColor, onBgColorChange }) {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()
  const lang = idiomaDeRuta(pathname)
  const isLight = theme === 'light'
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const medidaRef = useRef(null)
  const controlesRef = useRef(null)
  const botonRef = useRef(null)
  const [compacto, setCompacto] = useState(false)
  const [abierto, setAbierto] = useState(false)

  const navClass = isLight
    ? 'bg-white/85 backdrop-blur-md border-b border-black/10 text-zinc-900 shadow-sm shadow-black/5'
    : 'bg-black/30 backdrop-blur-md border-b border-white/10 text-white'

  const linkClass = ({ isActive }) => {
    const base =
      'min-h-[44px] min-w-[44px] shrink-0 whitespace-nowrap px-3 flex items-center justify-center text-sm font-medium transition-colors rounded-md touch-manipulation '
    if (isLight) {
      return (
        base +
        (isActive
          ? 'text-zinc-950 bg-black/10'
          : 'text-zinc-800/95 hover:text-zinc-950 hover:bg-black/[0.06]')
      )
    }
    return (
      base +
      (isActive ? 'text-white bg-white/15' : 'text-white/80 hover:text-white hover:bg-white/10')
    )
  }

  const itemMenu = ({ isActive }) => {
    const base =
      'flex min-h-[44px] w-full items-center rounded-md px-3 text-sm font-medium touch-manipulation '
    if (isLight) {
      return base + (isActive ? 'bg-black/10 text-zinc-950' : 'text-zinc-800 hover:bg-black/[0.06]')
    }
    return base + (isActive ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10')
  }

  useLayoutEffect(() => {
    const nav = navRef.current
    const logo = logoRef.current
    const medida = medidaRef.current
    const controles = controlesRef.current
    if (!nav || !logo || !medida || !controles) return undefined

    const medir = () => {
      const estilo = getComputedStyle(nav)
      const pad = parseFloat(estilo.paddingLeft) + parseFloat(estilo.paddingRight)
      const huecos = 16
      const necesario = logo.offsetWidth + medida.offsetWidth + controles.offsetWidth + pad + huecos
      const falta = necesario > nav.clientWidth + 1
      setCompacto((prev) => (prev === falta ? prev : falta))
    }

    medir()
    const observer = new ResizeObserver(medir)
    observer.observe(nav)
    window.addEventListener('resize', medir)
    document.fonts?.ready?.then(medir)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', medir)
    }
  }, [i18n.language, lang])

  useEffect(() => {
    setAbierto(false)
  }, [pathname, compacto])

  useEffect(() => {
    if (!abierto) return undefined
    const cerrar = (event) => {
      if (event.key === 'Escape') {
        setAbierto(false)
        botonRef.current?.focus()
      }
    }
    const fuera = (event) => {
      if (!navRef.current?.contains(event.target)) setAbierto(false)
    }
    window.addEventListener('keydown', cerrar)
    window.addEventListener('pointerdown', fuera)
    return () => {
      window.removeEventListener('keydown', cerrar)
      window.removeEventListener('pointerdown', fuera)
    }
  }, [abierto])

  const botonMenu = isLight
    ? 'text-zinc-800 hover:bg-black/10'
    : 'text-white/90 hover:bg-white/10'

  return (
    <nav
      ref={navRef}
      style={navStyle}
      className={`fixed z-20 flex h-14 w-full items-center gap-1 px-2 sm:px-4 ${navClass}`}
    >
      <Link
        ref={logoRef}
        to={ruta('/', lang)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md touch-manipulation"
        aria-label={t('nav.inicioAyuda')}
        title={t('nav.inicio')}
      >
        <img
          src="/branding/memorias-vivas-icon-white.png"
          alt=""
          className={`h-8 w-8 object-contain ${isLight ? 'brightness-90 invert' : ''}`}
          draggable={false}
        />
      </Link>

      {!compacto && (
        <div className="flex min-w-0 flex-1 items-center">
          {ENLACES.map(([path, clave]) => (
            <NavLink key={path} to={ruta(path, lang)} className={linkClass}>
              {t(clave)}
            </NavLink>
          ))}
        </div>
      )}

      {compacto && (
        <button
          ref={botonRef}
          type="button"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md touch-manipulation ${botonMenu}`}
          aria-expanded={abierto}
          aria-controls="menu-secciones"
          aria-label={abierto ? t('nav.cerrarMenu') : t('nav.abrirMenu')}
          onClick={() => setAbierto((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            {abierto ? (
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      )}

      <div ref={controlesRef} className="ml-auto flex shrink-0 items-center gap-0.5">
        <BackgroundColorPicker theme={theme} currentColor={bgColor} onColorChange={onBgColorChange} />
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        <LanguageToggle theme={theme} />
      </div>

      <div ref={medidaRef} className="pointer-events-none invisible absolute left-0 top-0 flex h-0 w-max gap-0 overflow-hidden" aria-hidden>
        {ENLACES.map(([path, clave]) => (
          <span key={path} className={medidaClase}>
            {t(clave)}
          </span>
        ))}
      </div>

      {compacto && abierto && (
        <div
          id="menu-secciones"
          className={`absolute left-0 right-0 top-full max-h-[min(70dvh,32rem)] overflow-y-auto border-b px-2 py-2 shadow-lg ${navClass}`}
        >
          {ENLACES.map(([path, clave]) => (
            <NavLink key={path} to={ruta(path, lang)} className={itemMenu}>
              {t(clave)}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
