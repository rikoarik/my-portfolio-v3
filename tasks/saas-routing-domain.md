# 12. Routing & Domain Specification

## Hostname Types

| Type | Example | MVP |
|------|---------|-----|
| Marketing | `platform.com` | Landing + auth |
| App dashboard | `platform.com/admin` | CMS |
| Subdomain tenant | `arik.platform.com` | Yes |
| Custom domain | `arikriko.com` | Post-MVP |

## Middleware Logic

```ts
export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  
  if (isAppHost(host)) {
    return NextResponse.next(); // marketing + admin
  }

  const site = await resolveSiteByDomain(host);
  if (!site) return NextResponse.rewrite(new URL('/404-site', request.url));
  if (site.status === 'suspended') return NextResponse.rewrite(new URL('/suspended', request.url));

  const headers = new Headers(request.headers);
  headers.set('x-site-id', site.id);
  headers.set('x-site-domain', host);
  return NextResponse.next({ request: { headers } });
}
```

## `site_domains` Table

| column | notes |
|--------|-------|
| `domain` | Full hostname, unique |
| `type` | `subdomain` \| `custom` |
| `status` | `pending` → `verified` |
| `verification_token` | DNS TXT for custom |

## Subdomain Rules

- Slug: `[a-z0-9-]`, 3–32 chars
- Reserved: `www`, `admin`, `api`, `app`, `staging`
- Auto-create on site creation: `{slug}.{APP_DOMAIN}`

## Custom Domain (Post-MVP)

1. User adds domain in admin
2. Show DNS instructions (CNAME → `cname.platform.com`)
3. Verification job checks DNS
4. Set `status = verified`
5. Canonical URL = custom domain when active

## Canonical / SEO

When both subdomain + custom active:

```txt
canonical = https://custom-domain.com
```

Subdomain redirects 301 or serves with canonical tag.

## Error Pages

| Route | When |
|-------|------|
| `/404-site` | Unknown domain |
| `/suspended` | Site suspended |
| `/coming-soon` | Published but empty snapshot |

## Env Vars

```env
APP_DOMAIN=platform.com
NEXT_PUBLIC_APP_URL=https://platform.com
```

---

## Detail v0.3 — Routing Resolver

### Reserved Slugs

- www
- app
- admin
- api
- docs
- status
- support
- billing
- assets
- static
- cdn
- preview
- mail
- blog

### Resolver Output

```ts
type ResolvedRoute =
  | { type: 'root' }
  | { type: 'site'; siteId: string }
  | { type: 'not_found' }
  | { type: 'suspended' }
  | { type: 'not_published' };
```

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
