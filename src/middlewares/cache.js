const cache = new Map();
const cacheMiddleware = (ttl=30000) => (req,res,next)=>{
  if(req.method!=='GET') return next();
  const key = req.originalUrl;
  const hit = cache.get(key);
  if(hit && Date.now()-hit.ts < ttl){ return res.json(hit.data); }
  const origJson = res.json.bind(res);
  res.json = (data)=>{ cache.set(key, { data, ts: Date.now() }); return origJson(data); };
  next();
};
const clearCache = (prefix='/api')=>{ for(const k of cache.keys()) if(k.startsWith(prefix)) cache.delete(k); };
module.exports = { cacheMiddleware, clearCache };
