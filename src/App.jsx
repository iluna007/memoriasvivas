import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import { idiomaDeRuta } from './i18n/ruta'
import i18n from './i18n'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import StarfieldCSS from './components/StarfieldCSS'
import Intro from './pages/Intro'
import Inicio from './pages/Inicio'
import Sobre from './pages/Sobre'
import Personas from './pages/Personas'
import Contacto from './pages/Contacto'
import Mapa from './pages/Mapa'
import Equipo from './pages/Equipo'
import Archivo from './pages/Archivo'
import Diccionario from './pages/Diccionario'
import Documentales from './pages/Documentales'
import Publicaciones from './pages/Publicaciones'
import MaterialDivulgacion from './pages/MaterialDivulgacion'
import Actividades from './pages/Actividades'

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

function asegurarEnlace(hreflang) {
  let link = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = hreflang
    document.head.appendChild(link)
  }
  return link
}

function IdiomaDocumento() {
  const { pathname } = useLocation()
  const lang = idiomaDeRuta(pathname)

  useEffect(() => {
    let activo = true
    document.documentElement.lang = lang
    i18n.changeLanguage(lang).then(() => {
      if (!activo) return
      document.title = i18n.t('meta.titulo')
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', i18n.t('meta.descripcion'))
      const sin = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
      const origen = window.location.origin
      const esUrl = origen + (sin === '/' ? '/' : sin)
      const enUrl = origen + (sin === '/' ? '/en' : `/en${sin}`)
      asegurarEnlace('es').href = esUrl
      asegurarEnlace('en').href = enUrl
      asegurarEnlace('x-default').href = esUrl
    })
    return () => {
      activo = false
    }
  }, [lang, pathname])

  return null
}

function paginas(prefijo) {
  const p = (path) => (prefijo ? `${prefijo}/${path}` : `/${path}`)
  return [
    <Route key={p('constelaciones')} path={p('constelaciones')} element={<Inicio />} />,
    <Route key={p('sobre')} path={p('sobre')} element={<Sobre />} />,
    <Route key={p('comunidad')} path={p('comunidad')} element={<Personas />} />,
    <Route key={p('equipo')} path={p('equipo')} element={<Equipo />} />,
    <Route key={p('mapa')} path={p('mapa')} element={<Mapa />} />,
    <Route key={p('archivo')} path={p('archivo')} element={<Archivo />} />,
    <Route key={p('diccionario')} path={p('diccionario')} element={<Diccionario />} />,
    <Route key={p('documentales')} path={p('documentales')} element={<Documentales />} />,
    <Route key={p('activaciones')} path={p('activaciones')} element={<Publicaciones />} />,
    <Route key={p('publicaciones')} path={p('publicaciones')} element={<Navigate to={p('activaciones')} replace />} />,
    <Route key={p('pedagogias')} path={p('pedagogias')} element={<MaterialDivulgacion />} />,
    <Route key={p('material-divulgacion')} path={p('material-divulgacion')} element={<Navigate to={p('pedagogias')} replace />} />,
    <Route key={p('actividades')} path={p('actividades')} element={<Actividades />} />,
    <Route key={p('contacto')} path={p('contacto')} element={<Contacto />} />,
  ]
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
      <div id="scroll-root" className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-y-contain">
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
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {}
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
      <IdiomaDocumento />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/en" element={<Intro />} />
        <Route path="/intro" element={<Navigate to="/" replace />} />
        <Route path="/en/intro" element={<Navigate to="/en" replace />} />

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
          {paginas('')}
          {paginas('/en')}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
