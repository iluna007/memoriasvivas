import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANG_KEY, idiomaDeRuta, rutaAlterna } from '../i18n/ruta'

export default function LanguageToggle({ theme }) {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const en = idiomaDeRuta(pathname) === 'en'
  const marca = en ? 'ES' : 'EN'

  const btnClass =
    theme === 'light'
      ? 'flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold tracking-wide text-zinc-700 transition-colors hover:bg-black/10 hover:text-zinc-950'
      : 'flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold tracking-wide text-white/80 transition-colors hover:bg-white/10 hover:text-white'

  function cambiar() {
    const destino = en ? 'es' : 'en'
    try {
      localStorage.setItem(LANG_KEY, destino)
    } catch {
      /* modo privado */
    }
    navigate(rutaAlterna(pathname, hash, destino))
  }

  return (
    <button
      type="button"
      onClick={cambiar}
      className={btnClass}
      aria-label={en ? t('comun.cambiarEspanol') : t('comun.cambiarIngles')}
      title={en ? t('comun.espanol') : t('comun.ingles')}
    >
      <span aria-hidden>{marca}</span>
    </button>
  )
}
