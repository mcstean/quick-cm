// Proper KV wrapper for Cloudflare-only MVP
// Binding: CACHE id ccc2faafc57641dba1f184c29cb86137
export async function getCache(platform: any, key: string) {
  const cache = platform?.env?.CACHE
  if (!cache) return null
  return await cache.get(key)
}
export async function setCache(platform: any, key: string, value: string, ttl = 300) {
  const cache = platform?.env?.CACHE
  if (!cache) return
  await cache.put(key, value, { expirationTtl: ttl })
}
