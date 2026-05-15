import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Billboard } from '@react-three/drei'
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  EdgesGeometry,
  AdditiveBlending,
  Color,
  CanvasTexture,
  MathUtils,
  SRGBColorSpace
} from 'three'
import { SPHERE_CONTENT } from './data/cmsSphereData'
import { getSphereInitialPositions, getSphereMotionParams, getSphereColor } from './data/spheres'

const SPHERE_COUNT = SPHERE_CONTENT.length
const SEGMENT_COUNT = (SPHERE_COUNT * (SPHERE_COUNT - 1)) / 2
/* ─── Bounding box ─── */
function BoundingBoxWireframe({ size = 24 }) {
  const edgesGeometry = useMemo(() => {
    const box = new BoxGeometry(size, size, size)
    return new EdgesGeometry(box)
  }, [size])
  return (
    <lineSegments geometry={edgesGeometry}>
      <lineBasicMaterial color="#1a2540" transparent opacity={0.5} />
    </lineSegments>
  )
}

/* ─── Utilidades ─── */
function distance(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

function spikeRand(sphereId, a, b) {
  const x = Math.sin((sphereId + 1) * 12.9898 + a * 78.233 + b * 43.758) * 43758.5453
  return x - Math.floor(x)
}

function hexToRgb(hex) {
  const h = hex.replace('#', '').slice(0, 6)
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}

function rgbaFromHex(hex, a) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

/* ─── Web de líneas ─── */
function SphereWeb({ positionsRef, paused, proximityThreshold, lineTwinkle = 1 }) {
  const lineRef = useRef()
  const matRef = useRef()
  const geometry = useMemo(() => {
    const geom = new BufferGeometry()
    const positions = new Float32Array(SEGMENT_COUNT * 2 * 3)
    geom.setAttribute('position', new BufferAttribute(positions, 3))
    geom.setDrawRange(0, 0)
    return geom
  }, [])

  useFrame((state) => {
    if (!lineRef.current || !positionsRef.current) return
    const tw = lineTwinkle ?? 0
    if (matRef.current && tw > 0) {
      const t = state.clock.elapsedTime
      const w = 0.5 + 0.5 * Math.sin(t * 0.55 + 0.3)
      matRef.current.opacity = MathUtils.lerp(0.22, 0.42, w * tw + (1 - tw) * 0.5)
    }
    const posAttr = lineRef.current.geometry.attributes.position
    const positions = positionsRef.current
    let idx = 0
    for (let i = 0; i < SPHERE_COUNT; i++) {
      for (let j = i + 1; j < SPHERE_COUNT; j++) {
        const a = positions[i], b = positions[j]
        if (a && b && distance(a, b) <= proximityThreshold) {
          posAttr.setXYZ(idx++, a.x, a.y, a.z)
          posAttr.setXYZ(idx++, b.x, b.y, b.z)
        }
      }
    }
    lineRef.current.geometry.setDrawRange(0, idx)
    posAttr.needsUpdate = true
  })

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial ref={matRef} color="#4a7faa" transparent opacity={0.35} />
    </lineSegments>
  )
}

/* ─── Textura de spikes ─── */
const SPIKE_CANVAS_SIZE = 512

