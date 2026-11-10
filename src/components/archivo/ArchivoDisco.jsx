import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import disco from '../../data/archivoDisco.json'
import peso from '../../data/archivoPeso.json'

const RAIZ = '0_Memorias Vivas'

function encontrar(node, name) {
  if (node.name === name) return node
  for (const child of node.children) {
    const hit = encontrar(child, name)
    if (hit) return hit
  }
  return null
}

const memorias = encontrar(disco, RAIZ) ?? disco

function formatoPeso(bytes, lang) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i += 1
  }
  const digits = i === 0 ? 0 : i >= 4 ? 2 : n >= 100 ? 0 : 1
  const num = new Intl.NumberFormat(lang.startsWith('es') ? 'es' : 'en', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n)
  return `${num} ${units[i]}`
}

function clavePeso(camino) {
  return camino.replaceAll('┴', 'Á').replaceAll('·', 'ú')
}

function contar(node) {
  let total = node.files.length
  for (const child of node.children) total += contar(child)
  return total
}

function nombreDe(file) {
  return Array.isArray(file) ? file[0] : file
}

function buscar(node, q, ruta, out) {
  const aqui = [...ruta, node.name]
  if (ruta.length && node.name.toLowerCase().includes(q)) {
    out.push({ tipo: 'carpeta', ruta: aqui, node })
  }
  for (const file of node.files) {
    if (out.length >= 80) return
    if (nombreDe(file).toLowerCase().includes(q)) out.push({ tipo: 'archivo', ruta: aqui, file })
  }
  for (const child of node.children) {
    if (out.length >= 80) return
    buscar(child, q, aqui, out)
  }
}

function Miniaturas({ files }) {
  const fotos = files.filter(Array.isArray)
  if (!fotos.length) return null
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {fotos.slice(0, 24).map(([name, src]) => (
        <li key={src}>
          <img
            src={`/actividades-media/${src}`}
            alt={name}
            title={name}
            loading="lazy"
            className="h-16 w-16 rounded-sm object-cover sm:h-20 sm:w-20"
          />
        </li>
      ))}
    </ul>
  )
}

function ListaArchivos({ files }) {
  const { t } = useTranslation()
  const [limite, setLimite] = useState(40)
  const nombres = files.filter((file) => !Array.isArray(file))
  if (!nombres.length) return null
  const visibles = nombres.slice(0, limite)
  return (
    <div className="mt-2">
      <ul className="space-y-0.5 text-xs leading-5 text-inherit/80">
        {visibles.map((name, i) => (
          <li key={`${name}-${i}`} className="truncate">{name}</li>
        ))}
      </ul>
      {nombres.length > limite && (
        <button
          type="button"
          className="mt-1 min-h-11 text-xs underline-offset-2 hover:underline"
          onClick={() => setLimite((n) => n + 80)}
        >
          {t('archivo.disco.mas', { count: nombres.length - limite })}
        </button>
      )}
    </div>
  )
}

const TONOS = [1, 0.9, 0.78, 0.66, 0.54, 0.44, 0.34, 0.26]

function rutasAbiertas(node, ruta = '0', set = new Set()) {
  set.add(ruta)
  node.children.forEach((child, i) => rutasAbiertas(child, `${ruta}/${i}`, set))
  return set
}

