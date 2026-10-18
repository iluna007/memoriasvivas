import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'
import {
  ACTIVIDADES_RAICES,
  FACETAS_ACTIVIDADES,
  agruparRaicesPorAnio,
  raizCoincide,
} from '../../data/actividadesCms'
import { anchosEscala, fullUrl, mismasEscalas, thumbUrl } from '../../utils/mediaUrl'
import { getScroller } from '../../utils/gsapSetup'
import { getContentPageTheme } from '../../utils/pageThemeClasses'
import MapaSintesis from './MapaSintesis'
import {
  aplicarAncla,
  engancharNodos,
  limpiarEnganches,
  menosMovimiento,
  montarLinea,
  prepararEstados,
  scrollAAncla,
  soltarReduce,
} from './timelineMotion'

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

const GRUPOS = agruparRaicesPorAnio(ACTIVIDADES_RAICES)

function parseFecha(iso) {
  const m = String(iso ?? '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) }
}

function formatRango(inicio, fin) {
  const a = parseFecha(inicio)
  if (!a) return inicio || ''
  const una = `${a.d} de ${MESES[a.m - 1]} de ${a.y}`
  const b = parseFecha(fin)
  if (!b || inicio === fin) return una
  if (a.y === b.y && a.m === b.m) return `${a.d} a ${b.d} de ${MESES[a.m - 1]} de ${a.y}`
  if (a.y === b.y) return `${a.d} de ${MESES[a.m - 1]} a ${b.d} de ${MESES[b.m - 1]} de ${a.y}`
  return `${una} a ${b.d} de ${MESES[b.m - 1]} de ${b.y}`
}

function resumenMedios(conteo) {
  const partes = []
  if (conteo.fotos) partes.push(`${conteo.fotos} ${conteo.fotos === 1 ? 'foto' : 'fotos'}`)
  if (conteo.videos) partes.push(`${conteo.videos} ${conteo.videos === 1 ? 'video' : 'videos'}`)
  if (conteo.pdfs) partes.push(conteo.pdfs === 1 ? '1 PDF' : `${conteo.pdfs} PDFs`)
  return partes.join(', ')
}

function altDe(medio, titulo) {
  return medio.pie || titulo || 'Fotografía de la actividad'
}

function tieneDetalle(nodo) {
  return Boolean(
    nodo.descripcion ||
    nodo.personas.length ||
    nodo.hijos.length ||
    nodo.medios.length ||
    nodo.relato
  )
}

const NODOS_POR_ID = new Map(ACTIVIDADES_RAICES.map((nodo) => [nodo.id, nodo]))

function raizScroll() {
  return getScroller()
}

function useEnVista(activo = true) {
  const ref = useRef(null)
  const [visto, setVisto] = useState(false)

  useEffect(() => {
    if (!activo || visto) return undefined
    const el = ref.current
    if (!el) return undefined
    const caja = raizScroll()?.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const tope = (caja?.top ?? 0) - 400
    const fondo = (caja?.bottom ?? window.innerHeight) + 400
    if (rect.height > 0 && rect.top < fondo && rect.bottom > tope) {
      setVisto(true)
    }
  }, [activo, visto])

  useEffect(() => {
    if (!activo || visto) return undefined
    const el = ref.current
    if (!el) return undefined
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisto(true)
        obs.disconnect()
      },
      { threshold: 0.01, root: raizScroll(), rootMargin: '400px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [activo, visto])

  return [ref, visto]
}

function bloquearScroll() {
  const main = document.querySelector('main')
  const nodos = [document.documentElement]
  const scroller = getScroller()
  if (scroller) nodos.push(scroller)
  else if (main?.parentElement) nodos.push(main.parentElement)
  const previos = nodos.map((n) => n.style.overflow)
  nodos.forEach((n) => {
    n.style.overflow = 'hidden'
  })
  return () => {
    nodos.forEach((n, i) => {
      n.style.overflow = previos[i]
    })
  }
}

const SIZES = {
  cover: '(min-width: 768px) 540px, calc(100vw - 4.5rem)',
  galeria: '(min-width: 640px) 180px, 46vw',
}

function srcSetMiniatura(medio) {
  if (!mismasEscalas()) return undefined
  const mini = thumbUrl(medio.archivoMiniatura)
  const grande = fullUrl(medio.archivoWeb)
  if (!mini || !grande || mini === grande) return undefined
  const { thumb, full } = anchosEscala()
  return `${mini} ${thumb}w, ${grande} ${full}w`
}

function MarcoFoto({ medio, alt, className, imgClass, cargar, variante = 'thumb', prioridad = false, tamanos, forma, onClick, parallax = false }) {
  const marcoRef = useRef(null)
  const [error, setError] = useState(false)
  const grande = fullUrl(medio.archivoWeb)
  const mini = thumbUrl(medio.archivoMiniatura || medio.archivoWeb)
  const src = variante === 'full' ? grande : mini || grande
  const listo = Boolean(cargar && !error && src)
  const srcSet = variante === 'thumb' ? srcSetMiniatura(medio) : undefined
  const estilo = forma ? { aspectRatio: forma } : undefined
  const caja = 'bg-zinc-500/10'
  const cuerpo = listo ? (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? tamanos : undefined}
      alt={alt}
      width={medio.ancho || undefined}
      height={medio.alto || undefined}
      loading={prioridad ? 'eager' : 'lazy'}
      fetchpriority={prioridad ? 'high' : 'auto'}
      decoding="async"
      onError={() => setError(true)}
      data-parallax={parallax ? '' : undefined}
      className={imgClass}
    />
  ) : (
    <div role="img" aria-label={alt} className={`h-full w-full ${caja}`} />
  )

  useGSAP(() => {
    if (!parallax || !listo) return undefined
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const img = marcoRef.current?.querySelector('[data-parallax]')
      if (!img) return
      gsap.fromTo(img, { yPercent: -6, scale: 1.12, transformOrigin: 'center center' }, {
        yPercent: 6,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: marcoRef.current,
          scroller: getScroller(),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onToggle(self) {
            img.style.willChange = self.isActive ? 'transform' : 'auto'
          },
        },
      })
    })
    return undefined
  }, { scope: marcoRef, dependencies: [parallax, listo], revertOnUpdate: true })

  if (!onClick) {
    return <div ref={marcoRef} className={className} style={estilo}>{cuerpo}</div>
  }

  return (
    <button
      ref={marcoRef}
      type="button"
      onClick={onClick}
      style={estilo}
      className={`${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current`}
    >
      {cuerpo}
    </button>
  )
}

