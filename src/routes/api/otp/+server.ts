import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'
export async function POST(event: RequestEvent) {
  const { phone, code } = await event.request.json()
  const platform = event.platform as any
  const cache = platform?.env?.CACHE
  if (phone && !code) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    if (cache) await cache.put(`otp:${phone}`, otp, { expirationTtl: 300 })
    return json({ sent: true, template: 'quickcm_otp', dev_otp: otp })
  }
  if (phone && code) {
    let valid = false
    if (cache) {
      const saved = await cache.get(`otp:${phone}`)
      valid = saved === code
    } else valid = code.length === 6
    if (valid) {
      event.cookies.set('quickcm_otp_verified', '1', { path: '/', maxAge: 60*60*24*30, httpOnly: true, sameSite: 'lax' })
      return json({ verified: true })
    }
    return json({ verified: false }, { status: 401 })
  }
  return json({ error: 'phone required' }, { status: 400 })
}
