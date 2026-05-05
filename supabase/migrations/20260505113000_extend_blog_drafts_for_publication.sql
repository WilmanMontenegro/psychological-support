alter table public.blog_drafts
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists inline_image_side text check (inline_image_side in ('left', 'right')),
  add column if not exists published_at timestamptz;

create unique index if not exists blog_drafts_published_slug_unique_idx
  on public.blog_drafts (slug)
  where status = 'published';
