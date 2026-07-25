import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'
import { getDiscoveryCache, setDiscoveryCache } from '$lib/server/kv.js'
export async function GET(event: RequestEvent) {
  const kwat = event.url.searchParams.get('kwat') || 'Akwa'
  const cached = await getDiscoveryCache(event, kwat)
  if (cached) return json(JSON.parse(cached), { headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=300' } })
  const platform = event.platform as any
  const db = platform?.env?.DB
  let shops: any[] = []
  if (db) {
    const { results } = await db.prepare(`SELECT id, name, slug, kwat, category FROM shops WHERE kwat = ? LIMIT 50`).bind(kwat).all()
    shops = results || []
  }
  const gated = shops.map((s: any) => ({ ...s, whatsapp: null, wa_link: null, gated: true, go_url: `/go/${s.slug}` }))
  const payload = JSON.stringify({ kwat, count: gated.length, shops: gated })
  await setDiscoveryCache(event, kwat, payload)
  return json(JSON.parse(payload), { headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=300' } })
}