function Lightbox({ fotos, index, titulo, onIndex, onClose, isLight }) {
  const ref = useRef(null)
  const cerrando = useRef(false)
  const foto = fotos[index]
  const alt = altDe(foto, titulo)
  const [capas, setCapas] = useState(() => [foto])

  if (capas[capas.length - 1]?.id !== foto.id) {
    setCapas((lista) => [...lista.slice(-1), foto].slice(-2))
  }

  useEffect(() => {
    const antes = document.activeElement
    const soltar = bloquearScroll()
    ref.current?.focus()
    return () => {
      soltar()
      if (antes instanceof HTMLElement) antes.focus()
    }
  }, [])

  useEffect(() => {
    const precargar = []
    for (const vecino of [fotos[index - 1], fotos[index + 1]]) {
      const src = fullUrl(vecino?.archivoWeb)
      if (!src) continue
      const img = new Image()
      img.decoding = 'async'
      img.src = src
      precargar.push(img)
    }
    return () => {
      precargar.forEach((img) => {
        img.src = ''
      })
    }
  }, [fotos, index])

  const { contextSafe } = useGSAP(() => {
    const d = menosMovimiento() ? 0.01 : 0.25
    gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: d })
    gsap.fromTo('[data-lightbox-foto]', { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: d })
  }, { scope: ref })

  useGSAP(() => {
    const nodes = ref.current?.querySelectorAll('[data-capa]')
    if (!nodes || nodes.length < 2) return undefined
    const d = menosMovimiento() ? 0.01 : 0.3
    gsap.fromTo(nodes[1], { autoAlpha: 0 }, { autoAlpha: 1, duration: d, overwrite: 'auto' })
    gsap.to(nodes[0], {
      autoAlpha: 0,
      duration: d,
      overwrite: 'auto',
      onComplete: () => setCapas((lista) => (lista.length > 1 ? lista.slice(-1) : lista)),
    })
    return undefined
  }, { scope: ref, dependencies: [foto.id, capas.length] })

  const cerrar = contextSafe(() => {
    if (cerrando.current) return
    cerrando.current = true
    const d = menosMovimiento() ? 0.01 : 0.25
    const fotoCaja = ref.current?.querySelector('[data-lightbox-foto]')
    gsap.to(ref.current, { autoAlpha: 0, duration: d, overwrite: 'auto' })
    gsap.to(fotoCaja, {
      autoAlpha: 0,
      scale: 0.96,
      duration: d,
      overwrite: 'auto',
      onComplete: onClose,
    })
  })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'ArrowRight' && fotos.length > 1) {
        e.preventDefault()
        onIndex((index + 1) % fotos.length)
      }
      if (e.key === 'ArrowLeft' && fotos.length > 1) {
        e.preventDefault()
        onIndex((index - 1 + fotos.length) % fotos.length)
      }
      if (e.key === 'Tab' && ref.current) {
        const items = [...ref.current.querySelectorAll('button')]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cerrar, fotos.length, index, onIndex])

  const btn = isLight
    ? 'bg-white text-zinc-900 hover:bg-zinc-100'
    : 'bg-white/15 text-white hover:bg-white/25'

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      tabIndex={-1}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 outline-none backdrop-blur-sm"
    >
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Cerrar" onClick={cerrar} />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col items-center">
        <div className="mb-3 flex w-full items-center justify-between gap-3 text-white">
          <p className="text-sm tabular-nums">
            {index + 1} de {fotos.length}
          </p>
          <button
            type="button"
            onClick={cerrar}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${btn}`}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="flex w-full items-center gap-2 sm:gap-4">
          {fotos.length > 1 && (
            <button
              type="button"
              onClick={() => onIndex((index - 1 + fotos.length) % fotos.length)}
              className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex ${btn}`}
              aria-label="Foto anterior"
            >
              ‹
            </button>
          )}
          <div data-lightbox-foto className="relative min-h-40 w-full">
            {capas.map((capa, i) => (
              <div
                key={capa.id}
                data-capa
                className={i === capas.length - 1 ? 'relative' : 'pointer-events-none absolute inset-0'}
              >
                <MarcoFoto
                  medio={capa}
                  alt={altDe(capa, titulo)}
                  cargar
                  variante="full"
                  prioridad
                  className="mx-auto flex max-h-[75vh] min-h-40 w-full items-center justify-center bg-zinc-500/10"
                  imgClass="max-h-[75vh] w-auto max-w-full object-contain"
                />
              </div>
            ))}
          </div>
          {fotos.length > 1 && (
            <button
              type="button"
              onClick={() => onIndex((index + 1) % fotos.length)}
              className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex ${btn}`}
              aria-label="Foto siguiente"
            >
              ›
            </button>
          )}
        </div>
        {fotos.length > 1 && (
          <div className="mt-3 flex gap-3 sm:hidden">
            <button type="button" className={`rounded-full px-4 py-2 text-sm ${btn}`} onClick={() => onIndex((index - 1 + fotos.length) % fotos.length)}>
              Anterior
            </button>
            <button type="button" className={`rounded-full px-4 py-2 text-sm ${btn}`} onClick={() => onIndex((index + 1) % fotos.length)}>
              Siguiente
            </button>
          </div>
        )}
        {(foto.pie || foto.credito) && (
          <p className="mt-3 max-w-3xl text-center text-sm leading-relaxed text-white/85">
            {foto.pie}
            {foto.pie && foto.credito ? ' ' : null}
            {foto.credito ? <span className="text-white/60">({foto.credito})</span> : null}
          </p>
        )}
      </div>
    </div>
  )
}

function Galeria({ nodo, onOpen, isLight, t }) {
  const fotos = nodo.medios.filter((m) => m.tipo === 'foto')
  const videos = nodo.medios.filter((m) => m.tipo === 'video')
  const pdfs = nodo.medios.filter((m) => m.tipo === 'pdf')
  const otros = nodo.medios.filter((m) => !['foto', 'video', 'pdf'].includes(m.tipo))
  const [limite, setLimite] = useState(12)
  const visibles = fotos.slice(0, limite)
  const link = isLight ? 'text-zinc-900 underline hover:text-zinc-700' : 'text-white underline hover:text-white/80'

  if (!nodo.medios.length) return null

  return (
    <div className="mt-4 space-y-4">
      {fotos.length > 0 && (
        <div>
          <p className={`mb-2 text-[11px] font-semibold uppercase tracking-wide ${t.muted}`}>Fotos</p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {visibles.map((medio, i) => (
              <li key={medio.id} data-miniatura>
                <MarcoFoto
                  medio={medio}
                  alt={altDe(medio, nodo.titulo)}
                  cargar
                  tamanos={SIZES.galeria}
                  onClick={() => onOpen(fotos, i, nodo.titulo)}
                  className="block aspect-square w-full overflow-hidden rounded-lg bg-zinc-500/10"
                  imgClass="h-full w-full object-cover"
                />
              </li>
            ))}
          </ul>
          {fotos.length > limite && (
            <button
              type="button"
              onClick={() => setLimite((n) => n + 24)}
              className={`mt-3 rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${t.btnOutline}`}
            >
              Ver {Math.min(24, fotos.length - limite)} fotos más
            </button>
          )}
        </div>
      )}

      {videos.length > 0 && (
        <div>
          <p className={`mb-2 text-[11px] font-semibold uppercase tracking-wide ${t.muted}`}>Videos</p>
          <ul className="space-y-3">
            {videos.map((medio) => (
              <li key={medio.id}>
                <video
                  controls
                  preload="none"
                  poster={thumbUrl(medio.archivoMiniatura) || undefined}
                  width={medio.ancho || undefined}
                  height={medio.alto || undefined}
                  className="aspect-video w-full rounded-lg bg-black"
                >
                  <source src={fullUrl(medio.archivoWeb)} />
                </video>
                <a href={fullUrl(medio.archivoWeb)} className={`mt-1 inline-block text-xs ${link}`} target="_blank" rel="noopener noreferrer">
                  {medio.pie || 'Abrir video'}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(pdfs.length > 0 || otros.length > 0) && (
        <ul className="space-y-1 text-sm">
          {[...pdfs, ...otros].map((medio) => (
            <li key={medio.id}>
              <a href={fullUrl(medio.archivoWeb)} className={link} target="_blank" rel="noopener noreferrer">
                {medio.pie || (medio.tipo === 'pdf' ? 'Abrir PDF' : 'Abrir archivo')}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PanelAnimado({ id, abierto, children }) {
  const ref = useRef(null)
  const galeria = useRef(false)
  const [plegado, setPlegado] = useState(false)

  if (abierto && plegado) setPlegado(false)

  useGSAP(() => {
    const panel = ref.current
    if (!panel) return undefined
    const d = menosMovimiento() ? 0.01 : 0.5
    if (abierto) {
      panel.hidden = false
      panel.inert = false
      gsap.fromTo(panel, { height: 0, autoAlpha: 0 }, {
        height: 'auto',
        autoAlpha: 1,
        duration: d,
        overwrite: true,
        onComplete: () => {
          gsap.set(panel, { clearProps: 'height' })
          if (!galeria.current) {
            galeria.current = true
            const thumbs = panel.querySelectorAll('[data-miniatura]')
            if (thumbs.length && d > 0.01) {
              gsap.fromTo(thumbs, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.4 })
            }
          }
          ScrollTrigger.refresh()
        },
      })
    } else {
      panel.inert = true
      gsap.to(panel, {
        height: 0,
        autoAlpha: 0,
        duration: d,
        overwrite: true,
        onComplete: () => {
          panel.hidden = true
          setPlegado(true)
          ScrollTrigger.refresh()
        },
      })
    }
    return undefined
  }, { scope: ref, dependencies: [abierto] })

  return (
    <div ref={ref} id={id} hidden={plegado} className="overflow-hidden">
      {children}
    </div>
  )
}

function Detalle({ nodo, onOpen, isLight, t, nivel }) {
  const panelId = useId()
  const [abierto, setAbierto] = useState(false)
  const [montado, setMontado] = useState(false)
  const Heading = nivel <= 2 ? 'h4' : nivel === 3 ? 'h5' : 'h6'
  const fecha = formatRango(nodo.fecha, nodo.fechaFin)

  return (
    <article className={`rounded-xl border px-3 py-3 ${isLight ? 'border-zinc-200' : 'border-white/10'}`}>
      <Heading className={`text-base font-semibold ${t.cardTitle}`}>{nodo.titulo}</Heading>
      {fecha && <p className={`mt-1 text-xs ${t.muted}`}>{fecha}</p>}
      {nodo.territorios.length > 0 && (
        <p className={`mt-1 text-xs ${t.cardSub}`}>{nodo.territorios.map((x) => x.nombre).join(', ')}</p>
      )}
      {tieneDetalle(nodo) && (
        <button
          type="button"
          className={`mt-2 text-sm underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${t.cardTitle}`}
          aria-expanded={abierto}
          aria-controls={panelId}
          onClick={() => {
            setMontado(true)
            setAbierto((v) => !v)
          }}
        >
          {abierto ? 'Ocultar detalle' : 'Ver detalle'}
        </button>
      )}
      {montado && (
        <PanelAnimado id={panelId} abierto={abierto}>
          <Cuerpo nodo={nodo} onOpen={onOpen} isLight={isLight} t={t} nivel={nivel + 1} />
        </PanelAnimado>
      )}
    </article>
  )
}

function Cuerpo({ nodo, onOpen, isLight, t, nivel }) {
  const link = isLight ? 'text-zinc-900 underline hover:text-zinc-700' : 'text-white underline decoration-white/40 hover:text-white/80'

  return (
    <div className="mt-3">
      {nodo.descripcion && <p className={`text-sm leading-relaxed ${t.cardBio}`}>{nodo.descripcion}</p>}
      {nodo.personas.length > 0 && (
        <p className={`mt-3 text-sm ${t.cardSub}`}>
          <span className="font-semibold">Personas: </span>
          {nodo.personas.map((p) => p.nombre).join(', ')}
        </p>
      )}
      {nodo.relato && (
        <p className="mt-3">
          <Link to={`/archivo#relato-${encodeURIComponent(nodo.relato.id)}`} className={`text-sm ${link}`}>
            Ver relato
          </Link>
        </p>
      )}
      {nodo.hijos.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${t.muted}`}>Subactividades</p>
          {nodo.hijos.map((hijo) => (
            <Detalle key={hijo.id} nodo={hijo} onOpen={onOpen} isLight={isLight} t={t} nivel={nivel} />
          ))}
        </div>
      )}
      <Galeria nodo={nodo} onOpen={onOpen} isLight={isLight} t={t} />
    </div>
  )
}

function proporcion(medio) {
  if (medio?.ancho && medio?.alto) return `${medio.ancho} / ${medio.alto}`
  return '16 / 10'
}

function NodoRaiz({ nodo, lado, visible, prioridad = false, onOpen, isLight, t }) {
  const [ref, visto] = useEnVista(visible)
  const panelId = useId()
  const [abierto, setAbierto] = useState(false)
  const [montado, setMontado] = useState(false)
  const fecha = formatRango(nodo.fecha, nodo.fechaFin)
  const lugares = nodo.territorios.map((x) => x.nombre).join(', ')
  const mediosTxt = resumenMedios(nodo.conteo)
  const detalle = tieneDetalle(nodo)
  const fotosPropias = nodo.medios.filter((m) => m.tipo === 'foto')

  const abrirPortada = () => {
    if (!nodo.portada || nodo.portada.tipo !== 'foto') return
    const index = fotosPropias.findIndex((m) => m.id === nodo.portada.id)
    if (index >= 0) onOpen(fotosPropias, index, nodo.titulo)
    else onOpen([nodo.portada], 0, nodo.titulo)
  }

  return (
    <article
      ref={ref}
      id={`actividad-${nodo.id}`}
      data-nodo
      data-lado={lado}
      hidden={!visible}
      className="relative scroll-mt-28 py-3 md:py-5"
    >
      <span aria-hidden className="absolute top-8 left-3 z-10 -translate-x-1/2 md:left-1/2">
        <span data-punto className="relative block h-3 w-3 rounded-full bg-current">
          <span data-pulso className="absolute inset-0 rounded-full bg-current" />
        </span>
      </span>
      <div data-tarjeta className={`pl-10 md:w-[calc(50%-1.75rem)] md:pl-0 ${lado === 'der' ? 'md:ml-[calc(50%+1.75rem)]' : 'md:mr-auto'}`}>
        <div className={`overflow-hidden rounded-2xl ${t.card}`}>
          {nodo.portada ? (
            <MarcoFoto
              medio={nodo.portada}
              alt={altDe(nodo.portada, nodo.titulo)}
              cargar={visto}
              prioridad={prioridad}
              parallax
              tamanos={SIZES.cover}
              forma={proporcion(nodo.portada)}
              onClick={abrirPortada}
              className="block w-full overflow-hidden bg-zinc-500/10"
              imgClass="h-full w-full object-cover"
            />
          ) : (
            <div className={`aspect-[16/10] w-full ${isLight ? 'bg-zinc-200' : 'bg-white/5'}`} role="img" aria-label={nodo.titulo} />
          )}
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {nodo.categoria && (
                <p data-revelar className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${t.muted}`}>{nodo.categoria}</p>
              )}
              {fecha && <p data-revelar className={`text-xs ${t.cardSub}`}>{fecha}</p>}
            </div>
            <h3 data-revelar className={`mt-1 text-xl font-semibold leading-snug ${t.cardTitle}`}>{nodo.titulo}</h3>
            {lugares && <p data-revelar className={`mt-1 text-sm ${t.cardSub}`}>{lugares}</p>}
            {mediosTxt && <p data-revelar className={`mt-2 text-xs ${t.cardHint}`}>{mediosTxt}</p>}
            {detalle && (
              <button
                data-revelar
                type="button"
                className={`mt-4 rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${t.btnOutline}`}
                aria-expanded={abierto}
                aria-controls={panelId}
                onClick={() => {
                  setMontado(true)
                  setAbierto((v) => !v)
                }}
              >
                {abierto ? 'Ocultar detalle' : 'Ver detalle'}
              </button>
            )}
            {montado && (
              <PanelAnimado id={panelId} abierto={abierto}>
                <Cuerpo nodo={nodo} onOpen={onOpen} isLight={isLight} t={t} nivel={2} />
              </PanelAnimado>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function Filtro({ label, value, onChange, children, isLight }) {
  return (
    <label className="flex min-w-[9rem] flex-1 flex-col gap-1 text-[10px] font-semibold uppercase tracking-wide sm:flex-none">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ colorScheme: isLight ? 'light' : 'dark' }}
        className={
          'rounded-lg border px-2 py-2 text-sm font-normal normal-case tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ' +
          (isLight
            ? 'scheme-light border-zinc-300 bg-white text-zinc-900 [&>option]:bg-white [&>option]:text-zinc-900'
            : 'scheme-dark border-white/20 bg-white/10 text-white [&>option]:bg-zinc-900 [&>option]:text-zinc-100')
        }
      >
        {children}
      </select>
    </label>
  )
}

