-- Extend projects for case studies + tagging

alter table public.projects
add column if not exists tags jsonb not null default '[]'::jsonb;

alter table public.projects
add column if not exists case_study jsonb;

