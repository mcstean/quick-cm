import type { RequestEvent } from '@sveltejs/kit';

export async function getCache(event: RequestEvent, key: string): Promise<string | null> {
  try {
    const platform = event.platform as any;
    const cache = platform?.env?.CACHE;
    if (!cache) return null;
    return await cache.get(key);
  } catch {
    return null;
  }
}

export async function setCache(event: RequestEvent, key: string, value: string, ttlSeconds = 300): Promise<void> {
  try {
    const platform = event.platform as any;
    const cache = platform?.env?.CACHE;
    if (!cache) return;
    await cache.put(key, value, { expirationTtl: ttlSeconds });
  } catch {}
}

export async function getDiscoveryCache(event: RequestEvent, kwat: string) {
  return getCache(event, `discovery:${kwat.toLowerCase()}`);
}
export async function setDiscoveryCache(event: RequestEvent, kwat: string, data: string) {
  return setCache(event, `discovery:${kwat.toLowerCase()}`, data, 300);
}
