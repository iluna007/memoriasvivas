export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  const icon = isDark ? '\u263A' : '\u263B'

  const btnClass =
    theme === 'light'
      ? 'flex h-9 w-9 items-center justify-center rounded-full text-lg text-zinc-700 transition-colors hover:bg-black/10 hover:text-zinc-950'
      : 'flex h-9 w-9 items-center justify-center rounded-full text-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white'

  return (
    <button
      type="button"
      onClick={onToggle}
      className={btnClass}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      <span aria-hidden>{icon}</span>
    </button>
  )
}
