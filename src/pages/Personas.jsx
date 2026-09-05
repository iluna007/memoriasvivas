import { useOutletContext } from 'react-router-dom'
import { COMUNIDAD_POR_LUGAR } from '../data/comunidad'
import { getContentPageTheme } from '../utils/pageThemeClasses'

export default function Personas() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const t = getContentPageTheme(theme)

  return (
    <main className="min-h-full pt-16">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        

        {COMUNIDAD_POR_LUGAR.map((grupo) => (
          <section key={grupo.lugar} className="mb-10 last:mb-0">
            <h2 className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${t.muted}`}>
              {grupo.lugar}
            </h2>

            <ul className={`grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2 ${t.body}`}>
              {grupo.personas.map((p) => (
                <li key={p.key} className="text-sm sm:text-base">
                  {p.nombre}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
