import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import BackgroundColorPicker from './BackgroundColorPicker'

const navStyle = {
  top: 'env(safe-area-inset-top, 0)',
  left: 'env(safe-area-inset-left, 0)',
  right: 'env(safe-area-inset-right, 0)'
}

const linkClass = ({ isActive }) =>
  'min-h-[44px] min-w-[44px] px-3 flex items-center justify-center text-sm font-medium transition-colors rounded-md touch-manipulation ' +
  (isActive
    ? 'text-white bg-white/15'
    : 'text-white/80 hover:text-white hover:bg-white/10')

export function Navbar({ theme, onThemeToggle, bgColor, onBgColorChange }) {
  return (
    <nav
      style={navStyle}
      className="fixed z-20 flex items-center justify-between w-full h-14 bg-transparent backdrop-blur-md border-b border-white/5 px-2 sm:px-4"
    >
      <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto">
        <NavLink to="/" end className={linkClass}>
          Inicio
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
        <NavLink to="/contacto" className={linkClass}>
          Contacto
        </NavLink>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <BackgroundColorPicker currentColor={bgColor} onColorChange={onBgColorChange} />
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
    </nav>
  )
}
