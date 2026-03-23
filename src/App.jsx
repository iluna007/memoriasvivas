import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import Inicio from './pages/Inicio'
import Sobre from './pages/Sobre'
import Personas from './pages/Personas'
import Contacto from './pages/Contacto'
import Mapa from './pages/Mapa'

function Layout() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <Navbar />
      {/* Único scroll vertical: el body/root tienen overflow:hidden para Inicio/Canvas */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain">
        <Outlet />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/personas" element={<Personas />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/contacto" element={<Contacto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
