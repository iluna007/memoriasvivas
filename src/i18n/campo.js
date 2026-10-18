/** Devuelve el campo en inglés si el idioma es en y el valor existe. Si no, el español. */
export function campo(item, nombre, lang) {
  if (!item) return ''
  if (lang === 'en') {
    const en = item[`${nombre}_en`] ?? item[`${nombre}En`]
    if (en != null && String(en).trim()) return String(en).trim()
  }
  const valor = item[nombre]
  return valor == null ? '' : String(valor)
}
