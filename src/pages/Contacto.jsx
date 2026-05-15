import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getContentPageTheme } from '../utils/pageThemeClasses'

const PROJECT_SOCIAL = {
  youtube: 'https://www.youtube.com/@MemoriasVivasdelsur',
  instagram: 'https://www.instagram.com/memo.riasvivas/',
}

function IconYouTube({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function IconInstagram({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function SocialIconButton({ href, label, Icon, theme }) {
  const ring =
    theme === 'light'
      ? 'border border-zinc-300 bg-white/70 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-100'
      : 'border border-white/15 bg-white/5 text-white hover:border-white/25 hover:bg-white/10'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${ring}`}
    >
      <Icon className="h-5 w-5" />
    </a>
  )
}

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
          <p className={`mb-2 text-center text-xs font-semibold uppercase tracking-wide ${t.muted}`}>
            Redes sociales del proyecto
          </p>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <SocialIconButton
              href={PROJECT_SOCIAL.youtube}
              label="Memorias Vivas en YouTube"
              Icon={IconYouTube}
              theme={theme}
            />
            <SocialIconButton
              href={PROJECT_SOCIAL.instagram}
              label="Memorias Vivas en Instagram"
              Icon={IconInstagram}
              theme={theme}
            />
          </div>
          <p className={`text-center text-sm ${t.muted}`}>
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
