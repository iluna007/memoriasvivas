/**
 * Clases reutilizables para páginas de contenido según theme (Layout → Outlet context).
 * @param {'light' | 'dark'} theme
 */
export function getContentPageTheme(theme) {
  const L = theme === 'light'
  return {
    /** Párrafo intro / cuerpo secundario */
    lead: L ? 'text-zinc-600' : 'text-white/75',
    /** Cuerpo principal */
    body: L ? 'text-zinc-800 selection:bg-zinc-200/60' : 'text-white/85 selection:bg-white/20',
    /** Texto atenuado */
    muted: L ? 'text-zinc-500' : 'text-white/60',
    /** Tarjeta con borde */
    card: L ? 'border border-zinc-200 bg-white/90 shadow-sm' : 'border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-lg',
    /** Borde divisorio */
    divider: L ? 'border-zinc-200' : 'border-white/10',
    /** Títulos dentro de tarjeta */
    cardTitle: L ? 'text-zinc-900' : 'text-white',
    cardSub: L ? 'text-zinc-600' : 'text-white/55',
    cardHint: L ? 'text-zinc-500' : 'text-white/40',
    cardBio: L ? 'text-zinc-800' : 'text-white/80',
    /** Botón secundario outline */
    btnOutline: L
      ? 'border border-zinc-300 bg-zinc-50 text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200'
      : 'border border-white/15 bg-white/5 text-white/90 hover:bg-white/10 active:bg-white/15',
    /** Input / textarea */
    input: L
      ? 'border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:ring-zinc-400/40'
      : 'border-white/20 bg-white/10 text-white placeholder-white/40 focus:ring-white/30',
    /** Label formulario */
    label: L ? 'text-zinc-800' : 'text-white/90',
    /** Caja mensaje éxito */
    successBox: L ? 'border border-zinc-200 bg-zinc-50 text-zinc-800' : 'border border-white/10 bg-white/5 text-white/90',
    /** Botón primario ancho */
    btnPrimary: L ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-white/15 text-white hover:bg-white/25',
    /** Enlace en párrafo */
    link: L ? 'text-zinc-900 underline hover:text-zinc-700' : 'text-white/90 underline hover:text-white',
    /** Portada / bloque imagen */
    heroFrame: L ? 'border border-zinc-200 bg-zinc-100' : 'border border-white/10 bg-zinc-900'
  }
}
