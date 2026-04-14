alter table public.seo_settings
  add column if not exists landing_theme_preset text not null default 'ember-night';

alter table public.seo_settings
  drop constraint if exists seo_settings_landing_theme_preset_check;

alter table public.seo_settings
  add constraint seo_settings_landing_theme_preset_check
  check (landing_theme_preset in ('ember-night', 'forest-hearth', 'cocoa-slate'));
