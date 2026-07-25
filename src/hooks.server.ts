import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const host = event.request.headers.get('host') || '';
  const url = new URL(event.request.url);
  
  let tenantId = 'default';
  let territory = url.searchParams.get('kwat') || event.request.headers.get('x-quickcm-territory') || 'Akwa';

  try {
    const platform = event.platform as any;
    const cache = platform?.env?.CACHE;
    if (cache) {
      const cachedTenant = await cache.get(`tenant:${host}`);
      if (cachedTenant) tenantId = cachedTenant;
    }
  } catch {}

  event.locals.tenantId = tenantId;
  event.locals.territory = territory;
  event.locals.kwat = territory;

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html
  });

  response.headers.set('x-quickcm-territory', territory);
  response.headers.set('x-quickcm-tenant', tenantId);

  return response;
};
