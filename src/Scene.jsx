import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { BoxGeometry, BufferAttribute, BufferGeometry, EdgesGeometry } from 'three'
import { SPHERE_CONTENT } from './data/sphereContent'
import { getSphereInitialPositions, getSphereMotionParams } from './data/spheres'

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

function FloatingSphere({ id, basePosition, motion, title, color, paused, onSelect, positionsRef, motionSpeed, motionAmplitude }) {
  const meshRef = useRef()
  const positionRef = useRef({ ...basePosition })
  const scaleRef = useRef(1)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.elapsedTime * (motionSpeed ?? 1)
    const { speedX, speedY, speedZ, phaseX, phaseY, phaseZ, amplitude } = motion
    const amp = (motionAmplitude ?? 1) * amplitude
    if (!paused) {
      positionRef.current.x = basePosition.x + Math.sin(t * speedX + phaseX) * amp
      positionRef.current.y = basePosition.y + Math.sin(t * speedY + phaseY) * amp
      positionRef.current.z = basePosition.z + Math.sin(t * speedZ + phaseZ) * amp
    }
    if (meshRef.current) {
      meshRef.current.position.copy(positionRef.current)
      const targetScale = hovered ? HOVER_SCALE : 1
      scaleRef.current += (targetScale - scaleRef.current) * SCALE_LERP
      meshRef.current.scale.setScalar(scaleRef.current)
      if (positionsRef?.current && positionsRef.current[id]) {
        positionsRef.current[id].x = positionRef.current.x
        positionsRef.current[id].y = positionRef.current.y
        positionsRef.current[id].z = positionRef.current.z
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[basePosition.x, basePosition.y, basePosition.z]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.35, 24, 24]} />
      <meshStandardMaterial color={color} />
      {hovered && (
        <Html
          position={[0, 0.55, 0]}
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
    </mesh>
  )
}

export function Scene({ paused, onSphereClick, sceneParams = {} }) {
  const initialPositions = useMemo(() => getSphereInitialPositions(), [])
  const motionParams = useMemo(() => getSphereMotionParams(), [])

  const {
    motionSpeed = 1,
    proximityThreshold = 5,
    motionAmplitude = 1,
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
          color={SPHERE_CONTENT[i]?.color ?? '#888'}
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
