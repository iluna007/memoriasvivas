import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene } from './Scene'
import { LeftPanel } from './components/LeftPanel'
import { ControlsPanel } from './components/ControlsPanel'

const DEFAULT_PARAMS = {
  motionSpeed: 1,
  proximityThreshold: 5,
  motionAmplitude: 1,
  showBoundingBox: true,
  showWeb: true
}

export default function App() {
  const [selectedSphere, setSelectedSphere] = useState(null)
  const [sceneParams, setSceneParams] = useState(DEFAULT_PARAMS)
  const isPaused = selectedSphere !== null

  return (
    <div className="w-full h-full relative">
      {selectedSphere !== null && (
        <LeftPanel
          selectedSphereId={selectedSphere}
          onClose={() => setSelectedSphere(null)}
        />
      )}

      <ControlsPanel params={sceneParams} onChange={setSceneParams} />

      <Canvas
        camera={{ position: [8, 5, 8], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
        }}
      >
        <color attach="background" args={['#000000']} />
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