function createDiamondSpikesTexture(colorHex, sphereId = 0) {
  const S = SPIKE_CANVAS_SIZE
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = S
  const ctx = canvas.getContext('2d')
  if (!ctx) { const t = new CanvasTexture(canvas); t.colorSpace = SRGBColorSpace; return t }

  const C = S / 2
  const halfToEdge = C * 0.98
  const globalLenBoost = 1.15 + spikeRand(sphereId, 0, 0) * 0.28
  const globalWidthBoost = 0.92 + spikeRand(sphereId, 1, 1) * 0.12

  const rayDefs = [
    [90, 0.88], [270, 0.88],
    [30, 0.64], [210, 0.64],
    [150, 0.48], [330, 0.48]
  ]

  ctx.clearRect(0, 0, S, S)

  const layers = [
    { blur: 28, alpha: 0.2, wScale: 1.14, lenScale: 1.05 },
    { blur: 15, alpha: 0.32, wScale: 1.06, lenScale: 1.02 },
    { blur: 6, alpha: 0.45, wScale: 1, lenScale: 1 }
  ]

  for (const layer of layers) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    rayDefs.forEach(([angleDeg, baseLenFrac], rayIdx) => {
      const lenJitter = 0.88 + spikeRand(sphereId, rayIdx, 2) * 0.3
      const widthJitter = 0.94 + spikeRand(sphereId, rayIdx, 3) * 0.12
      const lenFrac = baseLenFrac * lenJitter * globalLenBoost * layer.lenScale
      const lenPx = halfToEdge * lenFrac
      const wBaseRay = S * (0.02 + spikeRand(sphereId, rayIdx, 4) * 0.018) * globalWidthBoost
      const w = wBaseRay * layer.wScale * widthJitter
      const rad = (angleDeg * Math.PI) / 180
      const ux = Math.cos(rad), uy = -Math.sin(rad)
      const vx = Math.sin(rad), vy = Math.cos(rad)

      const tipX = C + ux * lenPx, tipY = C + uy * lenPx
      const pLx = C - vx * (w / 2), pLy = C - vy * (w / 2)
      const pRx = C + vx * (w / 2), pRy = C + vy * (w / 2)

      ctx.beginPath(); ctx.moveTo(pLx, pLy); ctx.lineTo(pRx, pRy); ctx.lineTo(tipX, tipY); ctx.closePath()
      const gAlong = ctx.createLinearGradient(C, C, tipX, tipY)
      gAlong.addColorStop(0, 'rgba(255,255,255,0.2)')
      gAlong.addColorStop(0.05, `rgba(255,255,255,${0.85 * layer.alpha})`)
      gAlong.addColorStop(0.12, rgbaFromHex(colorHex, 0.9 * layer.alpha))
      gAlong.addColorStop(0.5, rgbaFromHex(colorHex, 0.4 * layer.alpha))
      gAlong.addColorStop(1, rgbaFromHex(colorHex, 0))
      ctx.fillStyle = gAlong
      ctx.shadowBlur = layer.blur
      ctx.shadowColor = rgbaFromHex(colorHex, 0.5 * layer.alpha)
      ctx.globalAlpha = 0.94
      ctx.fill()

      ctx.beginPath(); ctx.moveTo(pLx, pLy); ctx.lineTo(pRx, pRy); ctx.lineTo(tipX, tipY); ctx.closePath()
      const mid = lenPx * 0.35
      const mx = C + ux * mid, my = C + uy * mid
      const gAcross = ctx.createLinearGradient(mx - vx * w, my - vy * w, mx + vx * w, my + vy * w)
      gAcross.addColorStop(0, 'rgba(255,255,255,0)')
      gAcross.addColorStop(0.35, `rgba(255,255,255,${0.4 * layer.alpha})`)
      gAcross.addColorStop(0.5, `rgba(255,255,255,${0.7 * layer.alpha})`)
      gAcross.addColorStop(0.65, `rgba(255,255,255,${0.4 * layer.alpha})`)
      gAcross.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = gAcross
      ctx.shadowBlur = layer.blur * 0.65
      ctx.globalAlpha = 0.55 * layer.alpha
      ctx.fill()
    })
    ctx.restore()
  }

  // Brillo central (punto blanco)
  const coreGlow = ctx.createRadialGradient(C, C, 0, C, C, S * 0.06)
  coreGlow.addColorStop(0, 'rgba(255,255,255,0.95)')
  coreGlow.addColorStop(0.4, 'rgba(255,255,255,0.3)')
  coreGlow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.fillStyle = coreGlow
  ctx.fillRect(0, 0, S, S)
  ctx.restore()

  ctx.save()
  ctx.globalCompositeOperation = 'destination-in'
  const mask = ctx.createRadialGradient(C, C, 0, C, C, C * 0.99)
  mask.addColorStop(0, 'rgba(255,255,255,1)')
  mask.addColorStop(0.88, 'rgba(255,255,255,1)')
  mask.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = mask
  ctx.fillRect(0, 0, S, S)
  ctx.restore()

  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

/* ─── Paleta de colores que oscilan entre blanco y azul ─── */
const COLOR_A = new Color('#ffffff')
const COLOR_B = new Color('#90b8e8')

/* ─── Doble capa de spikes con rotación, pulso de escala y oscilación de color ─── */
const HOVER_SCALE = 1.25
const SCALE_LERP = 0.18

