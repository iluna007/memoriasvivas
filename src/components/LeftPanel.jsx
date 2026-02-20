import { getSphereContent } from '../data/sphereContent'

export function LeftPanel({ selectedSphereId, onClose }) {
  const content = selectedSphereId != null ? getSphereContent(selectedSphereId) : null
  const color = content?.color ?? null
  const title = content?.title ?? ''
  const description = content?.description ?? ''
  const image = content?.image ?? ''
  const images = Array.isArray(content?.images) ? content.images : []
  const videos = Array.isArray(content?.videos) ? content.videos : []

  const allImages = [image, ...images].filter(Boolean)

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[380px] max-w-[90vw] bg-black/95 backdrop-blur-sm border-r border-white/10 flex flex-col z-30 shadow-2xl"
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

        {allImages.length > 0 && (
          <div className="space-y-4 mb-6">
            {allImages.map((src, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <img
                  src={src}
                  alt=""
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {videos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Vídeos</h3>
            {videos.map((url, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden bg-white/5 border border-white/10 aspect-video">
                <video
                  src={url}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Tu navegador no soporta la etiqueta de vídeo.
                </video>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
