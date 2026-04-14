alter table public.seo_settings
  drop constraint if exists seo_settings_landing_theme_preset_check;

alter table public.seo_settings
  add constraint seo_settings_landing_theme_preset_check
  check (
    landing_theme_preset in (
      'ember-night',
      'forest-hearth',
      'cocoa-slate',
      'dusk-mocha',
      'sage-mist',
      'linen-dawn',
      'rose-clay',
      'ocean-paper',
      'amber-fog',
      'pine-smoke'
    )
  );

