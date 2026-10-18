import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from '../locales/es.json'
import en from '../locales/en.json'
import { idiomaDeRuta } from './ruta'

function idiomaInicial() {
  if (typeof window === 'undefined') return 'es'
  return idiomaDeRuta(window.location.pathname)
}

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: idiomaInicial(),
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
  returnNull: false,
})

export default i18n
