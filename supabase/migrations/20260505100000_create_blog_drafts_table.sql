create table if not exists public.blog_drafts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text not null,
  content_raw text not null,
  category text not null,
  cover_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  source_chat_id bigint not null,
  source_message_id bigint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_drafts_source_message_unique unique (source_chat_id, source_message_id)
);

create index if not exists blog_drafts_status_created_at_idx
  on public.blog_drafts (status, created_at desc);

create index if not exists blog_drafts_slug_idx
  on public.blog_drafts (slug);
