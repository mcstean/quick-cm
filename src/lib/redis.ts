type KVNamespace = {
  get(key: string): Promise<string | null>
  put(key: string, value: string, opts?: any): Promise<void>
  delete(key: string): Promise<void>
}
export const redis = {
  async get(key: string): Promise<string | null> {
    try {
      const cache = (globalThis as any).__CACHE__ as KVNamespace | undefined
      if (cache) return await cache.get(key)
      return null
    } catch { return null }
  },
  async set(key: string, value: string): Promise<void> {
    try {
      const cache = (globalThis as any).__CACHE__ as KVNamespace | undefined
      if (cache) await cache.put(key, value)
    } catch {}
  },
  async del(key: string): Promise<void> {
    try {
      const cache = (globalThis as any).__CACHE__ as KVNamespace | undefined
      if (cache) await cache.delete(key)
    } catch {}
  }
}
