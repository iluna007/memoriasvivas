/** Clave de sesión: una intro por pestaña. */
export const INTRO_KEY = 'memoriasvivas-intro-v2'

export function hasSeenIntro() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* private mode */
  }
}

/** Permite volver a mostrar la intro (p. ej. logo de la navbar). */
export function clearIntroSeen() {
  try {
    sessionStorage.removeItem(INTRO_KEY)
  } catch {
    /* private mode */
  }
}

export function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}
