import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

let registrado = false

export function setupGsap() {
  if (registrado) return
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)
  gsap.defaults({ ease: 'power3.out', duration: 0.8 })
  ScrollTrigger.defaults({ scroller: '#scroll-root' })
  ScrollTrigger.config({ ignoreMobileResize: true })
  registrado = true
}

setupGsap()

export const getScroller = () =>
  document.querySelector('#scroll-root') || document.querySelector('.overflow-y-auto')
