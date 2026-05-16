import { describe, expect, it } from 'vitest';
import { blogPosts } from '../blogData';

describe('blogData', () => {
  it('tiene al menos un artículo', () => {
    expect(blogPosts.length).toBeGreaterThan(0);
  });

  it('slug, título y fecha únicos por entrada', () => {
    const slugs = blogPosts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const post of blogPosts) {
      expect(post.slug.trim(), post.title).not.toHaveLength(0);
      expect(post.title.trim()).not.toHaveLength(0);
      expect(post.excerpt.trim()).not.toHaveLength(0);
      expect(post.image.startsWith('/') || post.image.startsWith('http')).toBe(true);
      expect(post.category.trim()).not.toHaveLength(0);
      expect(/^\d{4}-\d{2}-\d{2}$/.test(post.date)).toBe(true);
    }
  });

  it('fecha en formato ISO yyyy-mm-dd válida', () => {
    for (const post of blogPosts) {
      const t = new Date(post.date + 'T12:00:00Z').getTime();
      expect(Number.isFinite(t)).toBe(true);
    }
  });
});
