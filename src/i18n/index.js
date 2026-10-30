import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from '../locales/es.json'
import en from '../locales/en.json'
import { LANG_KEY, idiomaDeRuta } from './ruta'

function idiomaInicial() {
  if (typeof window === 'undefined') return 'en'
  const path = window.location.pathname
  if (path === '/' || path === '') {
    try {
      if (localStorage.getItem(LANG_KEY) === 'es') return 'es'
    } catch {
      /* modo privado */
    }
    return 'en'
  }
  return idiomaDeRuta(path)
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
