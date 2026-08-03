import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { getContentPageTheme } from '../../utils/pageThemeClasses'

const LOOP_COPIES = 3
const ROW_HEIGHT_PX = 104

function buildLoopItems(items) {
  const loop = []
  for (let copy = 0; copy < LOOP_COPIES; copy += 1) {
    items.forEach((item, sourceIndex) => {
      loop.push({
        ...item,
        loopKey: `${item.id}-copy-${copy}`,
        sourceIndex,
      })
    })
  }
  return loop
}

/**
 * Listado tipo rueda: ventana fija, track infinito con transform.
 * La rueda solo captura el wheel cuando el puntero está sobre su zona.
 */
export default function WorksListView({ items, theme = 'dark' }) {
  const t = getContentPageTheme(theme)
  const loopItems = useMemo(() => buildLoopItems(items), [items])
  const oneSetHeight = items.length * ROW_HEIGHT_PX

  const rootRef = useRef(null)
  const wheelZoneRef = useRef(null)
  const windowRef = useRef(null)
  const trackRef = useRef(null)
  const previewRef = useRef(null)
  const previewImgRef = useRef(null)
  const indexRef = useRef(null)
  const rowRefs = useRef([])
  const titleRefs = useRef([])

  const wheelOffsetRef = useRef(oneSetHeight)
  const hoverLoopIndexRef = useRef(-1)
  const activeIndexRef = useRef(0)
  const reducedMotionRef = useRef(false)
  const trackQuickToRef = useRef(null)

  const [activeIndex, setActiveIndex] = useState(0)

  const normalizeWheelOffset = useCallback(() => {
    const oneSet = oneSetHeight
    if (!oneSet) return
    let offset = wheelOffsetRef.current

    while (offset < oneSet * 0.5) offset += oneSet
    while (offset > oneSet * 2.5) offset -= oneSet

    if (offset !== wheelOffsetRef.current) {
      wheelOffsetRef.current = offset
      gsap.set(trackRef.current, { y: -offset })
    }
  }, [oneSetHeight])

  const getFocusedLoopIndex = useCallback(() => {
    const viewH = windowRef.current?.clientHeight ?? 0
    const center = wheelOffsetRef.current + viewH / 2
    return Math.max(0, Math.min(loopItems.length - 1, Math.round(center / ROW_HEIGHT_PX - 0.5)))
  }, [loopItems.length])

  const animateIndex = useCallback((index) => {
    const el = indexRef.current
    if (!el) return
    const label = `[${String(Math.max(0, index)).padStart(2, '0')}]`
    el.textContent = label
    if (reducedMotionRef.current) return
    gsap.fromTo(
      el,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' },
    )
  }, [])

  const setPreviewImage = useCallback((index) => {
    const preview = previewRef.current
    const img = previewImgRef.current
    const item = items[index]
    if (!preview || !img || !item) return
    if (img.dataset.currentId === item.id) return

    const applyImage = () => {
      img.src = item.image
      img.alt = item.title
      img.dataset.currentId = item.id
      if (reducedMotionRef.current) {
        gsap.set(img, { opacity: 1, scale: 1 })
        return
      }
      gsap.fromTo(
        img,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' },
      )
    }

    if (!img.dataset.currentId || reducedMotionRef.current) {
      applyImage()
      return
    }

    gsap.to(img, {
      opacity: 0,
      scale: 0.98,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: applyImage,
    })
  }, [items])

  const setRowOpacities = useCallback((highlightLoopIndex) => {
    rowRefs.current.forEach((row, i) => {
      if (!row) return
      const opacity = highlightLoopIndex < 0 ? 1 : i === highlightLoopIndex ? 1 : 0.22
      gsap.to(row, {
        opacity,
        duration: reducedMotionRef.current ? 0.01 : 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })
  }, [])

  const nudgeTitle = useCallback((loopIndex, entering) => {
    const titleEl = titleRefs.current[loopIndex]
    if (!titleEl || reducedMotionRef.current) return
    gsap.to(titleEl, {
      x: entering ? 14 : 0,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }, [])

  const applyTrackPosition = useCallback((animate = true) => {
    const y = -wheelOffsetRef.current
    if (!trackRef.current) return
    if (!animate || reducedMotionRef.current) {
      gsap.set(trackRef.current, { y })
      return
    }
    trackQuickToRef.current?.(y)
  }, [])

  const syncActiveFromWheel = useCallback(() => {
    const loopIndex = getFocusedLoopIndex()
    const item = loopItems[loopIndex]
    if (!item) return

    activeIndexRef.current = item.sourceIndex
    setActiveIndex(item.sourceIndex)
    animateIndex(item.sourceIndex)
    setPreviewImage(item.sourceIndex)

    if (hoverLoopIndexRef.current < 0) {
      setRowOpacities(loopIndex)
    }
  }, [animateIndex, getFocusedLoopIndex, loopItems, setPreviewImage, setRowOpacities])

  const handleRowEnter = useCallback((sourceIndex, loopIndex) => {
    hoverLoopIndexRef.current = loopIndex
    activeIndexRef.current = sourceIndex
    setActiveIndex(sourceIndex)
    animateIndex(sourceIndex)
    setRowOpacities(loopIndex)
    nudgeTitle(loopIndex, true)
    setPreviewImage(sourceIndex)
  }, [animateIndex, nudgeTitle, setPreviewImage, setRowOpacities])

  const handleRowLeave = useCallback((loopIndex) => {
    nudgeTitle(loopIndex, false)
  }, [nudgeTitle])

  const handleWheelZoneLeave = useCallback(() => {
    hoverLoopIndexRef.current = -1
    syncActiveFromWheel()
  }, [syncActiveFromWheel])

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, loopItems.length)
    titleRefs.current = titleRefs.current.slice(0, loopItems.length)
  }, [loopItems.length])

  useEffect(() => {
    wheelOffsetRef.current = oneSetHeight
    gsap.set(trackRef.current, { y: -oneSetHeight })

    trackQuickToRef.current = gsap.quickTo(trackRef.current, 'y', {
      duration: reducedMotionRef.current ? 0.01 : 0.55,
      ease: 'power3.out',
      onComplete: syncActiveFromWheel,
    })

    setPreviewImage(0)
    animateIndex(0)
    syncActiveFromWheel()

    const zone = wheelZoneRef.current
    if (!zone) return undefined

    const onWheel = (event) => {
      event.preventDefault()
      event.stopPropagation()

      wheelOffsetRef.current += event.deltaY
      normalizeWheelOffset()
      applyTrackPosition(true)
      syncActiveFromWheel()
    }

    zone.addEventListener('wheel', onWheel, { passive: false })

    const ro = new ResizeObserver(() => {
      syncActiveFromWheel()
    })
    if (windowRef.current) ro.observe(windowRef.current)

    return () => {
      zone.removeEventListener('wheel', onWheel)
      ro.disconnect()
    }
  }, [
    animateIndex,
    applyTrackPosition,
    normalizeWheelOffset,
    oneSetHeight,
    setPreviewImage,
    syncActiveFromWheel,
  ])

  const isLight = theme === 'light'
  const previewItem = items[activeIndex] ?? items[0]

  return (
    <section ref={rootRef} className="works-list">
      <div className="works-list__layout lg:grid lg:grid-cols-[minmax(0,1fr)_min(42vw,480px)]">
        <div className="works-list__main min-w-0 px-6 sm:px-10 lg:px-10 xl:px-14">
          <div
            ref={wheelZoneRef}
            className={`works-list__wheel-zone relative h-full ${
              isLight ? 'works-list__wheel-zone--light' : 'works-list__wheel-zone--dark'
            }`}
            onMouseLeave={handleWheelZoneLeave}
          >
            <div className="works-list__wheel-frame h-full">
              <div ref={windowRef} className="works-list__wheel-window overflow-hidden">
                <div ref={trackRef} className="works-list__track will-change-transform">
                  <ul className="works-list__rows m-0 list-none p-0">
                  {loopItems.map((item, loopIndex) => {
                    const copy = Math.floor(loopIndex / items.length)
                    return (
                      <li
                        key={item.loopKey}
                        data-loop-copy={copy}
                        className="works-list__row-wrap"
                        style={{ height: ROW_HEIGHT_PX }}
                      >
                        <a
                          ref={(el) => { rowRefs.current[loopIndex] = el }}
                          href={item.url ?? `#${item.id}`}
                          target={item.url ? '_blank' : undefined}
                          rel={item.url ? 'noopener noreferrer' : undefined}
                          className={`works-list__row group flex h-full items-center px-6 sm:px-10 lg:px-10 xl:px-14 ${
                            isLight ? 'text-zinc-900' : 'text-white'
                          }`}
                          onMouseEnter={() => handleRowEnter(item.sourceIndex, loopIndex)}
                          onMouseLeave={() => handleRowLeave(loopIndex)}
                          onFocus={() => handleRowEnter(item.sourceIndex, loopIndex)}
                          onBlur={() => handleRowLeave(loopIndex)}
                        >
                          <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                            <span
                              ref={(el) => { titleRefs.current[loopIndex] = el }}
                              className="works-list__item-title block will-change-transform"
                            >
                              {item.title}
                              <span className={`works-list__sep ${t.muted}`}> — </span>
                              <span className={`works-list__category ${t.muted}`}>{item.category}</span>
                            </span>
                            <span className={`works-list__year shrink-0 text-xs uppercase tracking-[0.2em] ${t.muted}`}>
                              {item.year}
                            </span>
                          </div>
                        </a>
                      </li>
                    )
                  })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside
          className={`works-list__aside hidden lg:flex lg:flex-col ${
            isLight ? 'works-list__wheel-zone--light' : 'works-list__wheel-zone--dark'
          }`}
        >
          <div className="works-list__preview-panel works-list__wheel-frame h-full">
            <div
              ref={indexRef}
              className={`works-list__index shrink-0 font-mono text-sm tabular-nums sm:text-base ${
                isLight ? 'text-zinc-900' : 'text-white'
              }`}
              aria-live="polite"
            >
              [00]
            </div>

            <div ref={previewRef} className="works-list__preview min-h-0 flex-1 overflow-hidden">
              <img
                ref={previewImgRef}
                alt={previewItem?.title ?? ''}
                className="works-list__preview-img h-full w-full object-cover"
                draggable={false}
              />
            </div>

            <p className={`works-list__preview-meta shrink-0 text-xs uppercase tracking-[0.18em] ${t.muted}`}>
              {previewItem?.category}
              {previewItem?.year ? ` · ${previewItem.year}` : ''}
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