function AnimatedSpikeBillboard({
  map,
  worldRadius,
  rotSpeed,
  scaleMin,
  scaleMax,
  pulseSpeed,
  colorSpeed,
  colorPhase,
  renderOrder,
  opacitySpeed,
  opacityPhase,
  brightnessSpeed,
  brightnessPhase,
  opacityTwinkle = 1,
  brightnessTwinkle = 1
}) {
  const meshRef = useRef()
  const matRef = useRef()
  const lerpColor = useMemo(() => new Color(), [])
  const outColor = useMemo(() => new Color(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.z = t * rotSpeed
    const pulse = scaleMin + (scaleMax - scaleMin) * (0.5 + 0.5 * Math.sin(t * pulseSpeed))
    meshRef.current.scale.setScalar(pulse)
    if (matRef.current) {
      const mix = 0.5 + 0.5 * Math.sin(t * colorSpeed + colorPhase)
      lerpColor.copy(COLOR_A).lerp(COLOR_B, mix)

      const twOp = opacityTwinkle ?? 0
      const twBr = brightnessTwinkle ?? 0
      if (twOp > 0) {
        const opWave = 0.5 + 0.5 * Math.sin(t * opacitySpeed + opacityPhase)
        const op = MathUtils.lerp(0.42, 1, opWave * twOp + (1 - twOp))
        matRef.current.opacity = op
      } else {
        matRef.current.opacity = 1
      }

      if (twBr > 0) {
        const brWave = 0.5 + 0.5 * Math.sin(t * brightnessSpeed + brightnessPhase)
        const br = MathUtils.lerp(0.72, 1.15, brWave * twBr + (1 - twBr))
        outColor.copy(lerpColor).multiplyScalar(br)
        matRef.current.color.copy(outColor)
      } else {
        matRef.current.color.copy(lerpColor)
      }
    }
  })

  return (
    <Billboard follow renderOrder={renderOrder}>
      <mesh ref={meshRef} raycast={() => null}>
        <circleGeometry args={[worldRadius, 80]} />
        <meshBasicMaterial
          ref={matRef}
          map={map}
          color={COLOR_A}
          transparent
          opacity={1}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  )
}

function DualSpikesStar({ color, sphereId, opacityTwinkle = 1, brightnessTwinkle = 1 }) {
  const map = useMemo(() => createDiamondSpikesTexture(color, sphereId), [color, sphereId])

  const worldRadius = useMemo(() => 1.2 + spikeRand(sphereId, 9, 9) * 0.55, [sphereId])

  const rotSpeed1 = useMemo(() => 0.06 + spikeRand(sphereId, 5, 5) * 0.08, [sphereId])
  const rotSpeed2 = useMemo(() => -(0.04 + spikeRand(sphereId, 6, 6) * 0.06), [sphereId])
  const pulseSpeed1 = useMemo(() => 0.5 + spikeRand(sphereId, 7, 7) * 0.6, [sphereId])
  const pulseSpeed2 = useMemo(() => 0.3 + spikeRand(sphereId, 8, 8) * 0.5, [sphereId])
  const colorSpeed1 = useMemo(() => 0.25 + spikeRand(sphereId, 10, 10) * 0.45, [sphereId])
  const colorSpeed2 = useMemo(() => 0.2 + spikeRand(sphereId, 11, 11) * 0.4, [sphereId])
  const colorPhase1 = useMemo(() => spikeRand(sphereId, 12, 12) * Math.PI * 2, [sphereId])
  const colorPhase2 = useMemo(() => spikeRand(sphereId, 13, 13) * Math.PI * 2, [sphereId])

  const opacitySpeed1 = useMemo(() => 0.35 + spikeRand(sphereId, 16, 16) * 0.55, [sphereId])
  const opacitySpeed2 = useMemo(() => 0.28 + spikeRand(sphereId, 17, 17) * 0.5, [sphereId])
  const opacityPhase1 = useMemo(() => spikeRand(sphereId, 18, 18) * Math.PI * 2, [sphereId])
  const opacityPhase2 = useMemo(() => spikeRand(sphereId, 19, 19) * Math.PI * 2, [sphereId])
  const brightnessSpeed1 = useMemo(() => 0.4 + spikeRand(sphereId, 20, 20) * 0.5, [sphereId])
  const brightnessSpeed2 = useMemo(() => 0.32 + spikeRand(sphereId, 21, 21) * 0.48, [sphereId])
  const brightnessPhase1 = useMemo(() => spikeRand(sphereId, 22, 22) * Math.PI * 2, [sphereId])
  const brightnessPhase2 = useMemo(() => spikeRand(sphereId, 23, 23) * Math.PI * 2, [sphereId])

  useEffect(() => () => map.dispose(), [map])

  return (
    <>
      <AnimatedSpikeBillboard
        map={map}
        worldRadius={worldRadius}
        rotSpeed={rotSpeed1}
        scaleMin={0.35}
        scaleMax={1.0}
        pulseSpeed={pulseSpeed1}
        colorSpeed={colorSpeed1}
        colorPhase={colorPhase1}
        renderOrder={4}
        opacitySpeed={opacitySpeed1}
        opacityPhase={opacityPhase1}
        brightnessSpeed={brightnessSpeed1}
        brightnessPhase={brightnessPhase1}
        opacityTwinkle={opacityTwinkle}
        brightnessTwinkle={brightnessTwinkle}
      />
      <AnimatedSpikeBillboard
        map={map}
        worldRadius={worldRadius * 0.85}
        rotSpeed={rotSpeed2}
        scaleMin={0.3}
        scaleMax={0.92}
        pulseSpeed={pulseSpeed2}
        colorSpeed={colorSpeed2}
        colorPhase={colorPhase2}
        renderOrder={3}
        opacitySpeed={opacitySpeed2}
        opacityPhase={opacityPhase2}
        brightnessSpeed={brightnessSpeed2}
        brightnessPhase={brightnessPhase2}
        opacityTwinkle={opacityTwinkle}
        brightnessTwinkle={brightnessTwinkle}
      />
    </>
  )
}

