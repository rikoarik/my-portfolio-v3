# 8. Multi-Tenant Design Document

## Tenant Model

```txt
User (auth.users)
  └── Organization (billing + team boundary)
        └── Site (portfolio instance)
              └── Content (projects, sections, …)
```

- **Organization** = account / billing unit.
- **Site** = one published portfolio (MVP: 1 site per free user).
- **Slug** unique per org; **subdomain** = `{slug}.{APP_DOMAIN}`.

## Isolation Layers

| Layer | Mechanism |
|-------|-----------|
| Database | `site_id` FK + RLS |
| Application | Server action ownership check |
| Cache | Keys prefixed `site:{id}:` |
| Routing | Hostname → single `site_id` |
| Storage | Path prefix `sites/{site_id}/` |

## Tenant Resolution

```ts
// middleware.ts
const hostname = request.headers.get('host');
const site = await resolveSiteByDomain(hostname);
// Attach x-site-id header for downstream OR redirect to 404
```

Resolution order:

1. Exact match `site_domains.domain` where `status = verified`
2. Subdomain extract `{slug}.platform.com` → lookup `sites.slug`
3. Apex `platform.com` → marketing app (no tenant)

## Data Scoping Rules

- **Every** content query MUST filter `site_id`.
- No global `select * from projects` in app code.
- Admin session stores **activeSiteId** (cookie/context).
- Switch site UI (post-MVP multi-site plans).

## Onboarding Flow

1. Sign up → create `organization` + default `site`
2. Pick template → set `sites.template_id`
3. Seed default `site_sections` from template manifest
4. Create `site_domains` row: `{slug}.platform.com`
5. Redirect to CMS dashboard

## Existing Data Migration

- Current single portfolio → `organizations` row + `sites` row + backfill all `site_id`.

## Anti-Patterns (forbidden)

- Service role on public page without domain validation
- Passing `site_id` from client without server verification
- Shared cache entry across tenants without site key
- Storing tenant secrets in client bundle

## Related

- [saas-database-design-erd.md](./saas-database-design-erd.md)
- [saas-supabase-rls-policies.md](./saas-supabase-rls-policies.md)
- [saas-routing-domain.md](./saas-routing-domain.md)

---

## Detail v0.3 — Tenant Model

### Entity Hierarchy

```txt
auth.users
→ organization_members
→ organizations
→ sites
→ content/domains/snapshots/analytics
```

### Free Plan Rule

MVP:

- 1 organization per user.
- 1 site per organization.
- 1 subdomain per site.
- No custom domain.
- Watermark enabled.

### Ownership Rule

Client boleh mengirim `site_id`, tapi server wajib validasi apakah `site_id` itu milik user.

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
