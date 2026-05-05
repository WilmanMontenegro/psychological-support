create table if not exists public.telegram_blog_flow (
  chat_id bigint primary key,
  step text not null default 'awaiting_content'
    check (step in ('awaiting_content', 'awaiting_image')),
  draft_id uuid references public.blog_drafts (id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists telegram_blog_flow_draft_id_idx
  on public.telegram_blog_flow (draft_id)
  where draft_id is not null;
