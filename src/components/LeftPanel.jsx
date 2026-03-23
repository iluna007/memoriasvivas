import { useState } from 'react'
import { getSphereContent } from '../data/cmsSphereData'
import { getSphereColor } from '../data/spheres'

export function LeftPanel({ selectedSphereId, onClose }) {
  const content = selectedSphereId != null ? getSphereContent(selectedSphereId) : null
  const color = selectedSphereId != null ? getSphereColor(selectedSphereId) : null
  const title = content?.title ?? ''
  const description = content?.description ?? ''
  const image = content?.image ?? ''
  const images = Array.isArray(content?.images) ? content.images : []
  const rawVideos = Array.isArray(content?.videos) ? content.videos : []
  /** Normaliza: string (URL) legacy u objeto { url, entrevista, … } */
  const videos = rawVideos.map((v) =>
    typeof v === 'string'
      ? { url: v, entrevista: null, registroAudiovisual: null, postProduccion: null }
      : { url: v.url, titulo: v.titulo, entrevista: v.entrevista ?? null, registroAudiovisual: v.registroAudiovisual ?? null, postProduccion: v.postProduccion ?? null }
  )

  // Imágenes: CMS (image + images[] en cmsSphereData)
  const allImages = [image, ...images].filter(Boolean)

  const [expandedMedia, setExpandedMedia] = useState(null)

  const getYoutubeEmbedUrl = (url) => {
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

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[380px] max-w-[90vw] bg-black/80 backdrop-blur-md border-r border-white/10 flex flex-col z-30 shadow-2xl"
      style={{
        borderLeftWidth: color ? 4 : 0,
        borderLeftStyle: 'solid',
        borderLeftColor: color ?? 'transparent',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto relative overscroll-contain">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 flex items-center justify-center text-white text-xl leading-none transition-colors touch-manipulation"
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 className="text-xl sm:text-2xl font-semibold text-white pr-12 mb-4" style={{ color: color ?? '#fff' }}>
          {title}
        </h2>

        {description && (
          <p className="text-white/80 text-sm leading-relaxed mb-6 select-text">
            {description}
          </p>
        )}

        {videos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Vídeos</h3>
            {videos.map((video, idx) => {
              const embed = getYoutubeEmbedUrl(video.url)
              const hasMeta =
                (video.entrevista && String(video.entrevista).trim()) ||
                (video.registroAudiovisual && String(video.registroAudiovisual).trim()) ||
                (video.postProduccion && String(video.postProduccion).trim())
              return (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden bg-white/5 border border-white/10"
                >
                  <div className="aspect-video w-full">
                    <iframe
                      src={embed}
                      title={video.titulo || `Video ${idx + 1}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  {hasMeta && (
                    <div className="px-3 py-3 space-y-3 text-xs text-white/85 border-t border-white/10 bg-black/30 select-text">
                      {video.entrevista && String(video.entrevista).trim() && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-white/45 font-medium mb-1">
                            Entrevista
                          </p>
                          <p className="leading-relaxed text-white/90">{video.entrevista}</p>
                        </div>
                      )}
                      {video.registroAudiovisual && String(video.registroAudiovisual).trim() && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-white/45 font-medium mb-1">
                            Registro audiovisual
                          </p>
                          <p className="leading-relaxed text-white/90">{video.registroAudiovisual}</p>
                        </div>
                      )}
                      {video.postProduccion && String(video.postProduccion).trim() && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-white/45 font-medium mb-1">
                            Post-producción
                          </p>
                          <p className="leading-relaxed text-white/90">{video.postProduccion}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-2 flex justify-end border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setExpandedMedia({ type: 'video', url: video.url, video })}
                      className="px-3 py-1 text-[11px] rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Ver en grande
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {allImages.length > 0 && (
          <div className="space-y-4 mt-6">
            {allImages.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setExpandedMedia({ type: 'image', url: src })}
                className="block w-full text-left group"
              >
                <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/30 transition-colors cursor-pointer">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {expandedMedia && (
        <div className="fixed inset-0 z-[40] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <button
            type="button"
            onClick={() => setExpandedMedia(null)}
            className="absolute top-4 right-4 min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 flex items-center justify-center text-white text-xl leading-none transition-colors"
            aria-label="Cerrar vista ampliada"
          >
            ×
          </button>
          {expandedMedia.type === 'image' ? (
            <div className="max-w-[90vw] max-h-[90vh] rounded-lg overflow-hidden border border-white/20 bg-black">
              <img
                src={expandedMedia.url}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto px-4 pb-8">
              <div className="aspect-video rounded-lg overflow-hidden border border-white/20 bg-black">
                <iframe
                  src={getYoutubeEmbedUrl(expandedMedia.url)}
                  title={expandedMedia.video?.titulo || 'Video ampliado'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              {expandedMedia.video &&
                (expandedMedia.video.entrevista ||
                  expandedMedia.video.registroAudiovisual ||
                  expandedMedia.video.postProduccion) && (
                  <div className="mt-4 space-y-3 text-sm text-white/85 border border-white/15 rounded-lg p-4 bg-black/50 select-text">
                    {expandedMedia.video.entrevista && String(expandedMedia.video.entrevista).trim() && (
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-white/45 font-medium mb-1">
                          Entrevista
                        </p>
                        <p className="leading-relaxed">{expandedMedia.video.entrevista}</p>
                      </div>
                    )}
                    {expandedMedia.video.registroAudiovisual &&
                      String(expandedMedia.video.registroAudiovisual).trim() && (
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-white/45 font-medium mb-1">
                            Registro audiovisual
                          </p>
                          <p className="leading-relaxed">{expandedMedia.video.registroAudiovisual}</p>
                        </div>
                      )}
                    {expandedMedia.video.postProduccion && String(expandedMedia.video.postProduccion).trim() && (
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-white/45 font-medium mb-1">
                          Post-producción
                        </p>
                        <p className="leading-relaxed">{expandedMedia.video.postProduccion}</p>
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
