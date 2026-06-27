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
