import { useNavigate } from 'react-router-dom'
import IntroSplash from '../components/IntroSplash'

/** Home (`/`): intro a pantalla completa sin layout ni Canvas. */
export default function Intro() {
  const navigate = useNavigate()

  return (
    <IntroSplash
      onDismiss={() => {
        navigate('/constelaciones', { replace: true })
      }}
    />
  )
}
