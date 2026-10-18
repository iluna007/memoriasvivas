import { useLocation, useNavigate } from 'react-router-dom'
import IntroSplash from '../components/IntroSplash'
import { idiomaDeRuta, ruta } from '../i18n/ruta'

/** Home (`/` o `/en`): intro a pantalla completa sin layout ni Canvas. */
export default function Intro() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <IntroSplash
      onDismiss={() => {
        navigate(ruta('/constelaciones', idiomaDeRuta(pathname)), { replace: true })
      }}
    />
  )
}
