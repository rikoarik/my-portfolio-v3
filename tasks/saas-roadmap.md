# SaaS Portfolio Platform — Roadmap

> Ubah repo single-tenant portfolio + CMS jadi SaaS portfolio yang jual template.
> Tanggal: 2026-06-27

## Status Sekarang

| Layer | Status | Catatan |
|-------|--------|--------|
| Content model | OK | projects, experiences, education, sections, seo, guestbook |
| CMS admin | OK | CRUD + publish/draft |
| Theming | Tipis | ~16 `landing_theme_preset` (warna CSS via `data-landing-theme`) |
| Public UI | Monolith | Satu template hardcoded: `PortfolioClient` → PastelHero + IF sections |
| Multi-tenant | Tidak ada | Satu Supabase = satu customer |
| Billing | Tidak ada | — |
| Template engine | Tidak ada | Layout/section order hardcoded |

## Gap untuk SaaS

### 1. Multi-tenancy (wajib)
- Tabel `sites` / `tenants` (user punya banyak site)
- `site_id` di semua tabel konten
- RLS per `site_id`
- Auth: owner vs visitor
- Routing: `username.app.com` atau custom domain
- Billing (Stripe), plan limits

### 2. Template vs theme preset
- **Preset warna** (sekarang) → skala ~10–50, mudah
- **Template** (layout, typography, animasi, section order) → butuh registry + renderer

"Ribuan template" realistis kalau kebanyakan **variasi parameter** (layout × font × color × density), bukan 1000 codebase React terpisah.

### 3. Template engine (inti produk)
```
site.template_id + site.template_config (JSON)
        ↓
TemplateRegistry → komponen + section schema
        ↓
PageRenderer (dynamic section list)
```

Contoh config per site:
```json
{
  "template": "minimal-grid-v2",
  "sections": ["hero", "projects", "about", "contact"],
  "tokens": { "font": "syne", "radius": "lg", "motion": "subtle" }
}
```

CMS edit konten section; template edit cara tampil + urutan.

### 4. Pisah CMS UI vs portfolio UI
- **Admin SaaS** (`/dashboard`) — shared, satu codebase (mirip sekarang)
- **Published site** — per tenant:
  - same app + middleware resolve tenant, atau
  - static export / edge per site (lebih scale)

### 5. Template marketplace (opsional, fase akhir)
- Author upload template (manifest + preview + schema)
- Review, versioning, revenue share
- Preview thumbnail sebelum apply

## Apakah "ribuan template" realistis?

| Approach | Template count | Effort |
|----------|----------------|--------|
| Color/font presets only | ~20–50 | Kecil (extend `landing-theme`) |
| Layout variants (5–10 base × options) | ratusan–ribuan kombinasi | Sedang–besar |
| 1000 fully custom React pages | 1000 | Tidak scale (maintenance nightmare) |

Industry pattern (Framer, Webflow, Carrd): sedikit base template + banyak preset + user config.

## Roadmap

### Phase 1 — Productizable single-tenant
- [ ] Abstract `PortfolioClient` → `SiteRenderer`
- [ ] Section registry (hero/projects/about pluggable)
- [ ] `site_settings.template_id` + config JSON
- [ ] 2–3 layout berbeda sebagai POC

### Phase 2 — Multi-tenant
- [ ] `sites`, `site_id` everywhere, RLS
- [ ] Subdomain routing
- [ ] Onboarding: pick template → isi CMS

### Phase 3 — Template catalog
- [ ] 5–10 base templates
- [ ] Generator: color × font × layout = banyak "template" di UI

### Phase 4 — Marketplace + billing
- [ ] Stripe integration
- [ ] Custom domain
- [ ] Analytics per site

## Estimasi Fondasi

- Backend produk: 40–50% sudah ada (data + CMS)
- Public UI: masih monolith, butuh template renderer
- Tenant model + billing + hosting: investasi terbesar

## Catatan Teknis (file terkait)

- Public UI entry: `src/app/page.tsx` → `PortfolioClient`
- Theme preset: `src/lib/theme/landing-theme.ts`
- SEO settings (tempat `template_id` nempel): `src/app/admin/dashboard/seo/page.tsx`
- Data layer: `src/lib/portfolio.ts`
- Validation: `src/lib/admin/validation.ts`
- Actions: `src/app/admin/actions.ts`
