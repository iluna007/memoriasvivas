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
  SRGBColorSpace,
  DoubleSide
} from 'three'
import { SPHERE_CONTENT } from './data/cmsSphereData'
import { getSphereInitialPositions, getSphereMotionParams, getSphereColor } from './data/spheres'

const SPHERE_COUNT = SPHERE_CONTENT.length
// Máximo de segmentos (todas las parejas); solo se dibujan los que estén bajo el umbral
const SEGMENT_COUNT = (SPHERE_COUNT * (SPHERE_COUNT - 1)) / 2

// Cubo que delimita el volumen donde se mueven las esferas (radio ~6 + amplitud ~1 → lado 16)
const BOUNDS_SIZE = 16

function BoundingBoxWireframe() {
  const edgesGeometry = useMemo(() => {
    const box = new BoxGeometry(BOUNDS_SIZE, BOUNDS_SIZE, BOUNDS_SIZE)
    return new EdgesGeometry(box)
  }, [])

  return (
    <lineSegments geometry={edgesGeometry}>
      <lineBasicMaterial color="#444" transparent opacity={0.8} />
    </lineSegments>
  )
}

// Distancia entre dos puntos 3D
function distance(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

// Líneas que conectan solo esferas cercanas (aparecen/desaparecen por proximidad)
function SphereWeb({ positionsRef, paused, proximityThreshold }) {
  const lineRef = useRef()
  const geometry = useMemo(() => {
    const geom = new BufferGeometry()
    const positions = new Float32Array(SEGMENT_COUNT * 2 * 3)
    geom.setAttribute('position', new BufferAttribute(positions, 3))
    geom.setDrawRange(0, 0)
    return geom
  }, [])

  useFrame(() => {
    if (!lineRef.current || !positionsRef.current) return
    const posAttr = lineRef.current.geometry.attributes.position
    const positions = positionsRef.current
    let idx = 0
    for (let i = 0; i < SPHERE_COUNT; i++) {
      for (let j = i + 1; j < SPHERE_COUNT; j++) {
        const a = positions[i]
        const b = positions[j]
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
      <lineBasicMaterial color="#3a7ca5" transparent opacity={0.6} />
    </lineSegments>
  )
}

const HOVER_SCALE = 1.25
const SCALE_LERP = 0.18

/** Radio del núcleo (esfera sólida): más pequeño y se ve más “ligero” con opacidad. */
const CORE_RADIUS = 0.26

/** Textura 2D: 6 rayos tipo diamante (triángulo), gradientes y feather. */
const SPIKE_CANVAS_SIZE = 512

/** Aleatorio determinista por esfera / rayo (0–1) */
function spikeRand(sphereId, a, b) {
  const x = Math.sin((sphereId + 1) * 12.9898 + a * 78.233 + b * 43.758) * 43758.5453
  return x - Math.floor(x)
}

function hexToRgb(hex) {
  const h = hex.replace('#', '').slice(0, 6)
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16)
  }
}

function rgbaFromHex(hex, a) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

/**
 * 6 rayos en 3 ejes (2 por eje). Largos base ~85% / 60% / 45% del radio al borde.
 * `sphereId` altera longitudes y anchos de cada spike de forma distinta por esfera.
 */
function createDiamondSpikesTexture(colorHex, sphereId = 0) {
  const S = SPIKE_CANVAS_SIZE
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = S
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const t = new CanvasTexture(canvas)
    t.colorSpace = SRGBColorSpace
    return t
  }

  const C = S / 2
  const halfToEdge = C * 0.98
  /** Escala global de tamaño de spikes + variación por esfera (ancho base reducido abajo) */
  const globalLenBoost = 1.08 + spikeRand(sphereId, 0, 0) * 0.22
  const globalWidthBoost = 0.92 + spikeRand(sphereId, 1, 1) * 0.12

  /** [ángulo°, fracción base hacia el borde] — se modifica por rayo */
  const rayDefs = [
    [90, 0.85],
    [270, 0.85],
    [30, 0.6],
    [210, 0.6],
    [150, 0.45],
    [330, 0.45]
  ]

  ctx.clearRect(0, 0, S, S)

  /** Varias capas: blur + opacidad distinta (feather sin bordes duros) */
  const layers = [
    { blur: 26, alpha: 0.18, wScale: 1.12, lenScale: 1.04 },
    { blur: 14, alpha: 0.28, wScale: 1.05, lenScale: 1.02 },
    { blur: 6, alpha: 0.38, wScale: 1, lenScale: 1 }
  ]

  for (const layer of layers) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    rayDefs.forEach(([angleDeg, baseLenFrac], rayIdx) => {
      /** Longitud y ancho distintos por cada spike; base estrecha (no ancha junto al orbe) */
      const lenJitter = 0.9 + spikeRand(sphereId, rayIdx, 2) * 0.28
      const widthJitter = 0.94 + spikeRand(sphereId, rayIdx, 3) * 0.12
      const lenFrac = baseLenFrac * lenJitter * globalLenBoost * layer.lenScale
      const lenPx = halfToEdge * lenFrac
      /** Base fina: ~2.2–4.2% del ancho del canvas */
      const wBaseRay = S * (0.022 + spikeRand(sphereId, rayIdx, 4) * 0.02) * globalWidthBoost
      const w = wBaseRay * layer.wScale * widthJitter
      const rad = (angleDeg * Math.PI) / 180
      const ux = Math.cos(rad)
      const uy = -Math.sin(rad)
      const vx = Math.sin(rad)
      const vy = Math.cos(rad)

      const tipX = C + ux * lenPx
      const tipY = C + uy * lenPx
      const pLx = C - vx * (w / 2)
      const pLy = C - vy * (w / 2)
      const pRx = C + vx * (w / 2)
      const pRy = C + vy * (w / 2)

      ctx.beginPath()
      ctx.moveTo(pLx, pLy)
      ctx.lineTo(pRx, pRy)
      ctx.lineTo(tipX, tipY)
      ctx.closePath()

      // Gradiente a lo largo del rayo: blanco céntrico → color → transparente en punta
      const gAlong = ctx.createLinearGradient(C, C, tipX, tipY)
      gAlong.addColorStop(0, 'rgba(255,255,255,0.15)')
      gAlong.addColorStop(0.06, `rgba(255,255,255,${0.75 * layer.alpha})`)
      gAlong.addColorStop(0.14, rgbaFromHex(colorHex, 0.85 * layer.alpha))
      gAlong.addColorStop(0.55, rgbaFromHex(colorHex, 0.45 * layer.alpha))
      gAlong.addColorStop(1, rgbaFromHex(colorHex, 0))

      ctx.fillStyle = gAlong
      ctx.shadowBlur = layer.blur
      ctx.shadowColor = rgbaFromHex(colorHex, 0.5 * layer.alpha)
      ctx.globalAlpha = 0.92
      ctx.fill()

      // Segundo trazo: gradiente perpendicular (suavizado lateral tipo diamante)
      ctx.beginPath()
      ctx.moveTo(pLx, pLy)
      ctx.lineTo(pRx, pRy)
      ctx.lineTo(tipX, tipY)
      ctx.closePath()
      const mid = lenPx * 0.35
      const mx = C + ux * mid
      const my = C + uy * mid
      const gAcross = ctx.createLinearGradient(
        mx - vx * w,
        my - vy * w,
        mx + vx * w,
        my + vy * w
      )
      gAcross.addColorStop(0, 'rgba(255,255,255,0)')
      gAcross.addColorStop(0.35, `rgba(255,255,255,${0.35 * layer.alpha})`)
      gAcross.addColorStop(0.5, `rgba(255,255,255,${0.65 * layer.alpha})`)
      gAcross.addColorStop(0.65, `rgba(255,255,255,${0.35 * layer.alpha})`)
      gAcross.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = gAcross
      ctx.shadowBlur = layer.blur * 0.65
      ctx.globalAlpha = 0.55 * layer.alpha
      ctx.fill()
    })
    ctx.restore()
  }

  // Máscara circular suave: sin esquinas del canvas
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

/**
 * RAYOS (spikes) en Billboard: textura con 6 diamantes; tamaño en mundo variable por esfera.
 */
function SpikedGlowBillboard({ color, sphereId }) {
  const threeColor = useMemo(() => new Color(color), [color])
  const map = useMemo(() => createDiamondSpikesTexture(color, sphereId), [color, sphereId])

  /** Radio del disco mayor que antes; cada esfera escala un poco distinto */
  const worldRadius = useMemo(
    () => 1.12 + spikeRand(sphereId, 9, 9) * 0.48,
    [sphereId]
  )

  useEffect(() => {
    return () => map.dispose()
  }, [map])

  return (
    <Billboard follow renderOrder={4}>
      <mesh raycast={() => null}>
        <circleGeometry args={[worldRadius, 80]} />
        <meshBasicMaterial
          map={map}
          color={threeColor}
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

function FloatingSphere({
  id,
  basePosition,
  motion,
  title,
  color,
  paused,
  onSelect,
  positionsRef,
  motionSpeed,
  motionAmplitude
}) {
  const groupRef = useRef()
  const positionRef = useRef({ ...basePosition })
  const scaleRef = useRef(1)
  const [hovered, setHovered] = useState(false)

  const threeColor = useMemo(() => new Color(color), [color])

  const pointerProps = {
    onClick: (e) => {
      e.stopPropagation()
      onSelect(id)
    },
    onPointerOver: (e) => {
      e.stopPropagation()
      setHovered(true)
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      setHovered(false)
      document.body.style.cursor = 'default'
    }
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
  })

  return (
    <group ref={groupRef} position={[basePosition.x, basePosition.y, basePosition.z]}>
      {/* Aura esférica (una sola capa envolvente) */}
      <mesh {...pointerProps} renderOrder={1} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[CORE_RADIUS * 1.18, 28, 28]} />
        <meshBasicMaterial
          color={threeColor}
          transparent
          opacity={0.12}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Aura extra: un anillo (no esfera completa) alrededor del núcleo */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={2}
        castShadow={false}
        receiveShadow={false}
      >
        <ringGeometry args={[CORE_RADIUS * 1.05, CORE_RADIUS * 1.4, 72]} />
        <meshBasicMaterial
          color={threeColor}
          transparent
          opacity={0.36}
          side={DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Núcleo: aún más transparente */}
      <mesh castShadow receiveShadow renderOrder={3}>
        <sphereGeometry args={[CORE_RADIUS, 32, 32]} />
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={0.78}
          roughness={0.45}
          metalness={0.1}
          transparent
          opacity={0.48}
          toneMapped={false}
        />
      </mesh>

      <SpikedGlowBillboard color={color} sphereId={id} />

      {hovered && (
        <Html
          position={[0, CORE_RADIUS * HOVER_SCALE + 0.22, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            color: '#fff',
            textShadow: '0 0 8px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}
          transform
        >
          {title}
        </Html>
      )}
    </group>
  )
}

export function Scene({ paused, onSphereClick, sceneParams = {} }) {
  const initialPositions = useMemo(() => getSphereInitialPositions(), [])
  const motionParams = useMemo(() => getSphereMotionParams(), [])

  const {
    motionSpeed = 1,
    proximityThreshold = 5,
    motionAmplitude = 3,
    showBoundingBox = true,
    showWeb = true
  } = sceneParams

  const positionsRef = useRef(
    initialPositions.map((p) => ({ x: p.x, y: p.y, z: p.z }))
  )

  return (
    <>
      {showBoundingBox && <BoundingBoxWireframe />}
      {showWeb && (
        <SphereWeb
          positionsRef={positionsRef}
          paused={paused}
          proximityThreshold={proximityThreshold}
        />
      )}
      {initialPositions.map((pos, i) => (
        <FloatingSphere
          key={i}
          id={i}
          basePosition={pos}
          motion={motionParams[i]}
          title={SPHERE_CONTENT[i]?.title ?? `Esfera ${i + 1}`}
          color={getSphereColor(i)}
          paused={paused}
          onSelect={onSphereClick}
          positionsRef={positionsRef}
          motionSpeed={motionSpeed}
          motionAmplitude={motionAmplitude}
        />
      ))}
    </>
  )
}
