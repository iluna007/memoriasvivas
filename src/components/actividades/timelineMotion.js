import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getScroller } from '../../utils/gsapSetup'

export function menosMovimiento() {
  return false
}

function desplazamiento(nodo, desktop) {
  const distancia = desktop ? 120 : 64
  return nodo.dataset.lado === 'der' ? distancia : -distancia
}

export function animarEntrada(batch, desktop = window.matchMedia('(min-width: 768px)').matches) {
  const lista = [...batch].filter((nodo) => nodo.isConnected && nodo.dataset.revelado !== '1')
  lista.forEach((nodo, i) => {
    nodo.dataset.revelado = '1'
    const tarjeta = nodo.querySelector('[data-tarjeta]')
    const punto = nodo.querySelector('[data-punto]')
    const pulso = nodo.querySelector('[data-pulso]')
    const bits = nodo.querySelectorAll('[data-revelar]')
    if (tarjeta) gsap.set(tarjeta, { x: desplazamiento(nodo, desktop) })
    const tl = gsap.timeline({ delay: i * 0.08 })
    if (tarjeta) {
      tl.to(tarjeta, {
        autoAlpha: 1,
        x: 0,
        duration: 0.95,
        ease: 'power3.out',
        onStart() { tarjeta.style.willChange = 'transform' },
        onComplete() { tarjeta.style.willChange = 'auto' },
      }, 0)
    }
    if (punto) tl.to(punto, { scale: 1, duration: 0.55, ease: 'back.out(2.4)' }, 0)
    if (pulso) tl.to(pulso, { scale: 2.4, autoAlpha: 0, duration: 0.7, ease: 'power2.out' }, 0.05)
    if (bits.length) tl.to(bits, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.55 }, 0.12)
  })
}

function mostrarYa(nodo) {
  nodo.dataset.revelado = '1'
  const tarjeta = nodo.querySelector('[data-tarjeta]')
  const punto = nodo.querySelector('[data-punto]')
  const pulso = nodo.querySelector('[data-pulso]')
  const bits = nodo.querySelectorAll('[data-revelar]')
  if (tarjeta) gsap.set(tarjeta, { autoAlpha: 1, x: 0, y: 0 })
  if (punto) gsap.set(punto, { scale: 1 })
  if (pulso) gsap.set(pulso, { autoAlpha: 0 })
  if (bits.length) gsap.set(bits, { autoAlpha: 1, y: 0 })
  const anio = nodo.closest('section')?.querySelector('[data-anio]')
  if (anio) {
    anio.dataset.listo = '1'
    gsap.set(anio, { yPercent: 0 })
  }
}

export function prepararEstados(root, desktop) {
  root.querySelectorAll('[data-nodo]').forEach((nodo) => {
    if (nodo.dataset.revelado === '1') return
    const tarjeta = nodo.querySelector('[data-tarjeta]')
    if (tarjeta) gsap.set(tarjeta, { autoAlpha: 0, x: desplazamiento(nodo, desktop) })
    const punto = nodo.querySelector('[data-punto]')
    const pulso = nodo.querySelector('[data-pulso]')
    if (punto) gsap.set(punto, { scale: 0, transformOrigin: '50% 50%' })
    if (pulso) gsap.set(pulso, { scale: 1, autoAlpha: 0.45, transformOrigin: '50% 50%' })
    gsap.set(nodo.querySelectorAll('[data-revelar]'), { autoAlpha: 0, y: 16 })
  })
  root.querySelectorAll('[data-nodo][data-revelado="1"]').forEach((nodo) => mostrarYa(nodo))
  root.querySelectorAll('[data-anio]').forEach((anio) => {
    if (anio.dataset.listo === '1') gsap.set(anio, { yPercent: 0 })
    else gsap.set(anio, { yPercent: 100 })
  })
}

export function soltarReduce(root) {
  gsap.set(root.querySelectorAll('[data-tarjeta], [data-revelar], [data-punto], [data-anio], [data-linea]'), { clearProps: 'all' })
  gsap.set(root.querySelectorAll('[data-pulso], [data-cursor]'), { autoAlpha: 0 })
  root.querySelectorAll('[data-nodo]').forEach((nodo) => { nodo.dataset.revelado = '1' })
  root.querySelectorAll('[data-anio]').forEach((anio) => { anio.dataset.listo = '1' })
}

