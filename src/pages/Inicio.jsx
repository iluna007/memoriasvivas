import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene } from '../Scene'
import { LeftPanel } from '../components/LeftPanel'
import { RightPanel } from '../components/RightPanel'
import { ControlsPanel } from '../components/ControlsPanel'
import CameraLegend from '../components/CameraLegend'

const DEFAULT_PARAMS = {
  motionSpeed: 1,
  proximityThreshold: 5,
  motionAmplitude: 1,
  showBoundingBox: true,
  showWeb: true,
  backgroundColor: '#05080f',
  spaceRadius: 10,
  ownAxisSpin: 1,
  opacityTwinkle: 1,
  brightnessTwinkle: 1,
  lineTwinkle: 1,
  starfieldDensity: 0.53
}

export default function Inicio() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const [selectedSphere, setSelectedSphere] = useState(null)
  const [sceneParams, setSceneParams] = useState(DEFAULT_PARAMS)
  const isPaused = selectedSphere !== null

  return (
    <div className="w-full h-full relative">
      {selectedSphere !== null && (
        <>
          <LeftPanel
            theme={theme}
            selectedSphereId={selectedSphere}
            onClose={() => setSelectedSphere(null)}
          />
          <RightPanel
            theme={theme}
            selectedSphereId={selectedSphere}
            onClose={() => setSelectedSphere(null)}
          />
        </>
      )}

      <ControlsPanel theme={theme} params={sceneParams} onChange={setSceneParams} />
      <CameraLegend theme={theme} />

      <Canvas
        camera={{ position: [8, 5, 8], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
        }}
      >
        <color attach="background" args={[sceneParams.backgroundColor || '#000000']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <Scene
          paused={isPaused}
          onSphereClick={setSelectedSphere}
          sceneParams={sceneParams}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={25}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}
