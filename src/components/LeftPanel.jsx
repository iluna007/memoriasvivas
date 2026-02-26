import { useState } from 'react'
import { getSphereContent } from '../data/sphereContent'

export function LeftPanel({ selectedSphereId, onClose }) {
  const content = selectedSphereId != null ? getSphereContent(selectedSphereId) : null
  const color = content?.color ?? null
  const title = content?.title ?? ''
  const description = content?.description ?? ''
  const image = content?.image ?? ''
  const images = Array.isArray(content?.images) ? content.images : []
  const videos = Array.isArray(content?.videos) ? content.videos : []

  // Imágenes: se toman exclusivamente de sphereContent (image + images[])
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
            {videos.map((url, idx) => {
              const embed = getYoutubeEmbedUrl(url)
              return (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden bg-white/5 border border-white/10 aspect-video"
                >
                  <iframe
                    src={embed}
                    title={`Video ${idx + 1}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                  <div className="p-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setExpandedMedia({ type: 'video', url })}
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
            <div className="w-full max-w-4xl px-4">
              <div className="aspect-video rounded-lg overflow-hidden border border-white/20 bg-black">
                <iframe
                  src={getYoutubeEmbedUrl(expandedMedia.url)}
                  title="Video ampliado"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