export function scrollAAncla() {
  const id = decodeURIComponent(window.location.hash || '')
  if (!id.startsWith('#actividad-')) return false
  const destino = document.getElementById(id.slice(1))
  const scroller = getScroller()
  if (!destino || !scroller) return false
  const ir = () => {
    const barra = document.querySelector('[data-filtros]')
    const margen = (barra?.offsetHeight ?? 0) + 16
    const top = destino.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - margen
    scroller.scrollTop = Math.max(0, top)
  }
  ir()
  requestAnimationFrame(ir)
  return true
}

export function aplicarAncla(root) {
  const id = decodeURIComponent(window.location.hash || '')
  if (!id.startsWith('#actividad-')) return false
  const destino = root.querySelector(id)
  if (!destino) return false
  const nodos = [...root.querySelectorAll('[data-nodo]')]
  const idx = nodos.indexOf(destino)
  if (idx < 0) return false
  nodos.slice(0, idx + 1).forEach((nodo) => {
    if (nodo.hidden) return
    mostrarYa(nodo)
  })
  scrollAAncla()
  return true
}

export function montarLinea(root) {
  const linea = root.querySelector('[data-linea]')
  const trazo = linea?.querySelector('[data-trazo]')
  const cursor = root.querySelector('[data-cursor]')
  if (trazo) {
    const medir = () => {
      trazo.setAttribute('y2', String(root.offsetHeight || 0))
    }
    medir()
    gsap.fromTo(trazo, { strokeDashoffset: 0 }, {
      strokeDashoffset: () => -Math.max(180, (root.offsetHeight || 0) * 0.42),
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        scroller: getScroller(),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
        onRefreshInit: medir,
      },
    })
  }
  if (cursor) {
    gsap.set(cursor, { xPercent: -50, y: 0 })
    gsap.to(cursor, {
      y: () => Math.max(0, root.offsetHeight - 8),
      xPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        scroller: getScroller(),
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: 0.6,
      },
    })
  }
  root.querySelectorAll('[data-anio]').forEach((anio) => {
    if (anio.dataset.listo === '1') {
      gsap.set(anio, { yPercent: 0 })
      return
    }
    gsap.to(anio, {
      yPercent: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: anio.parentElement || anio,
        scroller: getScroller(),
        start: 'top 85%',
        once: true,
        onEnter: () => { anio.dataset.listo = '1' },
      },
    })
  })
  root.querySelectorAll('[data-deriva]').forEach((nodo) => { delete nodo.dataset.deriva })
  derivaTarjetas(root)
}

export function derivaTarjetas(root) {
  const scroller = getScroller()
  root.querySelectorAll('[data-nodo]:not([hidden])').forEach((nodo) => {
    if (nodo.dataset.deriva === '1') return
    const tarjeta = nodo.querySelector('[data-tarjeta]')
    if (!tarjeta) return
    nodo.dataset.deriva = '1'
    gsap.fromTo(tarjeta, { y: 16 }, {
      y: -16,
      ease: 'none',
      scrollTrigger: {
        trigger: nodo,
        scroller,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  })
}

export function engancharNodos(root, bucket) {
  if (!bucket) return
  derivaTarjetas(root)
  const frescos = [...root.querySelectorAll('[data-nodo]:not([hidden])')].filter(
    (nodo) => nodo.dataset.revelado !== '1' && nodo.dataset.enganchado !== '1'
  )
  if (!frescos.length) return
  frescos.forEach((nodo) => { nodo.dataset.enganchado = '1' })
  bucket.add(() => {
    ScrollTrigger.batch(frescos, {
      scroller: getScroller(),
      start: 'top 85%',
      once: true,
      onEnter: (batch) => bucket.add(() => animarEntrada(batch)),
    })
  })
}

export function limpiarEnganches(root) {
  root.querySelectorAll('[data-nodo]').forEach((nodo) => {
    if (nodo.dataset.revelado === '1') return
    delete nodo.dataset.enganchado
  })
}
