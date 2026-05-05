import { createAdminClient } from '@/lib/supabase-admin';

export type PublishedBlogDraft = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_raw: string;
  category: string;
  cover_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  inline_image_side: 'left' | 'right' | null;
  published_at: string | null;
  created_at: string;
};

type BlogCardDraft = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
};

function toYyyyMmDd(value: string): string {
  return value.slice(0, 10);
}

export async function getPublishedDraftBySlug(slug: string): Promise<PublishedBlogDraft | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('blog_drafts')
    .select(
      'id, slug, title, excerpt, content_raw, category, cover_url, seo_title, seo_description, inline_image_side, published_at, created_at'
    )
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle<PublishedBlogDraft>();

  if (error || !data) return null;
  return data;
}

export async function getPublishedDraftCards(): Promise<BlogCardDraft[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('blog_drafts')
    .select('slug, title, excerpt, category, cover_url, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((item) => ({
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    category: item.category,
    image: item.cover_url || '/images/blog/pensamientos-intrusivos.jpg',
    date: toYyyyMmDd(item.published_at || item.created_at),
  }));
}
