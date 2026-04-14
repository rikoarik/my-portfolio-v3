-- Optional hero image for project cards / modals
alter table public.projects add column if not exists cover_url text;
