/**
 * Árbol de actividades listo para la línea de tiempo.
 * El año sale de `fecha` (YYYY-MM-DD). `anio` del CMS no se usa: a veces no coincide.
 * `fecha_registro` de los relatos es otra cosa y no entra aquí.
 */
import actividades from './CMS/actividades.js'
import medios from './CMS/medios.js'
import territorio from './CMS/territorio.js'
import entidades from './CMS/8_comunidad_entidades.json'
import archivo from './CMS/1_archivo.js'

/** Videos y PDFs no se publican hasta tener una URL externa. Pasar a true cuando existan. */
export const MEDIOS_EXTERNOS_ACTIVOS = false

const TITULO_PREFIJO = /^[A-Z]\d+_\s*/

function texto(value) {
  if (value == null) return null
  const s = String(value).trim()
  return s || null
}

function numero(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (value == null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function fechaIso(value) {
  const s = texto(value)
  return s
}

function anioDesdeFecha(fecha) {
  const m = String(fecha ?? '').match(/^(\d{4})/)
  return m ? Number(m[1]) : null
}

/** "T2;T3" o "SS; EM" → códigos sin vacíos. */
function listaCodigos(value) {
  if (value == null) return []
  return String(value)
    .split(';')
    .flatMap((parte) => parte.split(','))
    .map((s) => s.trim())
    .filter(Boolean)
}

function tituloLimpio(value) {
  const s = texto(value)
  if (!s) return ''
  return s.replace(TITULO_PREFIJO, '').trim()
}

function padreId(value) {
  if (value == null) return null
  const s = String(value).trim()
  return s || null
}

const territorioPorId = new Map(territorio.map((t) => [t.id_territorio, t.nombre]))
const entidadPorCodigo = new Map(entidades.map((e) => [e.codigo, e.nombre]))
const relatoPorId = new Map(
  archivo.filter((r) => r.id_relato).map((r) => [r.id_relato, r])
)

function resolverTerritorios(codigos) {
  return codigos.map((codigo) => ({
    id: codigo,
    nombre: territorioPorId.get(codigo) || codigo,
  }))
}

function resolverPersonas(codigos) {
  return codigos.map((codigo) => ({
    codigo,
    nombre: entidadPorCodigo.get(codigo) || entidadPorCodigo.get(codigo.toUpperCase()) || codigo,
  }))
}

function normalizarMedio(m) {
  const archivoWeb = texto(m.archivo_web)
  if (!archivoWeb) return null
  const tipo = texto(m.tipo)?.toLowerCase() || 'foto'
  return {
    id: m.id_medio,
    tipo,
    pie: texto(m.pie_de_foto),
    pie_en: texto(m.pie_de_foto_en),
    credito: texto(m.credito),
    archivoWeb,
    archivoMiniatura: texto(m.archivo_miniatura),
    ancho: numero(m.ancho),
    alto: numero(m.alto),
    orden: numero(m.orden) ?? 0,
    esPortada: m.es_portada === true,
  }
}

function mediosPorActividad() {
  const map = new Map()
  const porId = new Map()
  for (const raw of medios) {
    if (raw.visible !== true) continue
    const tipo = texto(raw.tipo)?.toLowerCase() || 'foto'
    if (!MEDIOS_EXTERNOS_ACTIVOS && (tipo === 'video' || tipo === 'pdf')) continue
    const medio = normalizarMedio(raw)
    if (!medio) continue
    porId.set(medio.id, medio)
    const lista = map.get(raw.id_actividades) || []
    lista.push(medio)
    map.set(raw.id_actividades, lista)
  }
  for (const lista of map.values()) {
    lista.sort((a, b) => a.orden - b.orden)
  }
  return { map, porId }
}

function compararHijos(a, b) {
  const fa = a.fecha || '9999-12-31'
  const fb = b.fecha || '9999-12-31'
  if (fa !== fb) return fa < fb ? -1 : 1
  return a.orden - b.orden
}

/** Lo más reciente arriba. Sin fecha, al final. */
function compararRaices(a, b) {
  if (!a.fecha && !b.fecha) return a.orden - b.orden
  if (!a.fecha) return 1
  if (!b.fecha) return -1
  if (a.fecha !== b.fecha) return a.fecha < b.fecha ? 1 : -1
  return b.orden - a.orden
}

function pickPortada(nodo, porId) {
  const cubierta = nodo.fotoPortadaId ? porId.get(nodo.fotoPortadaId) : null
  if (cubierta && cubierta.tipo === 'foto') return cubierta
  const propia = nodo.medios.find((m) => m.tipo === 'foto')
  if (propia) return propia
  for (const hijo of nodo.hijos) {
    if (hijo.portada) return hijo.portada
  }
  return null
}

function contar(nodo) {
  const propio = { fotos: 0, videos: 0, pdfs: 0 }
  for (const m of nodo.medios) {
    if (m.tipo === 'foto') propio.fotos += 1
    else if (m.tipo === 'video') propio.videos += 1
    else if (m.tipo === 'pdf') propio.pdfs += 1
  }
  const total = { ...propio }
  for (const hijo of nodo.hijos) {
    total.fotos += hijo.conteo.fotos
    total.videos += hijo.conteo.videos
    total.pdfs += hijo.conteo.pdfs
  }
  nodo.conteoPropio = propio
  nodo.conteo = total
}

function cerrarNodo(nodo, porId, seen) {
  if (seen.has(nodo.id)) return
  seen.add(nodo.id)
  for (const hijo of nodo.hijos) cerrarNodo(hijo, porId, seen)
  nodo.portada = pickPortada(nodo, porId)
  contar(nodo)
}

function construirArbol() {
  const { map: mediosMap, porId } = mediosPorActividad()
  const filas = []

  for (const raw of actividades) {
    if (raw.visible !== true) continue
    const titulo = tituloLimpio(raw.titulo)
    if (!titulo) continue
    const fecha = fechaIso(raw.fecha)
    const idRelato = texto(raw.id_relato)
    const relato = idRelato ? relatoPorId.get(idRelato) : null
    filas.push({
      id: raw.id_actividades,
      idPadre: padreId(raw.id_padre),
      categoria: texto(raw.categoria),
      titulo,
      titulo_en: texto(raw.titulo_en),
      descripcion: texto(raw.descripcion),
      descripcion_en: texto(raw.descripcion_en),
      fecha,
      fechaFin: fechaIso(raw.fecha_fin),
      anio: anioDesdeFecha(fecha),
      orden: numero(raw.orden) ?? 0,
      territorios: resolverTerritorios(listaCodigos(raw.territorio)),
      personas: resolverPersonas(listaCodigos(raw.personas)),
      relato: relato
        ? { id: relato.id_relato, titulo: texto(relato['título'] ?? relato.titulo) }
        : null,
      fotoPortadaId: texto(raw.foto_portada),
      medios: mediosMap.get(raw.id_actividades) || [],
      hijos: [],
    })
  }

  const porActividad = new Map(filas.map((n) => [n.id, n]))
  const raices = []

  for (const nodo of filas) {
    const padre = nodo.idPadre ? porActividad.get(nodo.idPadre) : null
    if (padre && padre !== nodo) padre.hijos.push(nodo)
    else raices.push(nodo)
  }

  const ordenar = (nodo) => {
    nodo.hijos.sort(compararHijos)
    nodo.hijos.forEach(ordenar)
  }
  raices.forEach(ordenar)
  raices.sort(compararRaices)
  raices.forEach((nodo) => cerrarNodo(nodo, porId, new Set()))
  return raices
}

export const ACTIVIDADES_RAICES = construirArbol()

function caminar(nodo, fn) {
  fn(nodo)
  nodo.hijos.forEach((hijo) => caminar(hijo, fn))
}

function arbolTiene(nodo, pred) {
  if (pred(nodo)) return true
  return nodo.hijos.some((hijo) => arbolTiene(hijo, pred))
}

export function facetasDe(raices) {
  const anios = [...new Set(raices.map((r) => r.anio).filter((a) => a != null))].sort((a, b) => b - a)
  const categorias = []
  const territorios = []
  const seenC = new Set()
  const seenT = new Set()
  for (const raiz of raices) {
    caminar(raiz, (nodo) => {
      if (nodo.categoria && !seenC.has(nodo.categoria)) {
        seenC.add(nodo.categoria)
        categorias.push(nodo.categoria)
      }
      for (const t of nodo.territorios) {
        if (!seenT.has(t.id)) {
          seenT.add(t.id)
          territorios.push(t)
        }
      }
    })
  }
  categorias.sort((a, b) => a.localeCompare(b, 'es'))
  territorios.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  return { anios, categorias, territorios }
}

export const FACETAS_ACTIVIDADES = facetasDe(ACTIVIDADES_RAICES)

/**
 * @param {object} nodo raíz
 * @param {{ anio?: string, categoria?: string, territorio?: string }} filtros
 */
export function raizCoincide(nodo, filtros) {
  const anio = filtros.anio || ''
  const categoria = filtros.categoria || ''
  const territorioId = filtros.territorio || ''
  if (anio && String(nodo.anio ?? '') !== String(anio)) return false
  if (categoria && !arbolTiene(nodo, (n) => n.categoria === categoria)) return false
  if (territorioId && !arbolTiene(nodo, (n) => n.territorios.some((t) => t.id === territorioId))) return false
  return true
}

export function agruparRaicesPorAnio(raices) {
  const grupos = []
  for (const nodo of raices) {
    const key = nodo.anio == null ? 'sin-fecha' : String(nodo.anio)
    const ultimo = grupos[grupos.length - 1]
    if (!ultimo || ultimo.key !== key) {
      grupos.push({
        key,
        etiqueta: nodo.anio == null ? 'Sin fecha' : String(nodo.anio),
        items: [nodo],
      })
    } else {
      ultimo.items.push(nodo)
    }
  }
  return grupos
}
