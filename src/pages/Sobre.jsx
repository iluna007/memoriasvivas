export default function Sobre() {
  return (
    <main className="pt-16 min-h-full bg-black text-white overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Sobre Memorias Vivas
        </h1>

        <p className="text-white/90 leading-relaxed mb-6">
          Memorias Vivas es un proyecto que explora la memoria, el espacio y las conexiones
          a través de una experiencia interactiva en 3D. Dieciocho esferas flotan en un
          espacio delimitado, unidas por líneas que aparecen y desaparecen según la
          proximidad entre ellas.
        </p>

        <p className="text-white/90 leading-relaxed mb-6">
          Cada esfera representa un nodo de memoria o un momento. Al hacer clic en una,
          el movimiento se detiene y se abre un panel con más información, invitando a
          profundizar en esa pieza del conjunto. El cubo que enmarca la escena recuerda
          los límites del recuerdo; la red de líneas evoca las asociaciones que vamos
          tejiendo entre nuestras propias memorias.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-3">Cómo usar la experiencia</h2>
        <ul className="list-disc list-inside text-white/80 space-y-2 mb-8">
          <li>En <strong>Inicio</strong> puedes rotar la cámara con el ratón o el tacto, hacer zoom y desplazarte.</li>
          <li>Haz clic o toca una esfera para pausar la escena y ver su detalle en el panel izquierdo.</li>
          <li>Usa el botón de controles (esquina superior derecha) para ajustar velocidad, amplitud y visibilidad de la red.</li>
        </ul>

        <p className="text-white/70 text-sm">
          Este sitio está construido con React, Three.js y Tailwind CSS.
        </p>
      </div>
    </main>
  )
}
