import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { getContentPageTheme } from '../../utils/pageThemeClasses'
import PublicacionTile, { hashStr, pickVariant } from './PublicacionTile'
import PublicacionModal from './PublicacionModal'

const WORLD_COPIES = [-1, 0, 1]
const DRAG_THRESHOLD = 8

function variantSpan(variant, item) {
  switch (variant) {
    case 'poster-tall':
    case 'poster-listing':
      return { cols: 1, rows: 2 }
    case 'poster-wide':
      return { cols: 2, rows: 1 }
    case 'wordmark':
      return { cols: 1, rows: 0.55 }
    case 'image-bleed':
      return { cols: 1, rows: item.tipo === 'documental' ? 2 : (hashStr(item.id) % 2 === 0 ? 2 : 1) }
    default:
      return { cols: 1, rows: 1 }
  }
}

function buildLayout(items, compact) {
  const cols = compact ? 4 : 6
  const cellW = compact ? 158 : 248
  const cellH = compact ? 128 : 198
  const gap = compact ? 28 : 56
  const colHeights = new Array(cols).fill(gap)

  const placed = items.map((item) => {
    const variant = pickVariant(item)
    const polaroid = item.tipo !== 'placeholder' && item.tipo !== 'documental' && hashStr(item.id) % 4 === 0
    const span = variantSpan(variant, item)
    const colSpan = Math.min(span.cols, cols)
    let bestCol = 0
    let bestY = Infinity
    for (let c = 0; c <= cols - colSpan; c += 1) {
      const y = Math.max(...colHeights.slice(c, c + colSpan))
      if (y < bestY) {
        bestY = y
        bestCol = c
      }
    }

    const jitterX = (hashStr(`${item.id}-x`) % 21) - 10
    const jitterY = hashStr(`${item.id}-y`) % 18
    const extraGap = hashStr(`${item.id}-g`) % 5 === 0 ? gap * 0.8 : 0
    const width = colSpan * cellW + (colSpan - 1) * gap
    const height = span.rows * cellH + Math.max(0, span.rows - 1) * gap * 0.25
    const x = bestCol * (cellW + gap) + gap + jitterX * 0.45
    const y = bestY + jitterY * 0.35

    const nextH = y + height + gap + extraGap
    for (let c = bestCol; c < bestCol + colSpan; c += 1) colHeights[c] = nextH

    return { item, variant, polaroid, x, y, width, height }
  })

  return {
    placed,
    tileW: cols * (cellW + gap) + gap * 2,
    tileH: Math.max(...colHeights) + gap * 2,
  }
}

function wrap(value, size) {
  if (!size) return 0
  return ((value % size) + size) % size
}

