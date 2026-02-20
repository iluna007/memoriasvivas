import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene } from './Scene'
import { LeftPanel } from './components/LeftPanel'

export default function App() {
  const [selectedSphere, setSelectedSphere] = useState(null)
  const isPaused = selectedSphere !== null

  return (
    <div className="w-full h-full relative">
      {selectedSphere !== null && (
        <LeftPanel
          selectedSphereId={selectedSphere}
          onClose={() => setSelectedSphere(null)}
        />
      )}

      <Canvas
        camera={{ position: [8, 5, 8], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <Scene paused={isPaused} onSphereClick={setSelectedSphere} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={25}
        />
      </Canvas>
    </div>
  )
}
