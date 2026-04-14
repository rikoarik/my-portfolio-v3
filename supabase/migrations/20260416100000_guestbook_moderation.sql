-- Guestbook moderation: add status and tighten public read policy

alter table public.guestbook
  add column if not exists status text not null default 'pending';

alter table public.guestbook
  drop constraint if exists guestbook_status_check;

alter table public.guestbook
  add constraint guestbook_status_check
  check (status in ('pending', 'approved', 'hidden'));

create index if not exists guestbook_status_created_idx
  on public.guestbook (status, created_at desc);

drop policy if exists "Guestbook is public readable" on public.guestbook;

create policy "Guestbook approved is public readable" on public.guestbook
  for select using (
    status = 'approved'
    or auth.uid() in (select user_id from public.admin_users)
  );
