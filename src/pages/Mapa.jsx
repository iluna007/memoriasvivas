import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Map, { Marker, Source } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { buildOsaMapPins } from '../data/osaMapPins'

/** Estilo personalizado Mapbox Studio (agua beige / relieve Osa) */
const MAP_STYLE = 'mapbox://styles/ikerluna/cmtpzoh1k00iz01s21qb3hlsf'

/**
 * Vista inicial alineada a la captura de Studio:
 * península de Osa + Golfo Dulce, inclinada hacia el NNE.
 */
const INITIAL_VIEW_STATE = {
  longitude: -83.365108,
  latitude: 8.595163,
  zoom: 10.62,
  pitch: 69.98,
  bearing: -10.4,
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

/** Panel lateral izquierdo (misma base visual que LeftPanel de constelaciones). */
function MapaVideosPanel({ territorio, selectedVideo, onSelectVideo, onBackToList, onClose, theme }) {
  const isLight = theme === 'light'

  const panelShell = isLight
    ? 'fixed left-0 top-14 bottom-0 z-[25] flex w-[380px] max-w-[90vw] flex-col border-r border-black/10 bg-white/45 text-zinc-900 shadow-2xl backdrop-blur-md'
    : 'fixed left-0 top-14 bottom-0 z-[25] flex w-[380px] max-w-[90vw] flex-col border-r border-white/10 bg-black/35 text-white shadow-2xl backdrop-blur-md'

  const closeBtn = isLight
    ? 'absolute right-2 top-2 flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full bg-zinc-200/90 text-xl leading-none text-zinc-800 transition-colors hover:bg-zinc-300 active:bg-zinc-400 touch-manipulation'
    : 'absolute right-2 top-2 flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full bg-white/10 text-xl leading-none text-white transition-colors hover:bg-white/20 active:bg-white/25 touch-manipulation'

  const backBtn = isLight
    ? 'mb-3 text-xs font-medium text-zinc-600 underline-offset-2 hover:underline'
    : 'mb-3 text-xs font-medium text-white/70 underline-offset-2 hover:underline'

  const empty = isLight ? 'text-sm text-zinc-500' : 'text-sm text-white/50'
  const meta = isLight ? 'text-xs text-zinc-500' : 'text-xs text-white/50'
  const thumbBorder = isLight ? 'border-zinc-200' : 'border-white/10'

  return (
    <aside
      className={panelShell}
      style={{
        paddingLeft: 'env(safe-area-inset-left)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="relative flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
        <button type="button" onClick={onClose} className={closeBtn} aria-label="Cerrar">
          ×
        </button>

        {selectedVideo ? (
          <>
            <button type="button" onClick={onBackToList} className={backBtn}>
              ← Volver a la lista
            </button>
            <h2 className="mb-1 pr-12 text-xl font-semibold sm:text-2xl">{territorio.nombre}</h2>
            <p className={`mb-4 text-sm ${meta}`}>{selectedVideo.titulo}</p>
            <div className={`aspect-video w-full overflow-hidden rounded-lg border bg-black ${thumbBorder}`}>
              <iframe
                src={getYoutubeEmbedUrl(selectedVideo.url)}
                title={selectedVideo.titulo}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-1 pr-12 text-xl font-semibold sm:text-2xl">{territorio.nombre}</h2>
            <p className={`mb-4 ${meta}`}>
              {territorio.videos.length}{' '}
              {territorio.videos.length === 1 ? 'video' : 'videos'}
            </p>

            {territorio.videos.length === 0 ? (
              <p className={empty}>Todavía no hay videos asignados a este territorio.</p>
            ) : (
              <ul className="list-none space-y-3 p-0">
                {territorio.videos.map((v) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => onSelectVideo(v)}
                      className={`group relative block w-full overflow-hidden rounded-lg border text-left ${thumbBorder}`}
                    >
                      <span className="relative block aspect-video w-full">
                        <img src={v.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm text-black shadow-sm">
                            ▶
                          </span>
                        </span>
                      </span>
                      <span
                        className={
                          'block px-2.5 py-2 text-xs leading-snug ' +
                          (isLight ? 'text-zinc-800' : 'text-white/90')
                        }
                      >
                        {v.titulo}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </aside>
  )
}

export default function Mapa() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const isLight = theme === 'light'
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  const [selectedTerritorio, setSelectedTerritorio] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const pins = useMemo(() => buildOsaMapPins(), [])

  const closePanel = () => {
    setSelectedTerritorio(null)
    setSelectedVideo(null)
  }

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
          maxPitch={85}
          terrain={{ source: 'mapbox-dem', exaggeration: 1.35 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Source
            id="mapbox-dem"
            type="raster-dem"
            url="mapbox://mapbox.mapbox-terrain-dem-v1"
            tileSize={512}
            maxzoom={14}
          />
          {pins.map((pin) => (
            <Marker key={pin.pinId} longitude={pin.longitude} latitude={pin.latitude} anchor="bottom">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedTerritorio(pin)
                  setSelectedVideo(null)
                }}
                className="flex h-9 w-9 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-black/20 bg-white text-black shadow-md transition hover:scale-105 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-black/25"
                aria-label={`Ver videos de ${pin.nombre}`}
                title={`${pin.nombre} (${pin.videos.length} ${pin.videos.length === 1 ? 'video' : 'videos'})`}
              >
                <span className="text-sm font-bold" aria-hidden>
                  ▶
                </span>
              </button>
            </Marker>
          ))}
        </Map>

        {selectedTerritorio && (
          <MapaVideosPanel
            territorio={selectedTerritorio}
            selectedVideo={selectedVideo}
            onSelectVideo={setSelectedVideo}
            onBackToList={() => setSelectedVideo(null)}
            onClose={closePanel}
            theme={theme}
          />
        )}
      </div>
    </main>
  )
}
