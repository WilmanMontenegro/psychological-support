alter table public.blog_drafts
  drop constraint if exists blog_drafts_status_check;

alter table public.blog_drafts
  add constraint blog_drafts_status_check
  check (status in ('pending', 'approved', 'rejected', 'published'));
