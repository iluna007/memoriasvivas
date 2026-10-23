import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Map, { Layer, Marker, Source } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { buildOsaMapPins } from '../data/osaMapPins'

/** Estilo personalizado Mapbox Studio (agua beige / relieve Osa) */
const MAP_STYLE = 'mapbox://styles/ikerluna/cmtpzoh1k00iz01s21qb3hlsf'

/**
 * Vista inicial alineada a la captura de Studio:
 * península de Osa + Golfo Dulce, inclinada hacia el NNE.
 */
const FERROCARRIL_SRC = '/mapa/ferrocarril-del-sur.geojson'

const FERROCARRIL_TRAZO = {
  type: 'line',
  layout: { 'line-cap': 'round', 'line-join': 'round' },
}

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
  const { t } = useTranslation()
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
        <button type="button" onClick={onClose} className={closeBtn} aria-label={t('mapa.cerrar')}>
          ×
        </button>

        {selectedVideo ? (
          <>
            <button type="button" onClick={onBackToList} className={backBtn}>
              ← {t('mapa.volver')}
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
              {t('mapa.videos', { count: territorio.videos.length })}
            </p>

            {territorio.videos.length === 0 ? (
              <p className={empty}>{t('mapa.sinVideos')}</p>
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
  const { t } = useTranslation()
  const { theme = 'dark' } = useOutletContext() ?? {}
  const isLight = theme === 'light'
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  const [selectedTerritorio, setSelectedTerritorio] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [mostrarFerrocarril, setMostrarFerrocarril] = useState(true)

  const pins = useMemo(() => buildOsaMapPins(), [])

  const closePanel = () => {
    setSelectedTerritorio(null)
    setSelectedVideo(null)
  }

  if (!token) {
    return (
      <main className="min-h-full px-6 py-10 pt-16">
        <h1 className="mb-3 text-xl font-semibold">{t('mapa.titulo')}</h1>
        <p className="mb-4 max-w-lg text-sm leading-relaxed text-inherit/80">
          {t('mapa.faltaToken')}
        </p>
        <ul className="max-w-lg list-inside list-disc space-y-2 text-sm text-inherit/75">
          <li>
            {t('mapa.netlify')}
          </li>
          <li>
            {t('mapa.local')}
          </li>
        </ul>
        <p className="mt-4 text-xs text-inherit/55">
          {t('mapa.nota')}
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
          {mostrarFerrocarril && (
            <Source id="ferrocarril-sur" type="geojson" data={FERROCARRIL_SRC}>
              <Layer
                id="ferrocarril-sur-halo"
                {...FERROCARRIL_TRAZO}
                paint={{
                  'line-color': '#f6f1e6',
                  'line-width': ['interpolate', ['linear'], ['zoom'], 8, 2.2, 12, 5, 15, 8],
                  'line-opacity': 0.9,
                }}
              />
              <Layer
                id="ferrocarril-sur"
                {...FERROCARRIL_TRAZO}
                paint={{
                  'line-color': '#3a2a1c',
                  'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.1, 12, 2.4, 15, 4],
                }}
              />
            </Source>
          )}
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
                aria-label={t('mapa.verVideos', { nombre: pin.nombre })}
                title={`${pin.nombre} (${t('mapa.videos', { count: pin.videos.length })})`}
              >
                <span className="text-sm font-bold" aria-hidden>
                  ▶
                </span>
              </button>
            </Marker>
          ))}
        </Map>

        <aside className="absolute right-4 top-4 z-10 min-w-44 rounded-lg bg-black/55 px-3 py-2.5 text-white shadow-md">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">{t('mapa.leyenda')}</p>
          <button
            type="button"
            aria-pressed={mostrarFerrocarril}
            aria-label={t(mostrarFerrocarril ? 'mapa.ocultarCapa' : 'mapa.mostrarCapa', { nombre: t('mapa.ferrocarril') })}
            onClick={() => setMostrarFerrocarril((v) => !v)}
            className={`mt-2 flex w-full items-center gap-2 text-left text-[12px] leading-none ${mostrarFerrocarril ? 'text-white' : 'text-white/40'}`}
          >
            <span
              className={`inline-block h-[3px] w-6 shrink-0 rounded-full shadow-[inset_0_0_0_1px_#3a2a1c] ${mostrarFerrocarril ? 'bg-[#f6f1e6]' : 'bg-white/25'}`}
              aria-hidden
            />
            {t('mapa.ferrocarril')}
          </button>
        </aside>

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
