import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  SPHERE_COLORS,
  getSphereInitialPositions,
  getSphereMotionParams
} from './data/spheres'

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
