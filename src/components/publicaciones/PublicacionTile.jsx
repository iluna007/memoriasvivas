import { useRef } from 'react'
import gsap from 'gsap'

const PALETTE_DARK = [
  { bg: '#c4a574', fg: '#1a140c' },
  { bg: '#8b6914', fg: '#f4ead8' },
  { bg: '#2a2a28', fg: '#e8e0d4' },
  { bg: '#e8e0d4', fg: '#1c1a16' },
  { bg: '#3d4a32', fg: '#e8e0d4' },
  { bg: '#5c4033', fg: '#f0e6d8' },
  { bg: '#1e2a24', fg: '#d4c4a8' },
  { bg: '#7a5c3e', fg: '#f5efe6' },
]

const PALETTE_LIGHT = [
  { bg: '#d8c4a4', fg: '#1a140c' },
  { bg: '#b08948', fg: '#1a140c' },
  { bg: '#3a3a36', fg: '#f4ead8' },
  { bg: '#f3eee6', fg: '#1c1a16' },
  { bg: '#5a6848', fg: '#f4ead8' },
  { bg: '#7a5644', fg: '#f5efe6' },
  { bg: '#2c3a32', fg: '#e8e0d4' },
  { bg: '#8d6e4e', fg: '#f5efe6' },
]

export function hashStr(id) {
  let h = 2166136261
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function pickVariant(item) {
  if (item.tipo === 'documental') return 'image-bleed'
  if (item.portada) return hashStr(item.id) % 2 === 0 ? 'image-bleed' : 'poster-wide'
  if (item.tipo === 'placeholder') return hashStr(item.id) % 2 === 0 ? 'wordmark' : 'poster-square'
  if (item.detalle && (item.doi || item.enlaceTipo === 'doi')) return 'poster-listing'
  if (item.resumen) return 'poster-tall'
  const variants = ['poster-tall', 'poster-listing', 'poster-square', 'poster-wide', 'wordmark']
  return variants[hashStr(item.id) % variants.length]
}

function paletteFor(item, isLight) {
  const list = isLight ? PALETTE_LIGHT : PALETTE_DARK
  return list[hashStr(item.id) % list.length]
}

/**
 * @param {{
 *   item: object,
 *   variant: string,
 *   polaroid: boolean,
 *   isLight: boolean,
 *   reducedMotion: boolean,
 *   onActivate: (item: object, event: import('react').MouseEvent | import('react').KeyboardEvent) => void,
 *   onHoverChange: (id: string | null) => void,
 * }} props
 */
export default function PublicacionTile({
  item,
  variant,
  polaroid,
  isLight,
  reducedMotion = false,
  onActivate,
  onHoverChange,
}) {
  const nodeRef = useRef(null)
  const colors = paletteFor(item, isLight)
  const isPlaceholder = item.tipo === 'placeholder'
  const isDocumental = item.tipo === 'documental'
  const polaroidOn = polaroid && !isPlaceholder && !isDocumental
  const bleed = variant === 'image-bleed' && item.portada
  const frameStyle = bleed
    ? undefined
    : isPlaceholder
      ? { color: isLight ? '#1c1a16' : '#e8e0d4' }
      : {
          background: colors.bg,
          color: colors.fg,
          ...(polaroidOn ? { backgroundClip: 'padding-box', boxShadow: undefined } : {}),
        }
  const polaroidWrap = polaroidOn
    ? { background: isLight ? '#f4efe6' : '#efe6d6', color: colors.fg }
    : null

  const label = isPlaceholder
    ? 'Espacio disponible — Pensemos el archivo'
    : isDocumental
      ? `${item.titulo} — documental`
      : item.titulo

  const animateHover = (entering) => {
    const el = nodeRef.current
    if (!el || reducedMotion) return
    gsap.to(el, {
      scale: entering ? 1.035 : 1,
      y: entering ? -4 : 0,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const variantClass = {
    'poster-tall': 'poster--tall',
    'poster-listing': 'poster--listing',
    'poster-square': 'poster--square',
    'poster-wide': 'poster--wide',
    wordmark: 'poster--wordmark',
    'image-bleed': 'poster--bleed',
  }[variant] ?? 'poster--square'

  const className = [
    'poster',
    variantClass,
    polaroidOn ? 'poster--polaroid' : '',
    isPlaceholder ? 'poster--placeholder' : '',
    isDocumental ? 'poster--documental' : '',
  ].filter(Boolean).join(' ')

  const inner = isPlaceholder ? (
    <span className="poster__ph">
      <span className="poster__ph-label">Espacio disponible</span>
      <span className="poster__ph-cta">Pensemos el archivo</span>
    </span>
  ) : (
    <div className="poster__inner">
      {bleed ? <img src={item.portada} alt="" draggable={false} /> : null}
      {isDocumental ? (
        <span className="poster__play" aria-hidden="true">
          <svg viewBox="0 0 48 48" className="poster__play-icon" focusable="false">
            <circle cx="24" cy="24" r="22" />
            <path d="M19 15.5v17l14-8.5z" />
          </svg>
        </span>
      ) : null}
      {variant === 'poster-wide' && !bleed ? <div className="poster__mark" aria-hidden="true" style={{ background: colors.fg }} /> : null}
      <div className="poster__kicker">
        {[item.fuente, item.anio].filter(Boolean).join(' · ')}
      </div>
      <h2 className="poster__title line-clamp-4">{item.titulo}</h2>
      {item.autores?.length ? (
        <p className="poster__meta line-clamp-2">{item.autores.join(', ')}</p>
      ) : null}
      {variant === 'poster-listing' && item.detalle ? (
        <p className="poster__meta line-clamp-3">{item.detalle}</p>
      ) : null}
      {isDocumental ? (
        <span className="poster__badge poster__badge--documental">▶ Documental</span>
      ) : null}
      {!isDocumental && item.enlaceTipo === 'archive.org' ? <span className="poster__badge">Archive.org</span> : null}
      {!isDocumental && item.doi ? <span className="poster__badge">DOI {item.doi}</span> : null}
    </div>
  )

  return (
    <button
      ref={nodeRef}
      type="button"
      className={className}
      style={polaroidOn ? polaroidWrap : frameStyle}
      aria-label={label}
      onMouseEnter={() => {
        onHoverChange(item.id)
        animateHover(true)
      }}
      onMouseLeave={() => {
        onHoverChange(null)
        animateHover(false)
      }}
      onFocus={() => onHoverChange(item.id)}
      onBlur={() => onHoverChange(null)}
      onClick={(event) => onActivate(item, event)}
    >
      {polaroidOn ? (
        <div className="poster__inner" style={{ background: colors.bg, color: colors.fg, padding: 0, height: '100%' }}>
          {inner}
        </div>
      ) : inner}
    </button>
  )
}
