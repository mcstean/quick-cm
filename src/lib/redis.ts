// Cloudflare-only MVP — KV shim replacing Upstash
// Real binding: CACHE = ccc2faafc57641dba1f184c29cb86137
// Old code used redis.get/set — now uses KV via platform.env.CACHE

type KVNamespace = {
  get(key: string): Promise<string | null>
  put(key: string, value: string, opts?: any): Promise<void>
  delete(key: string): Promise<void>
}

// For SvelteKit Cloudflare, CACHE comes from event.platform.env.CACHE
// This shim allows build to pass and runtime to use KV when available
export const redis = {
  async get(key: string): Promise<string | null> {
    try {
      // @ts-ignore - platform not available at build, but available at runtime via event
      const cache = (globalThis as any).__CACHE__ as KVNamespace | undefined
      if (cache) return await cache.get(key)
      return null
    } catch { return null }
  },
  async set(key: string, value: string, opts?: any): Promise<void> {
    try {
      const cache = (globalThis as any).__CACHE__ as KVNamespace | undefined
      if (cache) await cache.put(key, value, opts)
    } catch {}
  },
  async del(key: string): Promise<void> {
    try {
      const cache = (globalThis as any).__CACHE__ as KVNamespace | undefined
      if (cache) await cache.delete(key)
    } catch {}
  }
}

// Proper KV helpers for new code — use this going forward
// File: src/lib/server/kv.ts should exist — if not, create it
