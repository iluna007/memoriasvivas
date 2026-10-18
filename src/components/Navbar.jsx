import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'
import BackgroundColorPicker from './BackgroundColorPicker'
import LanguageToggle from './LanguageToggle'
import { idiomaDeRuta, ruta } from '../i18n/ruta'

const navStyle = {
  top: 'env(safe-area-inset-top, 0)',
  left: 'env(safe-area-inset-left, 0)',
  right: 'env(safe-area-inset-right, 0)'
}

export function Navbar({ theme, onThemeToggle, bgColor, onBgColorChange }) {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const lang = idiomaDeRuta(pathname)
  const isLight = theme === 'light'

  const navClass = isLight
    ? 'bg-white/85 backdrop-blur-md border-b border-black/10 text-zinc-900 shadow-sm shadow-black/5'
    : 'bg-black/30 backdrop-blur-md border-b border-white/10 text-white'

  const linkClass = ({ isActive }) => {
    const base =
      'min-h-[44px] min-w-[44px] px-3 flex items-center justify-center text-sm font-medium transition-colors rounded-md touch-manipulation '
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

  return (
    <nav style={navStyle} className={`fixed z-20 flex h-14 w-full items-center justify-between px-2 sm:px-4 ${navClass}`}>
      <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1">
        <Link
          to={ruta('/', lang)}
          className="mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md touch-manipulation sm:mr-2"
          aria-label={t('nav.inicioAyuda')}
          title={t('nav.inicio')}
        >
          <img
            src="/branding/memorias-vivas-icon-white.png"
            alt="Memorias Vivas"
            className={`h-8 w-8 object-contain ${isLight ? 'brightness-90 invert' : ''}`}
            draggable={false}
          />
        </Link>
        <NavLink to={ruta('/constelaciones', lang)} className={linkClass}>
          {t('nav.constelaciones')}
        </NavLink>
        <NavLink to={ruta('/sobre', lang)} className={linkClass}>
          {t('nav.sobre')}
        </NavLink>
        <NavLink to={ruta('/comunidad', lang)} className={linkClass}>
          {t('nav.comunidad')}
        </NavLink>
        <NavLink to={ruta('/equipo', lang)} className={linkClass}>
          {t('nav.equipo')}
        </NavLink>
        <NavLink to={ruta('/mapa', lang)} className={linkClass}>
          {t('nav.mapa')}
        </NavLink>
        <NavLink to={ruta('/diccionario', lang)} className={linkClass}>
          {t('nav.diccionario')}
        </NavLink>
        <NavLink to={ruta('/documentales', lang)} className={linkClass}>
          {t('nav.documentales')}
        </NavLink>
        <NavLink to={ruta('/activaciones', lang)} className={linkClass}>
          {t('nav.activaciones')}
        </NavLink>
        <NavLink to={ruta('/pedagogias', lang)} className={linkClass}>
          {t('nav.pedagogias')}
        </NavLink>
        <NavLink to={ruta('/actividades', lang)} className={linkClass}>
          {t('nav.actividades')}
        </NavLink>
        <NavLink to={ruta('/contacto', lang)} className={linkClass}>
          {t('nav.contacto')}
        </NavLink>
        <NavLink to={ruta('/archivo', lang)} className={linkClass}>
          {t('nav.archivo')}
        </NavLink>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <BackgroundColorPicker theme={theme} currentColor={bgColor} onColorChange={onBgColorChange} />
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        <LanguageToggle theme={theme} />
      </div>
    </nav>
  )
}
