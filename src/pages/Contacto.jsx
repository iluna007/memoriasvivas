import { useState } from 'react'

export default function Contacto() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="pt-16 min-h-full bg-black text-white overflow-y-auto">
      <div className="max-w-xl mx-auto px-6 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Contacto
        </h1>
        <p className="text-white/70 text-sm mb-8">
          Escríbenos o envíanos un mensaje sobre Memorias Vivas.
        </p>

        {sent ? (
          <div className="p-6 rounded-lg bg-white/5 border border-white/10 text-center">
            <p className="text-white/90">
              Gracias por tu mensaje. Te responderemos lo antes posible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1.5">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-1.5">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent resize-y min-h-[120px]"
                placeholder="Escribe tu mensaje..."
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] py-3 px-4 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium transition-colors touch-manipulation"
            >
              Enviar mensaje
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm">
            También puedes contactarnos por correo en{' '}
            <a href="mailto:contacto@memoriasvivas.example" className="text-white/90 underline hover:text-white">
              contacto@memoriasvivas.example
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
