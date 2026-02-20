import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BoxGeometry, EdgesGeometry } from 'three'
import {
  SPHERE_COLORS,
  getSphereInitialPositions,
  getSphereMotionParams
} from './data/spheres'

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

function FloatingSphere({ id, basePosition, motion, color, paused, onSelect }) {
  const meshRef = useRef()
  const positionRef = useRef({ ...basePosition })

  useFrame((state) => {
    if (paused || !meshRef.current) return
    const t = state.clock.elapsedTime
    const { speedX, speedY, speedZ, phaseX, phaseY, phaseZ, amplitude } = motion
    positionRef.current.x = basePosition.x + Math.sin(t * speedX + phaseX) * amplitude
    positionRef.current.y = basePosition.y + Math.sin(t * speedY + phaseY) * amplitude
    positionRef.current.z = basePosition.z + Math.sin(t * speedZ + phaseZ) * amplitude
    meshRef.current.position.copy(positionRef.current)
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
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.35, 24, 24]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function Scene({ paused, onSphereClick }) {
  const initialPositions = useMemo(() => getSphereInitialPositions(), [])
  const motionParams = useMemo(() => getSphereMotionParams(), [])

  return (
    <>
      <BoundingBoxWireframe />
      {initialPositions.map((pos, i) => (
        <FloatingSphere
          key={i}
          id={i}
          basePosition={pos}
          motion={motionParams[i]}
          color={SPHERE_COLORS[i]}
          paused={paused}
          onSelect={onSphereClick}
        />
      ))}
    </>
  )
}
