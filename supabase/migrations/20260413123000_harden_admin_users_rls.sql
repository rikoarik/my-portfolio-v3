-- Harden admin_users: no self-promotion via INSERT without existing admin

drop policy if exists "Admins read admin_users" on public.admin_users;

create policy "Admins select admin_users" on public.admin_users
  for select
  using (auth.uid() in (select user_id from public.admin_users));

create policy "Admins insert admin_users" on public.admin_users
  for insert
  with check (auth.uid() in (select user_id from public.admin_users));

create policy "Admins update admin_users" on public.admin_users
  for update
  using (auth.uid() in (select user_id from public.admin_users))
  with check (auth.uid() in (select user_id from public.admin_users));

create policy "Admins delete admin_users" on public.admin_users
  for delete
  using (auth.uid() in (select user_id from public.admin_users));