export default function PublicacionesWall({ items, theme = 'dark' }) {
  const t = getContentPageTheme(theme)
  const isLight = theme === 'light'
  const rootRef = useRef(null)
  const worldRefs = useRef([])
  const panRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef(null)
  const samplesRef = useRef([])
  const inertiaRef = useRef(null)
  const suppressClickRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const sizeRef = useRef({ tileW: 1, tileH: 1 })
  const hintRef = useRef(null)
  const tooltipRef = useRef(null)
  const hoveredRef = useRef(null)

  const [compact, setCompact] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [modalItem, setModalItem] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const [grabbing, setGrabbing] = useState(false)

  const layout = useMemo(() => buildLayout(items, compact), [items, compact])
  sizeRef.current = { tileW: layout.tileW, tileH: layout.tileH }

  const applyTransform = useCallback(() => {
    const { tileW, tileH } = sizeRef.current
    const x = wrap(panRef.current.x, tileW)
    const y = wrap(panRef.current.y, tileH)
    panRef.current.x = x
    panRef.current.y = y
    let i = 0
    for (const cy of WORLD_COPIES) {
      for (const cx of WORLD_COPIES) {
        const el = worldRefs.current[i]
        i += 1
        if (!el) continue
        el.style.transform = `translate3d(${cx * tileW - x}px, ${cy * tileH - y}px, 0)`
      }
    }
  }, [])

  const killInertia = useCallback(() => {
    inertiaRef.current?.kill()
    inertiaRef.current = null
  }, [])

  const fadeHint = useCallback(() => {
    const hint = hintRef.current
    if (!hint) return
    gsap.to(hint, { opacity: 0, duration: reducedMotionRef.current ? 0.01 : 0.6, ease: 'power2.out' })
  }, [])

  const activateItem = useCallback((item, event) => {
    if (suppressClickRef.current) {
      event.preventDefault()
      return
    }
    if (item.tipo === 'placeholder') {
      setTooltip({
        x: event.clientX ?? 24,
        y: event.clientY ?? 24,
        text: 'Este espacio está pendiente de contenido',
      })
      return
    }
    if (item.archivoLocal) {
      setModalItem(item)
      return
    }
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)

    const hintTimer = window.setTimeout(fadeHint, 2600)
    applyTransform()

    return () => {
      mq.removeEventListener('change', sync)
      window.clearTimeout(hintTimer)
      killInertia()
    }
  }, [applyTransform, fadeHint, killInertia])

  useEffect(() => {
    applyTransform()
  }, [applyTransform, layout.tileW, layout.tileH])

  useEffect(() => {
    if (!tooltip) return undefined
    const el = tooltipRef.current
    if (el && !reducedMotionRef.current) {
      gsap.fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power3.out' })
    }
    const timer = window.setTimeout(() => setTooltip(null), 1800)
    return () => window.clearTimeout(timer)
  }, [tooltip])

  useEffect(() => {
    const zone = rootRef.current
    if (!zone) return undefined

    const onPointerDown = (event) => {
      if (event.button != null && event.button !== 0) return
      if (event.target.closest('.pub-modal')) return
      killInertia()
      fadeHint()
      setGrabbing(true)
      suppressClickRef.current = false
      dragRef.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        originX: event.clientX,
        originY: event.clientY,
      }
      samplesRef.current = [{ t: performance.now(), x: panRef.current.x, y: panRef.current.y }]
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
    }

    const onPointerMove = (event) => {
      const drag = dragRef.current
      if (!drag || drag.id !== event.pointerId) return
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      drag.x = event.clientX
      drag.y = event.clientY
      panRef.current.x -= dx
      panRef.current.y -= dy
      applyTransform()
      const dist = Math.hypot(event.clientX - drag.originX, event.clientY - drag.originY)
      if (dist > DRAG_THRESHOLD) suppressClickRef.current = true
      const now = performance.now()
      samplesRef.current.push({ t: now, x: panRef.current.x, y: panRef.current.y })
      samplesRef.current = samplesRef.current.filter((s) => now - s.t <= 90)
    }

    const onPointerUp = (event) => {
      const drag = dragRef.current
      if (!drag || drag.id !== event.pointerId) return
      dragRef.current = null
      setGrabbing(false)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)

      if (reducedMotionRef.current) {
        applyTransform()
        return
      }

      const now = performance.now()
      const samples = samplesRef.current.filter((s) => now - s.t <= 90)
      if (samples.length < 2) return
      const first = samples[0]
      const last = samples[samples.length - 1]
      const dt = Math.max(16, last.t - first.t)
      const vx = ((last.x - first.x) / dt) * 1000
      const vy = ((last.y - first.y) / dt) * 1000
      const speed = Math.hypot(vx, vy)
      if (speed < 90) {
        applyTransform()
        return
      }

      const factor = compact ? 0.38 : 0.28
      const duration = Math.min(1.6, Math.max(0.4, speed / 1800))
      const target = {
        x: panRef.current.x + vx * factor,
        y: panRef.current.y + vy * factor,
      }
      const tweenTarget = { x: panRef.current.x, y: panRef.current.y }
      inertiaRef.current = gsap.to(tweenTarget, {
        x: target.x,
        y: target.y,
        duration,
        ease: 'power3.out',
        onUpdate: () => {
          panRef.current.x = tweenTarget.x
          panRef.current.y = tweenTarget.y
          applyTransform()
        },
        onComplete: applyTransform,
      })
    }

    const onWheel = (event) => {
      event.preventDefault()
      killInertia()
      fadeHint()
      panRef.current.x += event.deltaX
      panRef.current.y += event.deltaY
      applyTransform()
    }

    zone.addEventListener('pointerdown', onPointerDown)
    zone.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      zone.removeEventListener('pointerdown', onPointerDown)
      zone.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [applyTransform, compact, fadeHint, killInertia])

  const onHoverChange = useCallback((id) => {
    hoveredRef.current = id
    setHoveredId(id)
  }, [])

  return (
    <>
      <div
        ref={rootRef}
        className={`wall ${isLight ? 'is-light' : 'is-dark'} ${grabbing ? 'is-grabbing' : ''} ${hoveredId ? 'is-dimming' : ''}`}
      >
        <div className="wall__viewport">
          {WORLD_COPIES.flatMap((cy) => WORLD_COPIES.map((cx) => `${cx}:${cy}`)).map((key, index) => (
            <div
              key={key}
              ref={(el) => { worldRefs.current[index] = el }}
              className="wall__world"
              style={{ width: layout.tileW, height: layout.tileH }}
            >
              {layout.placed.map((cell) => (
                <div
                  key={`${key}-${cell.item.id}`}
                  className={`wall__tile ${hoveredId === cell.item.id ? 'is-hovered' : ''}`}
                  style={{ left: cell.x, top: cell.y, width: cell.width, height: cell.height }}
                >
                  <PublicacionTile
                    item={cell.item}
                    variant={cell.variant}
                    polaroid={cell.polaroid}
                    isLight={isLight}
                    reducedMotion={reducedMotionRef.current}
                    onActivate={activateItem}
                    onHoverChange={onHoverChange}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <p ref={hintRef} className={`wall__hint ${t.muted}`}>
          <span aria-hidden="true">✋</span>
          Arrastra para explorar
        </p>
      </div>

      {tooltip ? (
        <div
          ref={tooltipRef}
          className={`wall__tooltip rounded-md ${t.card} ${t.body}`}
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          {tooltip.text}
        </div>
      ) : null}

      {modalItem ? (
        <PublicacionModal
          item={modalItem}
          theme={theme}
          reducedMotion={reducedMotionRef.current}
          onClose={() => setModalItem(null)}
        />
      ) : null}
    </>
  )
}
