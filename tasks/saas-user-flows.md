# 16. User Flow Document

## Flow 1 — Sign up & first publish (happy path)

```mermaid
flowchart TD
  A[Landing page] --> B[Sign up]
  B --> C[Email verify optional]
  C --> D[Pick template]
  D --> E[Auto-create site + subdomain]
  E --> F[CMS dashboard checklist]
  F --> G[Fill profile]
  G --> H[Add 1+ project]
  H --> I[Preview optional]
  I --> J[Publish]
  J --> K[Visit subdomain live]
```

**Goal:** < 30 minutes to live site.

## Flow 2 — Returning user edit

```mermaid
flowchart TD
  A[Login] --> B[Dashboard]
  B --> C[Edit content module]
  C --> D[Save draft auto]
  D --> E{Ready?}
  E -->|Yes| F[Publish]
  E -->|No| B
  F --> G[Public site updated]
```

## Flow 3 — Template switch

```mermaid
flowchart TD
  A[Design tab] --> B[Browse gallery]
  B --> C[Preview template]
  C --> D{Apply?}
  D -->|Yes| E[Confirm section diff]
  E --> F[Apply to draft]
  F --> G[Review content]
  G --> H[Publish]
  D -->|No| B
```

## Flow 4 — Visitor

```mermaid
flowchart TD
  A[Open subdomain URL] --> B[Middleware resolve site]
  B --> C{Published?}
  C -->|Yes| D[Load snapshot]
  D --> E[Render SiteRenderer]
  E --> F[Optional: guestbook submit]
  C -->|No| G[404 / coming soon]
```

## Flow 5 — Guestbook submit (visitor)

```mermaid
flowchart TD
  A[Guestbook section] --> B[Click Write Message]
  B --> C[Modal form]
  C --> D[Submit API]
  D --> E{Rate limit OK?}
  E -->|Yes| F[Insert pending/visible per config]
  E -->|No| G[Error toast]
```

## Flow 6 — Admin moderate guestbook

```mermaid
flowchart TD
  A[Guestbook admin] --> B[See pending messages]
  B --> C[Approve or delete]
  C --> D[Republish if needed for snapshot mode]
```

## Personas

See PRD §5 — primary: developer job seeker; secondary: freelancer/designer.

## Related

- [saas-wireframe-screen-list.md](./saas-wireframe-screen-list.md)
- [saas-admin-dashboard-ia.md](./saas-admin-dashboard-ia.md)

---

## Detail v0.3 — Critical Flows

### Critical Flow 1

```txt
Sign up → create site → choose template → fill profile → publish
```

### Critical Flow 2

```txt
Edit project → preview draft → publish → public updated
```

### Critical Flow 3

```txt
Visitor opens subdomain → site resolved → snapshot rendered
```

Any bug in these flows blocks beta.

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
