-- Guestbook Table for public messages
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.guestbook enable row level security;

-- Policies
create policy "Guestbook is public readable" on public.guestbook 
  for select using (true);

create policy "Anyone can post a guestbook entry" on public.guestbook 
  for insert with check (true);

create policy "Admins can manage guestbook" on public.guestbook
  for all using (
    auth.uid() in (select user_id from public.admin_users)
  ) with check (
    auth.uid() in (select user_id from public.admin_users)
  );
