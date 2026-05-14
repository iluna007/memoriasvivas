export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  const icon = isDark ? '\u263A' : '\u263B'

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      <span aria-hidden>{icon}</span>
    </button>
  )
}
