import { useMemo, useState, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { buildOsaMapPins } from '../data/osaMapPins'

/** Estilo personalizado Mapbox Studio */
const MAP_STYLE = 'mapbox://styles/ikerluna/cmmp97lzz001o01s46t647djn'

/**
 * Vista inicial: sur de Costa Rica, península de Osa (zona de Matapalo / costa sur).
 * [lng, lat] en WGS84
 */
const INITIAL_VIEW_STATE = {
  longitude: -83.28,
  latitude: 8.41,
  zoom: 9.6,
  pitch: 0,
  bearing: 0
}

function getYoutubeEmbedUrl(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      if (u.pathname.startsWith('/embed/')) return url
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/')[2]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
    }
    return url
  } catch {
    return url
  }
}

export default function Mapa() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const isLight = theme === 'light'
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  const [selected, setSelected] = useState(null)

  const pins = useMemo(() => buildOsaMapPins(), [])

  const closePopup = useCallback(() => setSelected(null), [])

  if (!token) {
    return (
      <main className="min-h-full px-6 py-10 pt-16">
        <h1 className="mb-3 text-xl font-semibold">Mapa</h1>
        <p className="mb-4 max-w-lg text-sm leading-relaxed text-inherit/80">
          Falta la variable{' '}
          <code className={`rounded px-1 py-0.5 ${isLight ? 'bg-amber-100 text-amber-900' : 'bg-white/10 text-amber-200/90'}`}>
            VITE_MAPBOX_ACCESS_TOKEN
          </code>{' '}
          en el entorno del build.
        </p>
        <ul className="max-w-lg list-inside list-disc space-y-2 text-sm text-inherit/75">
          <li>
            <strong className="text-inherit/95">Netlify:</strong> Sitio →{' '}
            <em>Site configuration</em> → <em>Environment variables</em> → añade{' '}
            <code className={isLight ? 'text-amber-800' : 'text-amber-200/90'}>VITE_MAPBOX_ACCESS_TOKEN</code> con tu token{' '}
            <code className="text-inherit/85">pk.…</code>. Después ejecuta un nuevo deploy (mejor &quot;Clear cache and
            deploy&quot;).
          </li>
          <li>
            <strong className="text-inherit/95">En tu PC:</strong> crea{' '}
            <code className={isLight ? 'text-amber-800' : 'text-amber-200/90'}>.env</code> en la raíz del proyecto (puedes partir de{' '}
            <code className={isLight ? 'text-amber-800' : 'text-amber-200/90'}>.env.example</code>) y pega el mismo token.
          </li>
        </ul>
        <p className="mt-4 text-xs text-inherit/55">
          El archivo <code>.env</code> no se sube a Git; por eso en producción hay que configurarlo en el panel de
          Netlify.
        </p>
      </main>
    )
  }

  return (
    <main className="flex h-full min-h-0 flex-col pt-14">
      <div className="relative min-h-0 w-full flex-1">
        <Map
          mapboxAccessToken={token}
          mapStyle={MAP_STYLE}
          initialViewState={INITIAL_VIEW_STATE}
          style={{ width: '100%', height: '100%' }}
        >
          {pins.map((pin) => (
            <Marker key={pin.pinId} longitude={pin.longitude} latitude={pin.latitude} anchor="bottom">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected(pin)
                }}
                className="flex h-9 w-9 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white/90 bg-amber-500 text-white shadow-lg transition hover:scale-110 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                aria-label={`Abrir vídeo: ${pin.titulo}`}
                title={pin.titulo}
              >
                <span className="text-sm font-bold" aria-hidden>
                  ▶
                </span>
              </button>
            </Marker>
          ))}
        </Map>

        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <button
              type="button"
              className="absolute inset-0 cursor-default"
              aria-label="Cerrar"
              onClick={closePopup}
            />
            <div
              className={
                'relative z-10 w-full max-w-3xl rounded-xl p-4 shadow-2xl ' +
                (isLight
                  ? 'border border-zinc-200 bg-white text-zinc-900'
                  : 'border border-white/15 bg-black/95 text-white')
              }
            >
              <button
                type="button"
                onClick={closePopup}
                className={
                  'absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full ' +
                  (isLight ? 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300' : 'bg-white/10 text-white hover:bg-white/20')
                }
                aria-label="Cerrar"
              >
                ×
              </button>
              <h2 className={'pr-12 text-base font-semibold sm:text-lg ' + (isLight ? 'text-zinc-900' : 'text-white')}>
                {selected.titulo}
              </h2>
              <p className={'mt-1 text-xs ' + (isLight ? 'text-zinc-500' : 'text-white/45')}>{selected.idRelato}</p>
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border border-black/10 bg-black">
                <iframe
                  src={getYoutubeEmbedUrl(selected.url)}
                  title={selected.titulo}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
