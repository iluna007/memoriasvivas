import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import BackgroundColorPicker from './BackgroundColorPicker'

const navStyle = {
  top: 'env(safe-area-inset-top, 0)',
  left: 'env(safe-area-inset-left, 0)',
  right: 'env(safe-area-inset-right, 0)'
}

export function Navbar({ theme, onThemeToggle, bgColor, onBgColorChange }) {
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
          to="/"
          className="mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md touch-manipulation sm:mr-2"
          aria-label="Memorias Vivas — inicio"
        >
          <img
            src="/branding/memorias-vivas-icon-white.png"
            alt="Memorias Vivas"
            className={`h-8 w-8 object-contain ${isLight ? 'brightness-90 invert' : ''}`}
            draggable={false}
          />
        </Link>
        <NavLink to="/" end className={linkClass}>
          Constelaciones
        </NavLink>
        <NavLink to="/sobre" className={linkClass}>
          Sobre
        </NavLink>
        <NavLink to="/comunidad" className={linkClass}>
          Comunidad
        </NavLink>
        <NavLink to="/equipo" className={linkClass}>
          Equipo
        </NavLink>
        <NavLink to="/mapa" className={linkClass}>
          Mapa
        </NavLink>
        <NavLink to="/archivo" className={linkClass}>
          Archivo
        </NavLink>
        <NavLink to="/diccionario" className={linkClass}>
          Diccionario
        </NavLink>
        <NavLink to="/documentales" className={linkClass}>
          Documentales
        </NavLink>
        <NavLink to="/publicaciones" className={linkClass}>
          Publicaciones
        </NavLink>
        <NavLink to="/material-divulgacion" className={linkClass}>
          Material de divulgación
        </NavLink>
        <NavLink to="/actividades" className={linkClass}>
          Actividades
        </NavLink>
        <NavLink to="/contacto" className={linkClass}>
          Contacto
        </NavLink>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <BackgroundColorPicker theme={theme} currentColor={bgColor} onColorChange={onBgColorChange} />
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
    </nav>
  )
}
