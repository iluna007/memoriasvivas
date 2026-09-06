import { getSphereContent } from '../data/cmsSphereData'
import { getSphereColor } from '../data/spheres'
import {
  getCitasPorConcepto,
  getNombreEntidad,
  urlYoutubeConTimestamp,
  urlMiniaturaYoutube,
} from '../data/citasHelpers'

export function LeftPanel({ selectedSphereId, onClose, theme = 'dark' }) {
  const isLight = theme === 'light'
  const content = selectedSphereId != null ? getSphereContent(selectedSphereId) : null
  const color = selectedSphereId != null ? getSphereColor(selectedSphereId) : null
  const citasDelConcepto = content?.id ? getCitasPorConcepto(content.id) : []

  const panelShell = isLight
    ? 'fixed left-0 top-14 bottom-0 z-[25] flex w-[380px] max-w-[90vw] flex-col border-r border-black/10 bg-white/95 text-zinc-900 shadow-2xl backdrop-blur-md'
    : 'fixed left-0 top-14 bottom-0 z-[25] flex w-[380px] max-w-[90vw] flex-col border-r border-white/10 bg-black/80 text-white shadow-2xl backdrop-blur-md'

  const closeBtn = isLight
    ? 'absolute right-2 top-2 flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full bg-zinc-200/90 text-xl leading-none text-zinc-800 transition-colors hover:bg-zinc-300 active:bg-zinc-400 touch-manipulation'
    : 'absolute right-2 top-2 flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full bg-white/10 text-xl leading-none text-white transition-colors hover:bg-white/20 active:bg-white/25 touch-manipulation'

  const citaItem = isLight
    ? 'space-y-2 border-b border-zinc-200 py-4 last:border-b-0'
    : 'space-y-2 border-b border-white/10 py-4 last:border-b-0'
  const citaTexto = isLight
    ? 'select-text text-sm leading-relaxed text-zinc-800'
    : 'select-text text-sm leading-relaxed text-white/85'
  const citaMeta = isLight ? 'text-xs text-zinc-500' : 'text-xs text-white/50'
  const citaLink = isLight
    ? 'inline-flex text-xs font-medium text-zinc-900 underline-offset-2 hover:underline'
    : 'inline-flex text-xs font-medium text-white/90 underline-offset-2 hover:underline'
  const citaEmpty = isLight ? 'text-sm text-zinc-500' : 'text-sm text-white/50'
  const thumbBorder = isLight ? 'border-zinc-200' : 'border-white/10'

  return (
    <aside
      className={panelShell}
      style={{
        borderLeftWidth: color ? 4 : 0,
        borderLeftStyle: 'solid',
        borderLeftColor: color ?? 'transparent',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="relative flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
        <button type="button" onClick={onClose} className={closeBtn} aria-label="Cerrar">
          ×
        </button>

        <h2
          className="mb-4 pr-12 text-xl font-semibold sm:text-2xl"
          style={{ color: color ?? (isLight ? '#18181b' : '#fff') }}
        >
          Citas
        </h2>

        {citasDelConcepto.length === 0 ? (
          <p className={citaEmpty}>Todavía no hay citas registradas para este concepto.</p>
        ) : (
          <ul className="list-none p-0">
            {citasDelConcepto.map((cita) => {
              const yt = urlYoutubeConTimestamp(cita.ubicacion_video, cita.timestamps)
              const miniatura = urlMiniaturaYoutube(cita.ubicacion_video)
              return (
                <li key={cita.id_cita} className={citaItem}>
                  <p className={citaTexto}>&ldquo;{cita.texto_cita}&rdquo;</p>
                  <p className={citaMeta}>
                    — {getNombreEntidad(cita.codigo_entidad)}
                    {cita.timestamps ? ` (${cita.timestamps})` : ''}
                  </p>
                  {yt && miniatura && (
                    <a
                      href={yt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative mt-2 block aspect-video w-full overflow-hidden rounded-lg border ${thumbBorder}`}
                    >
                      <img
                        src={miniatura}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-sm">
                          ▶
                        </span>
                      </span>
                    </a>
                  )}
                  {yt && !miniatura && (
                    <a href={yt} target="_blank" rel="noopener noreferrer" className={citaLink}>
                      Ver en YouTube
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
