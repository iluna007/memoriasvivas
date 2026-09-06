import pedagogiasCMS from './CMS/9_pedagogias.js'

export const PEDAGOGIAS_LICENCIA = {
  nombre: 'CC BY-NC-SA 4.0',
  nombreLargo: 'Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es',
}

const ORDEN_CATEGORIAS = [
  'Guías de taller',
  'Fichas pedagógicas',
  'Infografías',
  'Presentaciones',
  'Recursos audiovisuales',
  'Material para docentes',
]

const ICONOS_CATEGORIA = {
  'Guías de taller': '📋',
  'Fichas pedagógicas': '📝',
  Infografías: '📊',
  Presentaciones: '🖥️',
  'Recursos audiovisuales': '🎬',
  'Material para docentes': '🎓',
}

function slugCategoria(categoria) {
  return String(categoria)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Resuelve archivo_url / foto_portada:
 * - http(s)://… → enlace externo
 * - /ruta → ruta pública del sitio
 * - nombre.ext → /pedagogias/nombre.ext
 */
export function resolvePedagogiasAssetUrl(raw) {
  if (raw == null) return null
  const s = String(raw).trim()
  if (!s) return null
  if (/^https?:\/\//i.test(s)) return s
  if (s.startsWith('/')) return s
  return `/pedagogias/${s.replace(/^\.?\/*/, '')}`
}

export function isExternalPedagogiasUrl(url) {
  return Boolean(url && /^https?:\/\//i.test(url))
}

/**
 * @returns {{ key: string, categoria: string, icono: string, materiales: object[] }[]}
 */
export function buildPedagogiasPorCategoria() {
  const porCategoria = new Map()
  for (const item of pedagogiasCMS) {
    const categoria = item.categoria ?? 'Otros'
    if (!porCategoria.has(categoria)) porCategoria.set(categoria, [])
    porCategoria.get(categoria).push({
      id: item.id_material,
      titulo: item.titulo,
      descripcion: item.descripcion ?? '',
      formato: item.formato ?? '',
      url: resolvePedagogiasAssetUrl(item.archivo_url),
      foto: resolvePedagogiasAssetUrl(item.foto_portada),
      fecha: item.fecha ?? null,
      orden: item.orden ?? 0,
    })
  }

  const grupos = Array.from(porCategoria.entries()).map(([categoria, materiales]) => ({
    key: slugCategoria(categoria),
    categoria,
    icono: ICONOS_CATEGORIA[categoria] ?? '📁',
    materiales: materiales.sort((a, b) => a.orden - b.orden),
  }))

  return grupos.sort((a, b) => {
    const ia = ORDEN_CATEGORIAS.indexOf(a.categoria)
    const ib = ORDEN_CATEGORIAS.indexOf(b.categoria)
    const ra = ia === -1 ? Number.MAX_SAFE_INTEGER : ia
    const rb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib
    if (ra !== rb) return ra - rb
    return a.categoria.localeCompare(b.categoria, 'es')
  })
}

export const PEDAGOGIAS_POR_CATEGORIA = buildPedagogiasPorCategoria()
