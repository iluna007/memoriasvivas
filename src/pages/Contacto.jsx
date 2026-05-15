import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getContentPageTheme } from '../utils/pageThemeClasses'

export default function Contacto() {
  const { theme = 'dark' } = useOutletContext() ?? {}
  const t = getContentPageTheme(theme)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  const inputBase = `w-full rounded-lg border px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 ${t.input}`

  return (
    <main className="min-h-full pt-16">
      <div className="mx-auto max-w-xl px-6 py-10 sm:py-14">
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Contacto</h1>
        <p className={`mb-8 text-sm ${t.lead}`}>Escríbenos o envíanos un mensaje sobre Memorias Vivas.</p>

        {sent ? (
          <div className={`rounded-lg p-6 text-center ${t.successBox}`}>
            <p className={t.body}>Gracias por tu mensaje. Te responderemos lo antes posible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className={`mb-1.5 block text-sm font-medium ${t.label}`}>
                Nombre
              </label>
              <input id="name" type="text" name="name" required className={inputBase} placeholder="Tu nombre" />
            </div>

            <div>
              <label htmlFor="email" className={`mb-1.5 block text-sm font-medium ${t.label}`}>
                Correo electrónico
              </label>
              <input id="email" type="email" name="email" required className={inputBase} placeholder="tu@email.com" />
            </div>

            <div>
              <label htmlFor="message" className={`mb-1.5 block text-sm font-medium ${t.label}`}>
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className={`min-h-[120px] w-full resize-y rounded-lg border px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 ${t.input}`}
                placeholder="Escribe tu mensaje..."
              />
            </div>

            <button
              type="submit"
              className={`min-h-[48px] w-full touch-manipulation rounded-lg px-4 py-3 font-medium transition-colors ${t.btnPrimary}`}
            >
              Enviar mensaje
            </button>
          </form>
        )}

        <div className={`mt-12 border-t pt-8 ${t.divider}`}>
          <p className={`text-sm ${t.muted}`}>
            También puedes contactarnos por correo en{' '}
            <a href="mailto:contacto@memoriasvivas.example" className={t.link}>
              contacto@memoriasvivas.example
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
