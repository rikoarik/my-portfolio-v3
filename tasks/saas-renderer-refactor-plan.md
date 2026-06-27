# 10. Renderer Refactor Plan

## Current State

`PortfolioClient` hardcodes section order:

```tsx
<IFProofStrip />
<IFProjectsSection />
<IFAboutSection />
<IFCareerSection />
<IFGuestbookSection />
```

File: `src/components/portfolio/PortfolioClient.tsx`

## Target State

```tsx
export function SiteRenderer({ site }: { site: PublishedSitePayload }) {
  const template = getTemplate(site.templateId);
  return (
    <TemplateProvider template={template} theme={site.themeConfig}>
      <main data-template={site.templateId}>
        {site.sections
          .filter((s) => s.isEnabled)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
      </main>
    </TemplateProvider>
  );
}
```

## Migration Steps

### Step 1 — Registry scaffolding (no visual change)

- [ ] Create `src/lib/sections/registry.ts`
- [ ] Create `src/components/site-renderer/SectionRenderer.tsx`
- [ ] Register existing IF sections with type keys matching current order
- [ ] Wrap `PortfolioClient` body with `SiteRenderer` feeding **static config** mirroring today

### Step 2 — Config-driven order

- [ ] Add local `siteConfig.json` or read from `sections` table (single tenant)
- [ ] Support hide/show section via `is_enabled`
- [ ] Support reorder via `sort_order`

### Step 3 — Template provider

- [ ] Create `TemplateProvider` applying `data-landing-theme` from config
- [ ] Map `theme_config.preset` → existing landing theme presets

### Step 4 — Wire publish snapshot

- [ ] `SiteRenderer` accepts `PublishedSitePayload` from snapshot
- [ ] Remove direct `getPortfolio()` on public path (post tenant)

## Section Registry (initial)

| type | Component | Variants |
|------|-----------|----------|
| `hero` | `PastelHero` | default |
| `proof` | `IFProofStrip` | default |
| `projects` | `IFProjectsSection` | accordion, grid (later) |
| `about` | `IFAboutSection` | default |
| `career` | `IFCareerSection` | default |
| `guestbook` | `IFGuestbookSection` | default |
| `contact` | `CinematicFooter` / contact block | default |

## Risk Mitigation

- Visual regression: screenshot compare before/after Step 1
- Feature flag `USE_SITE_RENDERER` env for rollback
- Keep `PortfolioClient` as thin wrapper until stable

## Acceptance

- [ ] Existing portfolio pixel-parity (allow minor spacing diffs)
- [ ] Reorder sections via config without code deploy
- [ ] Unknown section type → skip + log (no crash)

## Timeline

1–2 weeks (Phase 1)

---

## Detail v0.3 — Refactor Step-by-Step

### Step 1

Buat types:

- `PublishedSite`
- `PublishedSection`
- `TemplateManifest`
- `ThemeConfig`

### Step 2

Buat `sectionRegistry`.

### Step 3

Buat `templateRegistry`.

### Step 4

Buat `SectionRenderer`.

### Step 5

Buat `SiteRenderer`.

### Step 6

Wrap section existing satu per satu.

### Step 7

Ganti public entry dari `PortfolioClient` ke `SiteRenderer`.

### Safety Rule

Jangan ubah DB dulu pada phase renderer. Biar kalau UI rusak, rollback gampang.

---

## Appendix v0.3 — Detail Implementasi Tambahan

### Tujuan Operasional

Dokumen ini tidak hanya menjadi catatan konsep, tapi juga menjadi pegangan saat implementasi. Setiap keputusan di dalam dokumen harus bisa diturunkan menjadi task engineering, skenario QA, dan acceptance criteria.

### Prinsip Umum

- Gunakan pendekatan incremental, bukan rewrite total.
- Semua fitur yang menyentuh data user wajib scoped by `site_id`.
- Semua akses admin wajib melewati auth dan ownership guard.
- Public site hanya membaca data published, bukan draft.
- Jika ada konflik antara kecepatan rilis dan keamanan tenant, keamanan tenant harus diprioritaskan.
- Setiap perubahan besar harus bisa dirollback.

### Checklist Review

- [ ] Scope dokumen sudah jelas.
- [ ] Out of scope sudah ditulis agar tidak melebar.
- [ ] Dependency dengan dokumen lain sudah jelas.
- [ ] Ada acceptance criteria.
- [ ] Ada risiko dan mitigasi.
- [ ] Ada checklist QA atau validasi.
- [ ] Naming konsisten: `platform.com`, `site_id`, `organization_id`, `site_publish_snapshots`.
- [ ] Tidak ada keputusan yang bertentangan dengan PRD.

### Definition of Done

Dokumen dianggap siap dipakai jika engineer bisa membaca dokumen ini dan tahu:

1. Apa yang harus dibuat.
2. File/area mana yang kemungkinan berubah.
3. Data apa yang dibutuhkan.
4. Risiko apa yang harus dijaga.
5. Bagaimana cara mengetes hasilnya.