function GraficaTipos() {
  const { t, i18n } = useTranslation()
  const grupos = peso.grupos

  return (
    <figure className="mt-4">
      <figcaption className="text-[10px] font-semibold uppercase tracking-wide text-inherit/50">
        {t('archivo.disco.grafica')}
      </figcaption>
      <div className="mt-2 flex h-3.5 w-full gap-px overflow-hidden rounded-full bg-current/10">
        {grupos.map((grupo, i) => (
          <div
            key={grupo.id}
            className="h-full min-w-[3px] bg-current"
            style={{ flex: `${Math.max(1, Math.round(grupo.bytes / 1e6))} 1 0`, opacity: TONOS[i] ?? 0.2 }}
            title={`${t(`archivo.disco.tipos.${grupo.id}`)} · ${formatoPeso(grupo.bytes, i18n.language)}`}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {grupos.map((grupo, i) => (
          <li key={grupo.id} className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-current" style={{ opacity: TONOS[i] ?? 0.2 }} />
            <span>{t(`archivo.disco.tipos.${grupo.id}`)}</span>
            <span className="text-inherit/70">{formatoPeso(grupo.bytes, i18n.language)}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}

function Carpeta({ node, ruta, camino, abiertas, alAlternar, enlazar = false, ultima = false }) {
  const { t, i18n } = useTranslation()
  const abierta = abiertas.has(ruta)
  const info = peso.carpetas[clavePeso(camino)]
  const total = info?.files ?? contar(node)
  const etiqueta = info
    ? `${formatoPeso(info.bytes, i18n.language)} · ${t('archivo.disco.archivos', { count: total })}`
    : t('archivo.disco.archivos', { count: total })
  const hijos = node.children.length

  return (
    <li className="relative">
      {enlazar && (
        <>
          <span aria-hidden className={`absolute left-0 w-px bg-current opacity-60 ${ultima ? 'top-0 h-[22px]' : 'inset-y-0'}`} />
          <span aria-hidden className="absolute left-0 top-[22px] h-px w-3 bg-current opacity-60" />
        </>
      )}
      <div className={enlazar ? 'pl-3' : undefined}>
        <button
          type="button"
          className="flex min-h-11 w-full items-baseline gap-2 rounded-md px-2 text-left hover:bg-white/5"
          aria-expanded={abierta}
          onClick={() => alAlternar(ruta)}
        >
          <span className="min-w-0 flex-1 truncate text-sm">{node.name}</span>
          <span className="shrink-0 text-[11px] text-inherit/50">{etiqueta}</span>
        </button>
        {abierta && (
          <div className="relative ml-3">
            {hijos > 0 && (
              <span aria-hidden className="absolute -top-[22px] left-0 h-[22px] w-px bg-current opacity-60" />
            )}
            <Miniaturas files={node.files} />
            <ListaArchivos files={node.files} />
            {hijos > 0 && (
              <ul>
                {node.children.map((child, i) => (
                  <Carpeta
                    key={`${child.name}-${i}`}
                    node={child}
                    ruta={`${ruta}/${i}`}
                    camino={`${camino}/${child.name}`}
                    abiertas={abiertas}
                    alAlternar={alAlternar}
                    enlazar
                    ultima={i === hijos - 1}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

export default function ArchivoDisco() {
  const { t } = useTranslation()
  const [consulta, setConsulta] = useState('')
  const [abiertas, setAbiertas] = useState(() => rutasAbiertas(memorias))
  const q = consulta.trim().toLowerCase()
  const resultados = useMemo(() => {
    if (q.length < 2) return null
    const out = []
    buscar(memorias, q, [], out)
    return out
  }, [q])

  return (
    <section className="mb-6 border border-zinc-500/25 sm:rounded-md">
      <div className="border-b border-zinc-500/20 px-3 py-3 sm:px-4">
        <h2 className="text-sm font-semibold">{t('archivo.disco.titulo')}</h2>
        <GraficaTipos />
        <label className="mt-3 block text-[10px] font-semibold uppercase tracking-wide text-inherit/50">
          {t('archivo.disco.buscar')}
          <input
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-500/30 bg-transparent px-3 py-2 text-sm font-normal normal-case tracking-normal text-inherit"
            type="search"
          />
        </label>
      </div>

      {resultados ? (
        <ul className="max-h-[32rem] overflow-y-auto px-2 py-2">
          {resultados.length === 0 && (
            <li className="px-2 py-3 text-sm text-inherit/60">{t('archivo.disco.sinResultados')}</li>
          )}
          {resultados.map((item, i) => {
            const nombre = item.tipo === 'carpeta' ? item.node.name : nombreDe(item.file)
            const src = Array.isArray(item.file) ? item.file[1] : null
            return (
              <li key={`${item.ruta.join('/')}/${nombre}/${i}`} className="flex items-center gap-2 px-2 py-1.5">
                {src && (
                  <img src={`/actividades-media/${src}`} alt="" className="h-10 w-10 shrink-0 rounded-sm object-cover" />
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm">{nombre}</span>
                  <span className="block truncate text-[11px] text-inherit/50">{item.ruta.join(' / ')}</span>
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <div>
          <div className="flex justify-end px-2 pt-1">
            <button
              type="button"
              className="min-h-11 px-2 text-xs underline-offset-2 hover:underline"
              onClick={() => setAbiertas((prev) => (prev.size ? new Set() : rutasAbiertas(memorias)))}
            >
              {abiertas.size ? t('archivo.disco.colapsar') : t('archivo.disco.abrir')}
            </button>
          </div>
          <ul className="pb-1">
            <Carpeta node={memorias} ruta="0" camino={RAIZ} abiertas={abiertas} alAlternar={(ruta) => {
              setAbiertas((prev) => {
                const next = new Set(prev)
                if (next.has(ruta)) next.delete(ruta)
                else next.add(ruta)
                return next
              })
            }} />
          </ul>
        </div>
      )}
    </section>
  )
}
