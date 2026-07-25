export const getCache = async (platform: any, key: string) => platform?.env?.CACHE?.get(key)
export const setCache = async (platform: any, key: string, val: string, ttl=3600) => platform?.env?.CACHE?.put(key, val, {expirationTtl: ttl})
