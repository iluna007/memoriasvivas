import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getScroller } from '../../utils/gsapSetup'

function medir() {
  const scroller = getScroller()
  const linea = document.getElementById('linea-tiempo')
  if (!scroller || !linea) return null
  const caja = scroller.getBoundingClientRect()
  const base = linea.getBoundingClientRect().top
  const altura = linea.offsetHeight || 1
  const nodos = [...linea.querySelectorAll('[data-nodo]:not([hidden])')].map((el) => {
    const top = el.getBoundingClientRect().top - base
    return {
      id: el.id.replace(/^actividad-/, ''),
      titulo: el.querySelector('h3')?.textContent?.trim() || 'Actividad',
      lado: el.dataset.lado === 'der' ? 'der' : 'izq',
      pct: Math.min(98, Math.max(2, (top / altura) * 100)),
    }
  })
  const anios = [...linea.querySelectorAll('section:not([hidden]) [data-anio]')].map((el) => {
    const top = el.getBoundingClientRect().top - base
    return {
      id: el.id,
      texto: el.textContent?.trim() || '',
      pct: Math.min(96, Math.max(0, (top / altura) * 100)),
    }
  })
  const ini = ((caja.top - base) / altura) * 100
  const fin = ((caja.bottom - base) / altura) * 100
  const top = Math.min(96, Math.max(0, ini))
  const bottom = Math.min(100, Math.max(top + 4, fin))
  const centro = (caja.top + caja.bottom) / 2
  let activo = null
  let mejor = Infinity
  linea.querySelectorAll('[data-nodo]:not([hidden])').forEach((el) => {
    const r = el.getBoundingClientRect()
    const dist = Math.abs((r.top + r.bottom) / 2 - centro)
    if (dist < mejor) {
      mejor = dist
      activo = el.id.replace(/^actividad-/, '')
    }
  })
  return { nodos, anios, ventana: { top, height: bottom - top }, activo }
}

export default function MapaSintesis({ filtrosKey, isLight }) {
  const { t: tr } = useTranslation()
  const [estado, setEstado] = useState(null)

  useEffect(() => {
    const scroller = getScroller()
    const linea = document.getElementById('linea-tiempo')
    if (!scroller || !linea) return undefined
    let frame = 0
    const actualizar = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setEstado(medir()))
    }
    actualizar()
    scroller.addEventListener('scroll', actualizar, { passive: true })
    window.addEventListener('resize', actualizar)
    const obs = new ResizeObserver(actualizar)
    obs.observe(linea)
    return () => {
      cancelAnimationFrame(frame)
      scroller.removeEventListener('scroll', actualizar)
      window.removeEventListener('resize', actualizar)
      obs.disconnect()
    }
  }, [filtrosKey])

  if (!estado?.nodos?.length) return null

  const ir = (id) => {
    const scroller = getScroller()
    const destino = document.getElementById(`actividad-${id}`)
    if (!scroller || !destino) return
    const barra = document.querySelector('[data-filtros]')
    const margen = (barra?.offsetHeight ?? 0) + 16
    const top = destino.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - margen
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scroller.scrollTo({ top: Math.max(0, top), behavior: suave ? 'smooth' : 'auto' })
  }

  const marco = isLight
    ? 'border-zinc-300 bg-white/85 text-zinc-900'
    : 'border-white/20 bg-[#05080f]/80 text-white'
  const guia = isLight ? 'bg-zinc-300' : 'bg-white/25'
  const punto = isLight ? 'bg-zinc-400' : 'bg-white/45'
  const activoCls = isLight ? 'bg-zinc-900' : 'bg-white'
  const visor = isLight ? 'border-zinc-900/40 bg-zinc-900/10' : 'border-white/50 bg-white/10'

  return (
    <nav
      aria-label={tr('actividades.mapa')}
      className={`fixed left-1 top-1/2 z-30 w-11 -translate-y-1/2 rounded-2xl border px-1 py-2 backdrop-blur-md sm:left-2 sm:w-14 sm:px-1.5 sm:py-3 lg:left-4 lg:w-16 ${marco}`}
    >
      <div className="relative mx-auto h-[min(58vh,28rem)] w-full">
        <div className={`absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 ${guia}`} />
        <div
          aria-hidden
          className={`absolute left-1/2 w-3 -translate-x-1/2 rounded-full border ${visor}`}
          style={{ top: `${estado.ventana.top}%`, height: `${estado.ventana.height}%` }}
        />
        {estado.anios.map((anio) => (
          <span
            key={anio.id}
            className={`pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded px-0.5 text-[9px] font-semibold leading-none ${isLight ? 'bg-white text-zinc-700' : 'bg-[#05080f] text-white/80'}`}
            style={{ top: `${anio.pct}%` }}
          >
            {anio.texto}
          </span>
        ))}
        {estado.nodos.map((nodo) => {
          const esActivo = nodo.id === estado.activo
          return (
            <button
              key={nodo.id}
              type="button"
              aria-current={esActivo ? 'true' : undefined}
              aria-label={nodo.titulo}
              onClick={() => ir(nodo.id)}
              className={
                'absolute z-20 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ' +
                (nodo.lado === 'der' ? 'right-0.5 ' : 'left-0.5 ') +
                (esActivo ? `h-2.5 w-2.5 ${activoCls}` : `h-1.5 w-1.5 ${punto}`)
              }
              style={{ top: `${nodo.pct}%` }}
            />
          )
        })}
      </div>
    </nav>
  )
}
