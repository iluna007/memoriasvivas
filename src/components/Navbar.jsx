import { NavLink } from 'react-router-dom'

const navStyle = {
  top: 'env(safe-area-inset-top, 0)',
  left: 'env(safe-area-inset-left, 0)',
  right: 'env(safe-area-inset-right, 0)'
}

const linkClass = ({ isActive }) =>
  'min-h-[44px] min-w-[44px] px-4 flex items-center justify-center text-sm font-medium transition-colors rounded-md touch-manipulation ' +
  (isActive
    ? 'text-white bg-white/15'
    : 'text-white/80 hover:text-white hover:bg-white/10')

export function Navbar() {
  return (
    <nav
      style={navStyle}
      className="fixed z-20 flex items-center justify-center gap-1 sm:gap-2 w-full h-14 bg-transparent backdrop-blur-md border-b border-white/5 px-2 sm:px-4"
    >
      <NavLink to="/" end className={linkClass}>
        Inicio
      </NavLink>
      <NavLink to="/sobre" className={linkClass}>
        Sobre Memorias Vivas
      </NavLink>
      <NavLink to="/contacto" className={linkClass}>
        Contacto
      </NavLink>
    </nav>
  )
}