export default function ActividadesTimeline({ theme = 'dark' }) {
  const isLight = theme === 'light'
  const t = getContentPageTheme(theme)
  const [anio, setAnio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [territorio, setTerritorio] = useState('')
  const [lightbox, setLightbox] = useState(null)
  const filtros = { anio, categoria, territorio }
  const facetas = FACETAS_ACTIVIDADES

  let visibles = 0
  for (const nodo of ACTIVIDADES_RAICES) {
    if (raizCoincide(nodo, filtros)) visibles += 1
  }

  const hayFiltro = Boolean(anio || categoria || territorio)
  const primeraId = ACTIVIDADES_RAICES.find((nodo) => raizCoincide(nodo, filtros))?.id
  const lineaRef = useRef(null)
  const animCtx = useRef(null)
  const pendienteFlip = useRef(null)
  const filtrosRef = useRef(filtros)
  const salidaRef = useRef(null)
  const genRef = useRef(0)
  const filtroListo = useRef(false)
  filtrosRef.current = filtros

  useGSAP(() => {
    const root = lineaRef.current
    if (!root) return undefined
    const mm = gsap.matchMedia()
    mm.add({
      desktop: '(min-width: 768px)',
      mobile: '(max-width: 767px)',
    }, (context) => {
      const { desktop } = context.conditions
      const bucket = gsap.context(() => {}, root)
      animCtx.current = bucket
      try {
        limpiarEnganches(root)
        aplicarAncla(root)
        prepararEstados(root, desktop)
        bucket.add(() => {
          montarLinea(root)
          engancharNodos(root, bucket)
          ScrollTrigger.refresh()
        })
      } catch {
        soltarReduce(root)
      }
      return () => {
        animCtx.current = null
        bucket.revert()
      }
    })
    return undefined
  }, { scope: lineaRef, dependencies: [isLight], revertOnUpdate: true })

  useGSAP(() => {
    const root = lineaRef.current
    if (!root) return undefined
    if (!filtroListo.current) {
      filtroListo.current = true
      return undefined
    }
    root.querySelectorAll('[data-nodo]:not([hidden])').forEach((nodo) => {
      if (nodo.dataset.revelado !== '1') return
      const tarjeta = nodo.querySelector('[data-tarjeta]')
      if (tarjeta) gsap.set(tarjeta, { autoAlpha: 1, x: 0, y: 0 })
    })
    const state = pendienteFlip.current
    pendienteFlip.current = null
    const seguir = () => {
      ScrollTrigger.refresh()
      engancharNodos(root, animCtx.current)
    }
    if (state) {
      Flip.from(state, {
        duration: menosMovimiento() ? 0.01 : 0.45,
        ease: 'power2.out',
        onComplete: seguir,
      })
    } else {
      seguir()
    }
    return undefined
  }, { scope: lineaRef, dependencies: [anio, categoria, territorio] })

  const cambiarFiltros = (parcial) => {
    const siguiente = { ...filtrosRef.current, ...parcial }
    filtrosRef.current = siguiente
    const token = ++genRef.current
    const root = lineaRef.current
    const salen = []
    if (root && !menosMovimiento()) {
      root.querySelectorAll('[data-nodo]:not([hidden])').forEach((el) => {
        const nodo = NODOS_POR_ID.get(el.id.replace(/^actividad-/, ''))
        if (nodo && !raizCoincide(nodo, siguiente)) {
          const tarjeta = el.querySelector('[data-tarjeta]')
          if (tarjeta) salen.push(tarjeta)
        }
      })
    }
    const commit = () => {
      if (token !== genRef.current) return
      if (root && !menosMovimiento()) {
        const quedan = []
        root.querySelectorAll('[data-nodo]:not([hidden])').forEach((el) => {
          const nodo = NODOS_POR_ID.get(el.id.replace(/^actividad-/, ''))
          if (!nodo || !raizCoincide(nodo, siguiente)) return
          const tarjeta = el.querySelector('[data-tarjeta]')
          if (tarjeta) quedan.push(tarjeta)
        })
        if (quedan.length) pendienteFlip.current = Flip.getState(quedan)
      }
      setAnio(siguiente.anio)
      setCategoria(siguiente.categoria)
      setTerritorio(siguiente.territorio)
    }
    salidaRef.current?.kill()
    if (salen.length) {
      salidaRef.current = gsap.to(salen, {
        autoAlpha: 0,
        y: -12,
        duration: 0.2,
        overwrite: 'auto',
        onComplete: commit,
      })
    } else {
      commit()
    }
  }

  return (
    <div>
      <div
        data-filtros
        className={
          'sticky top-14 z-30 -mx-6 mb-8 border-b px-6 py-3 backdrop-blur-md ' +
          (isLight ? 'border-zinc-200 bg-white/80' : 'border-white/10 bg-[#05080f]/75')
        }
      >
        <div className="flex flex-wrap items-end gap-3">
          <Filtro label="Año" value={anio} onChange={(valor) => cambiarFiltros({ anio: valor })} isLight={isLight}>
            <option value="">Todos</option>
            {facetas.anios.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </Filtro>
          <Filtro label="Categoría" value={categoria} onChange={(valor) => cambiarFiltros({ categoria: valor })} isLight={isLight}>
            <option value="">Todas</option>
            {facetas.categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Filtro>
          <Filtro label="Territorio" value={territorio} onChange={(valor) => cambiarFiltros({ territorio: valor })} isLight={isLight}>
            <option value="">Todos</option>
            {facetas.territorios.map((item) => (
              <option key={item.id} value={item.id}>{item.nombre}</option>
            ))}
          </Filtro>
          {hayFiltro && (
            <button
              type="button"
              onClick={() => cambiarFiltros({ anio: '', categoria: '', territorio: '' })}
              className={`mb-0.5 rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${t.btnOutline}`}
            >
              Quitar filtros
            </button>
          )}
        </div>
        <p className={`mt-2 text-xs ${t.muted}`} aria-live="polite">
          {visibles === 1 ? '1 actividad' : `${visibles} actividades`}
        </p>
      </div>

      {visibles === 0 && (
        <p className={`text-sm ${t.body}`}>Ninguna actividad coincide con estos filtros.</p>
      )}
      <div id="linea-tiempo" ref={lineaRef} className="relative" hidden={visibles === 0}>
          <div
            aria-hidden
            className={`pointer-events-none absolute bottom-0 top-0 left-3 -translate-x-1/2 border-l-2 border-dotted md:left-1/2 ${isLight ? 'border-zinc-400/80' : 'border-white/30'}`}
          />
          <svg
            data-linea
            aria-hidden
            className="pointer-events-none absolute bottom-0 top-0 left-3 h-full w-3 -translate-x-1/2 overflow-visible text-current md:left-1/2"
            preserveAspectRatio="none"
          >
            <line
              data-trazo
              x1="6"
              y1="0"
              x2="6"
              y2="100%"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1.5 16"
            />
          </svg>
          <div
            data-cursor
            aria-hidden
            className="pointer-events-none absolute top-0 left-3 z-10 h-0 w-0 md:left-1/2"
          >
            <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current opacity-30" />
            <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
          </div>
          {GRUPOS.map((grupo) => {
            const alguno = grupo.items.some((nodo) => raizCoincide(nodo, filtros))
            let ladoVisible = 0
            return (
              <section key={grupo.key} hidden={!alguno} aria-labelledby={`anio-${grupo.key}`}>
                <div className="relative py-8 md:py-10">
                  <div className="overflow-hidden">
                    <h2
                      id={`anio-${grupo.key}`}
                      data-anio
                      className="pl-10 text-4xl font-semibold tracking-tight md:pl-0 md:text-center md:text-6xl"
                    >
                      {grupo.etiqueta}
                    </h2>
                  </div>
                </div>
                {grupo.items.map((nodo) => {
                  const mostrar = raizCoincide(nodo, filtros)
                  const lado = ladoVisible % 2 === 0 ? 'izq' : 'der'
                  if (mostrar) ladoVisible += 1
                  return (
                    <NodoRaiz
                      key={nodo.id}
                      nodo={nodo}
                      lado={lado}
                      visible={mostrar}
                      prioridad={nodo.id === primeraId}
                      onOpen={(fotos, index, titulo) => setLightbox({ fotos, index, titulo })}
                      isLight={isLight}
                      t={t}
                    />
                  )
                })}
              </section>
            )
          })}
      </div>

      <MapaSintesis filtrosKey={`${anio}|${categoria}|${territorio}`} isLight={isLight} />

      {lightbox && (
        <Lightbox
          fotos={lightbox.fotos}
          index={lightbox.index}
          titulo={lightbox.titulo}
          isLight={isLight}
          onClose={() => setLightbox(null)}
          onIndex={(index) => setLightbox((prev) => (prev ? { ...prev, index } : prev))}
        />
      )}
    </div>
  )
}
