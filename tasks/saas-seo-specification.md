# 23. SEO Specification

## Goals

- Each tenant site indexable on subdomain/custom domain
- Owner controls title, description, OG image via CMS
- Fast LCP for ranking signals
- No duplicate content between draft preview and live

## Metadata Sources

| Field | Source | Public |
|-------|--------|--------|
| `<title>` | `site_seo.title` or `{name} — Portfolio` | snapshot |
| `<meta description>` | `site_seo.description` | snapshot |
| `og:title` | same as title | snapshot |
| `og:description` | same as description | snapshot |
| `og:image` | `site_seo.og_image_url` or profile avatar | snapshot |
| `og:url` | canonical URL | computed |
| `twitter:card` | `summary_large_image` | static |
| `robots` | `index,follow` live; `noindex` preview | route-based |

## Implementation

```typescript
// src/app/(tenant)/layout.tsx or page.tsx
export async function generateMetadata(): Promise<Metadata> {
  const snapshot = await getPublishedSnapshot(siteId);
  const seo = snapshot.seo;
  return {
    title: seo.title,
    description: seo.description,
    openGraph: { ... },
    alternates: { canonical: `https://${domain}/` },
  };
}
```

## Structured Data (JSON-LD)

MVP:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "...",
  "url": "...",
  "jobTitle": "...",
  "sameAs": ["github", "linkedin"]
}
```

Post-MVP: `CreativeWork` for projects.

## Sitemap

- Route: `https://{domain}/sitemap.xml`
- MVP: single URL (one-page portfolio)
- P2: project detail pages if added

## robots.txt

```
User-agent: *
Allow: /
Sitemap: https://{domain}/sitemap.xml
```

Preview/draft host:

```
User-agent: *
Disallow: /
```

## Performance SEO

- Static/ISR for published pages
- Image optimization via `next/image`
- Font subsetting / `display: swap`
- Avoid layout shift on hero load

## Multi-Tenant SEO Isolation

- Each subdomain = separate origin → no cross-tenant canonical issues
- Custom domain: owner sets DNS; we set canonical to custom domain
- Platform marketing site separate domain

## CMS Fields (Admin SEO Page)

| Field | Type | Max |
|-------|------|-----|
| Meta title | text | 60 chars hint |
| Meta description | textarea | 160 chars hint |
| OG image | media picker | 1200×630 recommended |
| Favicon | media picker | optional |

## Acceptance

- [ ] Google Rich Results Test passes Person schema
- [ ] OG tags validate (opengraph.xyz)
- [ ] Preview not indexed
- [ ] Title/description editable and reflected after publish

---

## Detail v0.3 — SEO Fallback Rules

```txt
title empty → "{name} — {headline}"
description empty → first 160 chars from bio
canonical → primary domain
og image empty → generated/default image
preview/draft → noindex
```

### SEO QA

- Check page source.
- Check social preview.
- Check sitemap.
- Check robots.

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
