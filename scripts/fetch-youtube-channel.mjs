import https from 'https'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import archivo from '../src/data/CMS/1_archivo.js'

const CHANNEL_ID = 'UCUlDtNhc9u11tMGBuE8bbkg'
const CHANNEL_URL = `https://www.youtube.com/@MemoriasVivasdelsur/videos`
const __dirname = dirname(fileURLToPath(import.meta.url))

function fetchText(target, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(target, { headers }, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

function decodeXml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function youtubeIdFromUrl(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '') || null
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const parts = u.pathname.split('/')
      if (parts[1] === 'shorts' && parts[2]) return parts[2]
    }
  } catch {}
  return null
}

function buildArchivoLookup(rows) {
  const map = new Map()
  for (const row of rows) {
    const id = youtubeIdFromUrl(row.url)
    if (!id) continue
    map.set(id, {
      title: row.título || row.titulo,
      year: row.fecha_registro ? String(row.fecha_registro).slice(0, 4) : '',
      category: row.tipo ? String(row.tipo) : 'audiovisual',
    })
  }
  return map
}

function parseChannelVideos(html) {
  const marker = 'var ytInitialData = '
  const start = html.indexOf(marker)
  if (start < 0) return []
  const jsonStart = start + marker.length
  let depth = 0
  let inString = false
  let escape = false
  for (let i = jsonStart; i < html.length; i += 1) {
    const ch = html[i]
    if (inString) {
      if (escape) escape = false
      else if (ch === '\\') escape = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') inString = true
    else if (ch === '{') depth += 1
    else if (ch === '}') {
      depth -= 1
      if (depth === 0) {
        const jsonText = html.slice(jsonStart, i + 1)
        const data = JSON.parse(jsonText)
        return extractTabVideos(data)
      }
    }
  }
  return []
}

function extractTabVideos(data) {
  const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs ?? []
  const videosTab = tabs.find((t) => t.tabRenderer?.content?.richGridRenderer)
    ?? tabs.find((t) => t.tabRenderer?.selected)
  const contents = videosTab?.tabRenderer?.content?.richGridRenderer?.contents ?? []

  const out = []
  for (const block of contents) {
    const item = block?.richItemRenderer?.content?.videoRenderer
      ?? block?.gridVideoRenderer
    if (!item?.videoId) continue
    out.push({
      id: item.videoId,
      title: item.title?.runs?.map((r) => r.text).join('') ?? item.title?.simpleText ?? '',
      published: item.publishedTimeText?.simpleText ?? '',
    })
  }
  return out
}

async function fetchRssVideos() {
  const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`)
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1])
  return entries.map((entry) => {
    const id = entry.match(/<yt:videoId>([^<]+)/)?.[1] ?? ''
    const title = decodeXml(entry.match(/<title>([^<]+)/)?.[1] ?? '')
    const published = entry.match(/<published>([^<]+)/)?.[1] ?? ''
    return { id, title, published, year: published.slice(0, 4) }
  })
}

const archivoLookup = buildArchivoLookup(archivo)
const html = await fetchText(CHANNEL_URL, {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'es-CR,es;q=0.9,en;q=0.8',
})

let channelVideos = parseChannelVideos(html)
if (channelVideos.length === 0) {
  channelVideos = await fetchRssVideos()
}

const byId = new Map()
for (const video of channelVideos) {
  const cms = archivoLookup.get(video.id)
  byId.set(video.id, {
    id: video.id,
    title: cms?.title || video.title,
    category: cms?.category || 'YouTube · Memorias Vivas',
    year: cms?.year || video.year || '',
    image: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${video.id}`,
  })
}

for (const [id, cms] of archivoLookup.entries()) {
  if (byId.has(id)) continue
  byId.set(id, {
    id,
    title: cms.title,
    category: cms.category || 'audiovisual',
    year: cms.year,
    image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${id}`,
  })
}

const items = [...byId.values()].sort((a, b) => {
  if (a.year !== b.year) return Number(b.year) - Number(a.year)
  return a.title.localeCompare(b.title, 'es')
})

const outPath = join(__dirname, '../src/data/documentalesYoutube.js')
const body = `/** Videos del canal https://www.youtube.com/@MemoriasVivasdelsur/videos */\nexport const DOCUMENTALES_YOUTUBE = ${JSON.stringify(items, null, 2)}\n`
writeFileSync(outPath, body, 'utf8')

console.log(`Wrote ${items.length} videos to ${outPath}`)
