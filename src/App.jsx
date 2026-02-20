import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import Inicio from './pages/Inicio'
import Sobre from './pages/Sobre'
import Contacto from './pages/Contacto'

function Layout() {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <div className="flex-1 min-h-0">
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
          <Route path="/contacto" element={<Contacto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
