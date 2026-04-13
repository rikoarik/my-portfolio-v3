-- Portfolio CMS schema + RLS
-- Run in Supabase SQL editor or via CLI.

create extension if not exists "pgcrypto";

create table public.site_profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null,
  tagline text not null default '',
  location text not null default '',
  email text not null default '',
  phone text,
  github_url text,
  linkedin_url text,
  website_url text,
  cv_url text,
  locale_ui text not null default 'id',
  og_description text,
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  employment_type text,
  start_date text,
  end_date text,
  sort_order int not null default 0,
  bullets jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  period_label text,
  stack jsonb not null default '[]'::jsonb,
  bullets jsonb not null default '[]'::jsonb,
  repo_url text,
  demo_url text,
  sort_order int not null default 0,
  featured boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.skill_groups (id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  field text,
  start_date text,
  end_date text,
  gpa text,
  sort_order int not null default 0,
  bullets jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.site_profile enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;
alter table public.skill_groups enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.admin_users enable row level security;

-- Public read
create policy "Public read site_profile" on public.site_profile for select using (true);
create policy "Public read experiences" on public.experiences for select using (true);
create policy "Public read projects" on public.projects for select using (true);
create policy "Public read skill_groups" on public.skill_groups for select using (true);
create policy "Public read skills" on public.skills for select using (true);
create policy "Public read education" on public.education for select using (true);

-- Admin users table: only admins can read list (optional)
create policy "Admins read admin_users" on public.admin_users for select using (
  auth.uid() in (select user_id from public.admin_users)
);

-- Writes: admins only
create policy "Admin write site_profile" on public.site_profile for all using (
  auth.uid() in (select user_id from public.admin_users)
) with check (auth.uid() in (select user_id from public.admin_users));

create policy "Admin write experiences" on public.experiences for all using (
  auth.uid() in (select user_id from public.admin_users)
) with check (auth.uid() in (select user_id from public.admin_users));

create policy "Admin write projects" on public.projects for all using (
  auth.uid() in (select user_id from public.admin_users)
) with check (auth.uid() in (select user_id from public.admin_users));

create policy "Admin write skill_groups" on public.skill_groups for all using (
  auth.uid() in (select user_id from public.admin_users)
) with check (auth.uid() in (select user_id from public.admin_users));

create policy "Admin write skills" on public.skills for all using (
  auth.uid() in (select user_id from public.admin_users)
) with check (auth.uid() in (select user_id from public.admin_users));

create policy "Admin write education" on public.education for all using (
  auth.uid() in (select user_id from public.admin_users)
) with check (auth.uid() in (select user_id from public.admin_users));

-- Service role bypasses RLS for seed scripts