/* ─── Estrella flotante (sin esfera, sin anillo, solo spikes + hit area invisible) ─── */
function FloatingStar({
  id,
  basePosition,
  motion,
  title,
  color,
  paused,
  onSelect,
  positionsRef,
  motionSpeed,
  motionAmplitude,
  ownAxisSpin = 1,
  opacityTwinkle = 1,
  brightnessTwinkle = 1
}) {
  const groupRef = useRef()
  const spinGroupRef = useRef()
  const positionRef = useRef({ ...basePosition })
  const scaleRef = useRef(1)
  const [hovered, setHovered] = useState(false)

  const ownAxisRate = useMemo(() => {
    const base = 0.22 + spikeRand(id, 14, 14) * 0.38
    const sign = spikeRand(id, 15, 15) > 0.5 ? 1 : -1
    return base * sign
  }, [id])

  const pointerProps = {
    onClick: (e) => { e.stopPropagation(); onSelect(id) },
    onPointerOver: (e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' },
    onPointerOut: () => { setHovered(false); document.body.style.cursor = 'default' }
  }

  useFrame((state) => {
    const t = state.clock.elapsedTime * (motionSpeed ?? 1)
    const { speedX, speedY, speedZ, phaseX, phaseY, phaseZ, amplitude } = motion
    const amp = (motionAmplitude ?? 1) * amplitude
    if (!paused) {
      positionRef.current.x = basePosition.x + Math.sin(t * speedX + phaseX) * amp
      positionRef.current.y = basePosition.y + Math.sin(t * speedY + phaseY) * amp
      positionRef.current.z = basePosition.z + Math.sin(t * speedZ + phaseZ) * amp
    }
    if (groupRef.current) {
      groupRef.current.position.copy(positionRef.current)
      const targetScale = hovered ? HOVER_SCALE : 1
      scaleRef.current += (targetScale - scaleRef.current) * SCALE_LERP
      groupRef.current.scale.setScalar(scaleRef.current)
      if (positionsRef?.current && positionsRef.current[id]) {
        positionsRef.current[id].x = positionRef.current.x
        positionsRef.current[id].y = positionRef.current.y
        positionsRef.current[id].z = positionRef.current.z
      }
    }
    if (spinGroupRef.current) {
      const spin = ownAxisSpin ?? 0
      const tWorld = state.clock.elapsedTime
      spinGroupRef.current.rotation.y = tWorld * ownAxisRate * spin
    }
  })

  return (
    <group ref={groupRef} position={[basePosition.x, basePosition.y, basePosition.z]}>
      {/* Hit area invisible for clicks */}
      <mesh {...pointerProps} renderOrder={0}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <group ref={spinGroupRef}>
        <DualSpikesStar
          color={color}
          sphereId={id}
          opacityTwinkle={opacityTwinkle}
          brightnessTwinkle={brightnessTwinkle}
        />
      </group>

      {hovered && (
        <Html
          position={[0, 0.6, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#fff',
            textShadow: '0 0 8px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)',
            padding: '4px 10px', borderRadius: '6px',
            background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.15)'
          }}
          transform
        >
          {title}
        </Html>
      )}
    </group>
  )
}

