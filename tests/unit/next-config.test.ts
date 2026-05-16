import { describe, expect, it } from 'vitest';
import { CLINICAL_LEGACY_ROUTES } from '@/lib/publicRoutes';
import nextConfig from '../../next.config';

describe('next.config', () => {
  it('redirige rutas clínicas legacy al blog', async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toBeDefined();

    const pairs = redirects!.map((r) => ({
      source: typeof r.source === 'string' ? r.source : '',
      destination: typeof r.destination === 'string' ? r.destination : '',
    }));

    for (const source of CLINICAL_LEGACY_ROUTES) {
      expect(pairs.find((p) => p.source === source)).toEqual({
        source,
        destination: '/blog',
      });
    }
  });

  it('define cabeceras de seguridad en todas las rutas', async () => {
    const headers = await nextConfig.headers?.();
    expect(headers).toBeDefined();
    const global = headers!.find((h) => h.source === '/(.*)');
    expect(global?.headers.some((h) => h.key === 'X-Frame-Options')).toBe(true);
    expect(global?.headers.some((h) => h.key === 'X-Content-Type-Options')).toBe(true);
  });
});
