// CAT 13 — XAF billing 30/70 +5% FX + manual BM queue — Cloudflare-only
// D1 35e5601a-3c72-4ea5-b058-d8859cebd4a1 table ad_boosters
// Never expose CAMPAY_API_KEY / MONETBIL_SECRET — only in +server.js

export type BillingSplit = {
  amount_xaf: number
  platform_fee_xaf: number
  ad_spend_target: number
  fx_buffer_applied: number
  net_ad_spend: number
}

export function calculateBilling(amount_xaf: number): BillingSplit {
  if (amount_xaf <= 0) throw new Error('amount must be >0')
  const platform_fee_xaf = Math.round(amount_xaf * 0.3) // 30%
  const ad_spend_target = amount_xaf - platform_fee_xaf // 70%
  const fx_buffer_applied = Math.round(ad_spend_target * 0.05) // 5% FX
  const net_ad_spend = ad_spend_target - fx_buffer_applied
  return { amount_xaf, platform_fee_xaf, ad_spend_target, fx_buffer_applied, net_ad_spend }
}

// Unit test — must pass: 5000 → 1500/3500/175/3325
export function testBilling(): boolean {
  const r = calculateBilling(5000)
  return r.platform_fee_xaf === 1500 && r.ad_spend_target === 3500 && r.fx_buffer_applied === 175 && r.net_ad_spend === 3325
}

export type DeploymentStatus = 'PENDING_COLLECTION' | 'PAID_MANUAL_QUEUE' | 'CAMPAIGN_LIVE' | 'FAILED'
