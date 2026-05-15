import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import StarfieldCSS from './components/StarfieldCSS'
import Inicio from './pages/Inicio'
import Sobre from './pages/Sobre'
import Personas from './pages/Personas'
import Contacto from './pages/Contacto'
import Mapa from './pages/Mapa'
import Equipo from './pages/Equipo'
import Archivo from './pages/Archivo'

const THEME_KEY = 'memoriasvivas-theme'
const BG_COLOR_KEY = 'memoriasvivas-bg-color'

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return 'dark'
}

function getInitialBgColor() {
  try {
    const stored = localStorage.getItem(BG_COLOR_KEY)
    if (stored && stored.startsWith('#')) return stored
  } catch {}
  return null
}

function Layout({ theme, onThemeToggle, bgColor, onBgColorChange }) {
  const isLight = theme === 'light'
  const bg = bgColor || (isLight ? '#f5f5f5' : '#05080f')
  const textClass = isLight ? 'text-black' : 'text-white'

  return (
    <div className={`flex flex-col h-full min-h-0 ${textClass}`} style={{ background: bg }}>
      <StarfieldCSS />
      <Navbar
        theme={theme}
        onThemeToggle={onThemeToggle}
        bgColor={bgColor}
        onBgColorChange={onBgColorChange}
      />
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-y-contain">
        <Outlet context={{ theme, bgColor }} />
        <Footer theme={theme} />
      </div>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [bgColor, setBgColor] = useState(getInitialBgColor)

  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme) } catch {}
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    try {
      if (bgColor) localStorage.setItem(BG_COLOR_KEY, bgColor)
      else localStorage.removeItem(BG_COLOR_KEY)
    } catch {}
  }, [bgColor])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
    setBgColor(null)
  }, [])

  const changeBgColor = useCallback((hex) => {
    setBgColor(hex)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              theme={theme}
              onThemeToggle={toggleTheme}
              bgColor={bgColor}
              onBgColorChange={changeBgColor}
            />
          }
        >
          <Route path="/" element={<Inicio />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/comunidad" element={<Personas />} />
          <Route path="/equipo" element={<Equipo />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/archivo" element={<Archivo />} />
          <Route path="/contacto" element={<Contacto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
