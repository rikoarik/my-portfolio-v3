-- Full CMS foundation: publication, sections, media, seo, moderation metadata

alter table public.projects
  add column if not exists status text not null default 'published',
  add column if not exists published_at timestamptz,
  add column if not exists updated_by uuid references auth.users (id);

alter table public.projects
  drop constraint if exists projects_status_check;

alter table public.projects
  add constraint projects_status_check check (status in ('draft', 'published'));

alter table public.experiences
  add column if not exists status text not null default 'published',
  add column if not exists published_at timestamptz,
  add column if not exists updated_by uuid references auth.users (id);

alter table public.experiences
  drop constraint if exists experiences_status_check;

alter table public.experiences
  add constraint experiences_status_check check (status in ('draft', 'published'));

alter table public.guestbook
  add column if not exists moderated_by uuid references auth.users (id),
  add column if not exists moderated_at timestamptz,
  add column if not exists moderation_note text;

create table if not exists public.section_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text,
  subtitle text,
  body text,
  meta jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  published_at timestamptz,
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now(),
  check (status in ('draft', 'published'))
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'portfolio-media',
  path text not null unique,
  public_url text not null,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  alt text,
  caption text,
  uploaded_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text not null,
  title_template text not null default '%s — Portfolio',
  default_description text,
  default_og_image_url text,
  default_robots text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  published_at timestamptz,
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now(),
  check (status in ('draft', 'published'))
);

create table if not exists public.seo_pages (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  title text,
  description text,
  canonical_url text,
  og_image_url text,
  robots text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  published_at timestamptz,
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now(),
  check (status in ('draft', 'published'))
);

create index if not exists projects_status_sort_idx
  on public.projects (status, sort_order asc);

create index if not exists experiences_status_sort_idx
  on public.experiences (status, sort_order asc);

create index if not exists section_content_status_idx
  on public.section_content (status, section_key);

create index if not exists seo_pages_status_idx
  on public.seo_pages (status, page_key);

alter table public.section_content enable row level security;
alter table public.media_assets enable row level security;
alter table public.seo_settings enable row level security;
alter table public.seo_pages enable row level security;

create policy "Public read published section_content" on public.section_content
  for select using (
    status = 'published'
    or auth.uid() in (select user_id from public.admin_users)
  );

create policy "Public read published seo_settings" on public.seo_settings
  for select using (
    status = 'published'
    or auth.uid() in (select user_id from public.admin_users)
  );

create policy "Public read published seo_pages" on public.seo_pages
  for select using (
    status = 'published'
    or auth.uid() in (select user_id from public.admin_users)
  );

create policy "Public read media assets" on public.media_assets
  for select using (true);

create policy "Admin write section_content" on public.section_content for all using (
  auth.uid() in (select user_id from public.admin_users)
) with check (auth.uid() in (select user_id from public.admin_users));

create policy "Admin write media_assets" on public.media_assets for all using (
  auth.uid() in (select user_id from public.admin_users)
) with check (auth.uid() in (select user_id from public.admin_users));

create policy "Admin write seo_settings" on public.seo_settings for all using (
  auth.uid() in (select user_id from public.admin_users)
) with check (auth.uid() in (select user_id from public.admin_users));

create policy "Admin write seo_pages" on public.seo_pages for all using (
  auth.uid() in (select user_id from public.admin_users)
) with check (auth.uid() in (select user_id from public.admin_users));
