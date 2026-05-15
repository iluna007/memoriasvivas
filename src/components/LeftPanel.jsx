import { useState } from 'react'
import { getSphereContent } from '../data/cmsSphereData'
import { getSphereColor } from '../data/spheres'

export function LeftPanel({ selectedSphereId, onClose, theme = 'dark' }) {
  const isLight = theme === 'light'
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

  const panelShell = isLight
    ? 'fixed left-0 top-14 bottom-0 z-[25] flex w-[380px] max-w-[90vw] flex-col border-r border-black/10 bg-white/95 text-zinc-900 shadow-2xl backdrop-blur-md'
    : 'fixed left-0 top-14 bottom-0 z-[25] flex w-[380px] max-w-[90vw] flex-col border-r border-white/10 bg-black/80 text-white shadow-2xl backdrop-blur-md'

  const closeBtn = isLight
    ? 'absolute right-2 top-2 flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full bg-zinc-200/90 text-xl leading-none text-zinc-800 transition-colors hover:bg-zinc-300 active:bg-zinc-400 touch-manipulation'
    : 'absolute right-2 top-2 flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full bg-white/10 text-xl leading-none text-white transition-colors hover:bg-white/20 active:bg-white/25 touch-manipulation'

  const descCls = isLight ? 'mb-6 select-text text-sm leading-relaxed text-zinc-700' : 'mb-6 select-text text-sm leading-relaxed text-white/80'
  const h3Cls = isLight ? 'text-sm font-medium text-zinc-600' : 'text-sm font-medium text-white/70'
  const cardCls = isLight ? 'overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50' : 'overflow-hidden rounded-lg border border-white/10 bg-white/5'
  const metaBox = isLight
    ? 'select-text space-y-3 border-t border-zinc-200 bg-zinc-100/90 px-3 py-3 text-xs text-zinc-800'
    : 'select-text space-y-3 border-t border-white/10 bg-black/30 px-3 py-3 text-xs text-white/85'
  const metaLabel = isLight ? 'mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500' : 'mb-1 text-[10px] font-medium uppercase tracking-wide text-white/45'
  const metaText = isLight ? 'leading-relaxed text-zinc-900' : 'leading-relaxed text-white/90'
  const footerBar = isLight ? 'flex justify-end border-t border-zinc-200 p-2' : 'flex justify-end border-t border-white/10 p-2'
  const verBtn = isLight
    ? 'rounded-md bg-zinc-200 px-3 py-1 text-[11px] text-zinc-900 transition-colors hover:bg-zinc-300'
    : 'rounded-md bg-white/10 px-3 py-1 text-[11px] text-white transition-colors hover:bg-white/20'
  const imgFrame = isLight
    ? 'cursor-pointer overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 transition-colors group-hover:border-zinc-400'
    : 'cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-white/30'

  const overlay = isLight ? 'fixed inset-0 z-[40] flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm' : 'fixed inset-0 z-[40] flex items-center justify-center bg-black/80 backdrop-blur-sm'
  const overlayClose = isLight
    ? 'absolute right-4 top-4 flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full bg-white/90 text-xl leading-none text-zinc-800 transition-colors hover:bg-white'
    : 'absolute right-4 top-4 flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full bg-white/15 text-xl leading-none text-white transition-colors hover:bg-white/25 active:bg-white/30'
  const imgModal = isLight ? 'max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg border border-zinc-300 bg-white' : 'max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg border border-white/20 bg-black'
  const vidFrame = isLight ? 'aspect-video overflow-hidden rounded-lg border border-zinc-300 bg-black' : 'aspect-video overflow-hidden rounded-lg border border-white/20 bg-black'
  const expandedMeta = isLight
    ? 'mt-4 select-text space-y-3 rounded-lg border border-zinc-200 bg-white/95 p-4 text-sm text-zinc-800'
    : 'mt-4 select-text space-y-3 rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white/85'
  const expLabel = isLight ? 'mb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500' : 'mb-1 text-[11px] font-medium uppercase tracking-wide text-white/45'

  return (
    <aside
      className={panelShell}
      style={{
        borderLeftWidth: color ? 4 : 0,
        borderLeftStyle: 'solid',
        borderLeftColor: color ?? 'transparent',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="relative flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
        <button type="button" onClick={onClose} className={closeBtn} aria-label="Cerrar">
          ×
        </button>

        <h2 className="mb-4 pr-12 text-xl font-semibold sm:text-2xl" style={{ color: color ?? (isLight ? '#18181b' : '#fff') }}>
          {title}
        </h2>

        {description && <p className={descCls}>{description}</p>}

        {videos.length > 0 && (
          <div className="space-y-4">
            <h3 className={h3Cls}>Vídeos</h3>
            {videos.map((video, idx) => {
              const embed = getYoutubeEmbedUrl(video.url)
              const hasMeta =
                (video.entrevista && String(video.entrevista).trim()) ||
                (video.registroAudiovisual && String(video.registroAudiovisual).trim()) ||
                (video.postProduccion && String(video.postProduccion).trim())
              return (
                <div key={idx} className={cardCls}>
                  <div className="aspect-video w-full">
                    <iframe
                      src={embed}
                      title={video.titulo || `Video ${idx + 1}`}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  {hasMeta && (
                    <div className={metaBox}>
                      {video.entrevista && String(video.entrevista).trim() && (
                        <div>
                          <p className={metaLabel}>Entrevista</p>
                          <p className={metaText}>{video.entrevista}</p>
                        </div>
                      )}
                      {video.registroAudiovisual && String(video.registroAudiovisual).trim() && (
                        <div>
                          <p className={metaLabel}>Registro audiovisual</p>
                          <p className={metaText}>{video.registroAudiovisual}</p>
                        </div>
                      )}
                      {video.postProduccion && String(video.postProduccion).trim() && (
                        <div>
                          <p className={metaLabel}>Post-producción</p>
                          <p className={metaText}>{video.postProduccion}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className={footerBar}>
                    <button type="button" onClick={() => setExpandedMedia({ type: 'video', url: video.url, video })} className={verBtn}>
                      Ver en grande
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {allImages.length > 0 && (
          <div className="mt-6 space-y-4">
            {allImages.map((src, idx) => (
              <button key={idx} type="button" onClick={() => setExpandedMedia({ type: 'image', url: src })} className="group block w-full text-left">
                <div className={imgFrame}>
                  <img src={src} alt="" className="block h-auto w-full" loading="lazy" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {expandedMedia && (
        <div className={overlay}>
          <button type="button" onClick={() => setExpandedMedia(null)} className={overlayClose} aria-label="Cerrar vista ampliada">
            ×
          </button>
          {expandedMedia.type === 'image' ? (
            <div className={imgModal}>
              <img src={expandedMedia.url} alt="" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto px-4 pb-8">
              <div className={vidFrame}>
                <iframe
                  src={getYoutubeEmbedUrl(expandedMedia.url)}
                  title={expandedMedia.video?.titulo || 'Video ampliado'}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              {expandedMedia.video &&
                (expandedMedia.video.entrevista ||
                  expandedMedia.video.registroAudiovisual ||
                  expandedMedia.video.postProduccion) && (
                  <div className={expandedMeta}>
                    {expandedMedia.video.entrevista && String(expandedMedia.video.entrevista).trim() && (
                      <div>
                        <p className={expLabel}>Entrevista</p>
                        <p className="leading-relaxed">{expandedMedia.video.entrevista}</p>
                      </div>
                    )}
                    {expandedMedia.video.registroAudiovisual && String(expandedMedia.video.registroAudiovisual).trim() && (
                      <div>
                        <p className={expLabel}>Registro audiovisual</p>
                        <p className="leading-relaxed">{expandedMedia.video.registroAudiovisual}</p>
                      </div>
                    )}
                    {expandedMedia.video.postProduccion && String(expandedMedia.video.postProduccion).trim() && (
                      <div>
                        <p className={expLabel}>Post-producción</p>
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
