-- Buffer para unir textos partidos en Telegram y paso accumulating_content

alter table public.telegram_blog_flow
  drop constraint if exists telegram_blog_flow_step_check;

alter table public.telegram_blog_flow
  add column if not exists content_buffer text not null default '',
  add column if not exists buffer_message_ids bigint[] not null default '{}';

alter table public.telegram_blog_flow
  add constraint telegram_blog_flow_step_check
  check (step in ('awaiting_content', 'awaiting_image', 'accumulating_content'));
