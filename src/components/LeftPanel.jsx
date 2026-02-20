import { SPHERE_COLORS } from '../data/spheres'

const PLACEHOLDER_IMAGES = [
  'https://placehold.co/400x240/1a1a1a/666?text=Imagen+1',
  'https://placehold.co/400x240/1a1a1a/666?text=Imagen+2'
]

export function LeftPanel({ selectedSphereId, onClose }) {
  const title = selectedSphereId != null
    ? `Esfera ${selectedSphereId + 1}`
    : ''
  const color = selectedSphereId != null ? SPHERE_COLORS[selectedSphereId] : null

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[380px] max-w-[90vw] bg-black/95 backdrop-blur-sm border-r border-white/10 flex flex-col z-10 shadow-2xl"
      style={{ borderLeftWidth: color ? 4 : 0, borderLeftStyle: 'solid', borderLeftColor: color ?? 'transparent' }}
    >
      <div className="p-6 flex-1 overflow-y-auto relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl leading-none transition-colors"
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-white pr-10 mb-4" style={{ color: color ?? '#fff' }}>
          {title}
        </h2>

        <p className="text-white/80 text-sm leading-relaxed mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
            <img
              src={PLACEHOLDER_IMAGES[0]}
              alt="Placeholder 1"
              className="w-full h-auto block"
            />
          </div>
          <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
            <img
              src={PLACEHOLDER_IMAGES[1]}
              alt="Placeholder 2"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