/* ─── Fondo de estrellas con + y * ─── */
const STARFIELD_COUNT_MIN = 20
const STARFIELD_COUNT_MAX = 320

/** @param {number} density 0–1 */
function starfieldSymbolCount(density) {
  const d = Math.min(1, Math.max(0, density ?? 0.53))
  return Math.round(STARFIELD_COUNT_MIN + d * (STARFIELD_COUNT_MAX - STARFIELD_COUNT_MIN))
}

function StarfieldBackground({ density = 0.53 }) {
  const count = starfieldSymbolCount(density)

  const positions = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const r = 12 + spikeRand(i, 50, 50) * 18
      const theta = spikeRand(i, 51, 51) * Math.PI * 2
      const phi = Math.acos(2 * spikeRand(i, 52, 52) - 1)
      arr.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        symbol: spikeRand(i, 53, 53) > 0.5 ? '+' : '✦',
        opacity: 0.08 + spikeRand(i, 54, 54) * 0.18,
        size: 8 + spikeRand(i, 55, 55) * 14
      })
    }
    return arr
  }, [count])

  return (
    <group renderOrder={-1} key={count}>
      {positions.map((s, i) => (
        <Billboard key={i} position={[s.x, s.y, s.z]} follow>
          <Html
            center
            distanceFactor={20}
            style={{
              pointerEvents: 'none', userSelect: 'none',
              fontSize: `${s.size}px`, color: '#8aa8cc',
              opacity: s.opacity, lineHeight: 1
            }}
            transform
          >
            {s.symbol}
          </Html>
        </Billboard>
      ))}
    </group>
  )
}

/* ─── Escena principal ─── */
export function Scene({ paused, onSphereClick, sceneParams = {} }) {
  const {
    motionSpeed = 1,
    proximityThreshold = 5,
    motionAmplitude = 3,
    showBoundingBox = true,
    showWeb = true,
    spaceRadius = 10,
    ownAxisSpin = 1,
    opacityTwinkle = 1,
    brightnessTwinkle = 1,
    lineTwinkle = 1,
    starfieldDensity = 0.53
  } = sceneParams

  const initialPositions = useMemo(() => getSphereInitialPositions(spaceRadius), [spaceRadius])
  const motionParams = useMemo(() => getSphereMotionParams(), [])

  const positionsRef = useRef(null)
  if (!positionsRef.current || positionsRef.current.length !== initialPositions.length) {
    positionsRef.current = initialPositions.map((p) => ({ x: p.x, y: p.y, z: p.z }))
  }

  return (
    <>
      <StarfieldBackground density={starfieldDensity} />
      {showBoundingBox && <BoundingBoxWireframe size={spaceRadius * 2.6} />}
      {showWeb && (
        <SphereWeb
          positionsRef={positionsRef}
          paused={paused}
          proximityThreshold={proximityThreshold}
          lineTwinkle={lineTwinkle}
        />
      )}
      {initialPositions.map((pos, i) => (
        <FloatingStar
          key={i}
          id={i}
          basePosition={pos}
          motion={motionParams[i]}
          title={SPHERE_CONTENT[i]?.title ?? `Estrella ${i + 1}`}
          color={getSphereColor(i)}
          paused={paused}
          onSelect={onSphereClick}
          positionsRef={positionsRef}
          motionSpeed={motionSpeed}
          motionAmplitude={motionAmplitude}
          ownAxisSpin={ownAxisSpin}
          opacityTwinkle={opacityTwinkle}
          brightnessTwinkle={brightnessTwinkle}
        />
      ))}
    </>
  )
}
