import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { blogPosts } from '@/lib/blogData';
import { PUBLIC_STATIC_ROUTES } from '@/lib/publicRoutes';

describe('sitemap', () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com';

  it('incluye /eventos y rutas públicas clave', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    for (const path of PUBLIC_STATIC_ROUTES) {
      expect(urls).toContain(`${baseUrl}${path === '/' ? '' : path}`);
    }
    expect(urls.every((u) => u.startsWith('http'))).toBe(true);
  });

  it('incluye cada slug de blogData', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    for (const post of blogPosts) {
      expect(urls).toContain(`${baseUrl}/blog/${post.slug}`);
    }
  });
});
