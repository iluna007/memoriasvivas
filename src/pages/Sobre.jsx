import { useOutletContext } from 'react-router-dom'
import { getContentPageTheme } from '../utils/pageThemeClasses'

export default function Sobre() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const t = getContentPageTheme(theme)

  return (
    <main className="min-h-full pt-16">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <div className={`mb-10 aspect-[21/9] w-full overflow-hidden rounded-2xl ${t.heroFrame}`}>
          <img
            src="/sobre/naturaleza-julian-torres.jpg"
            alt="Detalle de follaje en la Península de Osa. Fotografía de Julián Torres."
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <h1 className="mb-2 text-3xl font-bold leading-tight sm:text-4xl">Constelar, cartografiar, imaginar</h1>

        <div className={`mt-8 space-y-6 text-[15px] leading-[1.8] ${t.body}`}>
          <p>
            <em>Memorias vivas</em> (EC-649) es un repositorio en construcción, compuesto por
            registros en audio, video, fotografía y texto que documentan encuentros, caminatas,
            talleres y conversaciones con personas que habitan los territorios aledaños al Golfo
            Dulce. Este repositorio se propone como una plataforma para activar la imaginación
            colectiva, el reconocimiento mutuo y la defensa de los territorios que hacen posible
            la vida.
          </p>

          <p>
            La información se dispone como una constelación y una forma de imaginar
            conversaciones, pasados, proyecciones, imágenes, recorridos y procesos a través de
            puntos de contacto que, al vincularse, dejan aparecer figuras. Así como trazamos
            líneas imaginarias entre las estrellas para orientarnos en el cielo e imaginar
            relatos, afectos y destinos, aquí las memorias dispersas se articulan para producir
            nuevas formas de reconocimiento.
          </p>

          <p>
            La constelación funciona como método y como medio para visualizar proximidades y
            resonancias y, como la memoria, trabaja mediante juegos que reúnen restos, tiempos y
            espacios. En ese montaje emergen relaciones entre humanos, historias, ríos, especies,
            climas e infraestructuras, entendidas no como elementos aislados sino como entramados
            dinámicos que producen sentido. Cada registro, caminata, conversación, fotografía,
            sonido actúa como un vestigio que, al entrar en relación con otros, activa nuevas
            lecturas sobre los territorios y las vidas que los sostienen.
          </p>

          <p>
            Los vértices de estas constelaciones se articulan a partir de microhistorias,
            narraciones de vida de experiencias cotidianas, familiares, comunitarias. Estas
            historias, que suelen quedar fuera de los relatos oficiales, nos permiten poner el
            acento sobre otras formas de pensar las comunidades nacionales y sus extranjerías.
            Este proyecto se propone trazar líneas entre las experiencias cotidianas, las memorias
            familiares, las historias de naturoculturas o de procesos de desigualdad, violencias
            lentas y extractivismos. No se busca construir una narrativa totalizante, sino
            atender a los gestos, a las voces y a las formas en que el recuerdo y los testimonios
            de vida construyen futuro, o nos dan pistas sobre cómo vivir mejor. En este sentido,
            la idea de constelación funciona aquí como una práctica de montaje que reúne
            fragmentos dispersos para producir nuevas formas de percepción y de sentido que
            integren diversos medios y perspectivas.
          </p>

          <p>
            Proponemos que las personas usuarias de esta web puedan imaginar y trazar vínculos
            entre temporalidades heterogéneas, heterotopías, afectos, paisajes y experiencias que
            no suelen aparecer juntas dentro de las narrativas hegemónicas.
          </p>

          <p>
            Las memorias no sólo permiten releer el pasado, sino también imaginar modos distintos
            de vivir y comprender la realidad; modos que deben incluir otras formas de imaginar
            que potencien futuros más inclusivos con otras formas de vida. El cuido entre humanos,
            distintas especies de flora y fauna, de los ríos y de las diversas infraestructuras
            que permiten la vida es vital en este proceso.
          </p>

          <p>
            Constelar implica, entonces, reconocer que existen múltiples maneras de habitar el
            territorio, de relacionarse con el entorno y de construir comunidades en
            temporalidades no lineales. Constelar es atender a redes transgeneracionales y a las
            maneras en que estas sobreviven, se transforman o cambian en las prácticas cotidianas,
            en los afectos y en las formas locales de conocimiento.
          </p>
        </div>

        <p className={`mt-10 text-right text-sm font-medium italic ${t.muted}`}>Rocío Zamora-Sauma</p>
      </div>
    </main>
  )
}
