import { getStore } from '@netlify/blobs'

const STORE = 'memoriasvivas-site'
const KEY = 'visitor-total'

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

/** Incrementa y devuelve el total de visitas (persistente con Netlify Blobs). */
export default async function handler() {
  try {
    const store = getStore(STORE)
    let current = await store.get(KEY, { type: 'json' })
    if (typeof current !== 'number' || Number.isNaN(current) || current < 0) {
      current = 0
    }
    const next = current + 1
    await store.setJSON(KEY, next)
    return new Response(JSON.stringify({ count: next }), { status: 200, headers: jsonHeaders })
  } catch (err) {
    console.error('[visitor-count]', err)
    return new Response(JSON.stringify({ count: null, error: 'unavailable' }), {
      status: 200,
      headers: jsonHeaders,
    })
  }
}
