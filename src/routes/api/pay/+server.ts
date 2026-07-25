import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'
import { calculateBilling } from '$lib/server/billing.js'

// POST /api/pay — creates ad_booster in PENDING_COLLECTION, then MoMo
// Secrets from platform.env — NEVER in +page.svelte
export async function POST(event: RequestEvent) {
  try {
    const { amount_xaf, merchant_id } = await event.request.json()
    if (!amount_xaf || !merchant_id) return json({ error: 'amount_xaf and merchant_id required' }, { status: 400 })

    const split = calculateBilling(Number(amount_xaf))
    const platform = event.platform as any
    const db = platform?.env?.DB
    const campayKey = platform?.env?.CAMPAY_API_KEY
    const monetbilSecret = platform?.env?.MONETBIL_SECRET

    // D1 insert — ad_boosters V2 with deployment_status
    const id = `boost_${Date.now()}_${Math.random().toString(36).slice(2,8)}`
    if (db) {
      await db.prepare(
        `INSERT INTO ad_boosters (id, merchant_id, amount_xaf, ad_spend_target, platform_fee_xaf, fx_buffer_applied, deployment_status) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(id, merchant_id, split.amount_xaf, split.ad_spend_target, split.platform_fee_xaf, split.fx_buffer_applied, 'PENDING_COLLECTION').run()
    }

    // MoMo init — secrets stay server-side
    // Placeholder — real Campay/Monetbil call uses campayKey/monetbilSecret from .dev.vars
    const momoRef = `momo_${id}`

    return json({
      id,
      ...split,
      deployment_status: 'PENDING_COLLECTION',
      momo_payment_reference: momoRef,
      secrets_used: !!(campayKey || monetbilSecret) ? 'server-only' : 'dev-placeholder',
      unit_test_5000: split.amount_xaf === 5000 ? { expect: '1500/3500/175/3325', got: `${split.platform_fee_xaf}/${split.ad_spend_target}/${split.fx_buffer_applied}/${split.net_ad_spend}` } : undefined
    })
  } catch (e: any) {
    return json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  const { testBilling } = await import('$lib/server/billing.js')
  return json({ unit_test_5000_pass: testBilling(), expected: '5000→1500/3500/175/3325' })
}
