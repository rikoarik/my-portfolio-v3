# SaaS Portfolio Platform — PRD

> Product Requirements Document  
> Tanggal: 2026-06-27  
> Status: Draft v0.3  
> Owner: Product / Engineering  
> Sumber: R&D SaaS Portfolio Platform + draft PRD awal

---

## 1. Ringkasan Produk

SaaS Portfolio Platform adalah platform untuk membuat website portfolio profesional secara cepat tanpa coding. User bisa sign up, memilih template, mengisi konten melalui CMS, melakukan preview, lalu publish ke subdomain sendiri.

Produk ini ditujukan untuk developer, freelancer, job seeker tech, mahasiswa IT/desain, UI/UX designer, dan kreator yang ingin punya portfolio modern, ringan, SEO-ready, dan mudah di-update.

### Positioning

> Portfolio SaaS untuk developer dan freelancer yang ingin website profesional cepat, ringan, SEO-ready, dan tidak ribet.

### Core Value

- Cepat publish tanpa setup hosting.
- Template modern dan bisa dipersonalisasi.
- CMS mudah untuk update konten.
- SEO-ready.
- Analytics bawaan.
- Bisa dimulai dari subdomain gratis.
- Bisa scale ke custom domain dan paid plan.

### Keputusan Utama dari R&D

| Area | Decision |
|---|---|
| Development approach | Incremental refactor dari repo existing, bukan rewrite total |
| Multi-tenant | Shared schema + `site_id` + RLS |
| Template engine | Config-driven, bukan arbitrary React/HTML/JS dari user |
| Hosting MVP | Shared Next.js app + subdomain routing |
| Hosting scale | Hybrid: shared app untuk free tier, static/CDN untuk paid/custom domain |
| Template strategy | Base template sedikit + variasi preset = ribuan kombinasi |
| Security | Public render dari published snapshot, bukan draft table langsung |
| Marketplace | Ditunda sampai produk valid dan security process matang |

---

## 2. Problem Statement

Banyak developer dan freelancer butuh portfolio profesional, tetapi sering gagal publish karena:

- Tidak punya waktu membuat website dari nol.
- Bingung desain.
- Malas setup hosting/domain.
- Tidak paham SEO.
- Portfolio sulit di-update.
- Template gratis terlihat pasaran.
- Custom domain terasa ribet.
- CMS terlalu kompleks atau terlalu terbatas.

Di sisi lain, repo portfolio existing sudah punya fondasi CMS, data model, theming, Supabase, analytics, dan public portfolio renderer. Artinya produk bisa dikembangkan menjadi SaaS multi-tenant dengan refactor bertahap.

---

## 3. Opportunity

Produk bisa masuk ke niche yang lebih spesifik dibanding website builder besar:

- Developer portfolio.
- Mobile developer portfolio.
- Freelancer portfolio.
- Student/job seeker portfolio.
- Designer portfolio.
- Creator/personal brand site.

Peluang awal bukan mengalahkan Webflow/Framer, tapi menyediakan solusi yang lebih ringan, cepat, dan relevan untuk user Indonesia/Asia Tenggara.

### Product Wedge

```txt
Sign up → pilih template → isi project & experience → publish subdomain dalam <30 menit.
```

### Kenapa Ini Menarik

- Developer/job seeker butuh link portfolio saat apply kerja.
- Freelancer butuh landing profesional untuk closing client.
- Mahasiswa butuh portfolio cepat tanpa belajar deployment.
- Template bisa dibuat modern dan niche untuk tech.
- Monetisasi bisa melalui custom domain, remove watermark, analytics, dan template premium.

---

## 4. Target User

### 4.1 Primary User

| User | Kebutuhan |
|---|---|
| Developer | Showcase project, experience, stack, GitHub, CV |
| Mobile Developer | Tampilkan app, Play Store/App Store link, screenshots |
| UI/UX Designer | Portfolio case study, visual grid, contact |
| Freelancer | Branding, project proof, testimonial, CTA |
| Mahasiswa IT/Desain | Portfolio cepat untuk magang/kerja |
| Job Seeker Tech | Resume online, SEO name, project highlights |

### 4.2 Secondary User

| User | Kebutuhan |
|---|---|
| Photographer | Gallery visual |
| Content creator | Link + portfolio hybrid |
| Consultant | Profile, service, contact |
| Small agency | Team profile + case study |
| Personal brand | Bio, social links, content highlight |
| UMKM jasa | Landing sederhana dengan service list |

---

## 5. Persona MVP

### Persona 1 — Arik, Mobile Developer

**Profile**

- Mobile developer.
- Punya beberapa project Android/React Native.
- Butuh portfolio untuk apply kerja/freelance.
- Tidak mau ribet setup hosting.
- Cukup pakai subdomain dulu.

**Goals**

- Publish portfolio dalam kurang dari 1 jam.
- Input project, experience, education, stack, CV.
- Punya tampilan modern.
- Bisa share link ke HR/client.
- Bisa update konten lewat CMS.

**Pain**

- Kalau bikin manual, lama di desain dan deploy.
- Kalau pakai template umum, kurang cocok untuk developer.
- Kalau pakai website builder besar, terlalu kompleks.
- Custom domain belum prioritas di awal.

**Success Scenario**

```txt
Arik sign up
→ pilih template Minimal Developer
→ isi profile dan project
→ upload CV/link GitHub
→ preview
→ publish ke arik.platform.com
→ share ke HR
```

---

### Persona 2 — Naya, UI/UX Designer

**Profile**

- UI/UX designer.
- Butuh showcase case study visual.
- Ingin template yang lebih editorial/creative.

**Goals**

- Pilih template visual.
- Tampilkan project dalam grid/bento.
- Tulis case study ringkas.
- Tampilkan contact dan social media.
- Custom warna/font.

**Pain**

- Template developer terlalu kaku.
- Mau desain bagus tanpa Webflow complexity.
- Butuh cepat untuk apply internship/freelance.

---

### Persona 3 — Bima, Freelancer

**Profile**

- Freelancer web/mobile.
- Butuh personal landing page.
- Butuh trust signal/testimonial.

**Goals**

- Tampilkan service, project, testimonial.
- Ada CTA WhatsApp/email.
- Bisa custom domain nanti.
- Analytics untuk melihat traffic.

**Pain**

- Landing page manual makan waktu.
- Website builder mahal.
- Analytics biasanya harus setup manual.

---

## 6. Product Goals

### 6.1 Goals MVP

Target 12–16 minggu part-time.

1. User bisa sign up dan punya account.
2. User bisa membuat site portfolio sendiri.
3. User bisa memilih template awal.
4. User bisa mengisi konten melalui CMS.
5. User bisa preview draft.
6. User bisa publish ke subdomain.
7. Public site dirender dari template config, bukan hardcoded layout.
8. Data antar user/tenant aman dengan RLS.
9. Published site memakai snapshot agar draft tidak bocor.
10. SEO dasar tersedia per site.
11. Analytics dasar tersedia per site.
12. 2–3 base template tersedia.
13. Template bisa divariasikan dengan color/font/layout preset.

---

### 6.2 Goals v1

1. Template gallery 5–10 base template.
2. Theme generator lebih matang.
3. Section reorder UI.
4. Custom domain.
5. Billing/subscription.
6. Remove watermark untuk paid plan.
7. Static/CDN untuk paid/custom domain.
8. Advanced analytics.
9. Basic team member untuk Business plan.

---

### 6.3 Non-Goals MVP

Hal berikut tidak masuk MVP:

- Marketplace template upload.
- Arbitrary user HTML/JS.
- Full drag-and-drop builder.
- Enterprise DB-per-tenant.
- Schema-per-tenant.
- E-commerce.
- Blog CMS advanced.
- Custom code injection.
- Revenue share template author.
- White-label agency.
- AI website generator.

---

## 7. Success Metrics

| Metric | Target MVP |
|---|---:|
| Time to first publish | < 30 menit |
| Signup → published dalam 7 hari | ≥ 40% |
| Template apply success | ≥ 95% |
| Published site LCP p75 | < 2.5s |
| Cross-tenant data leak | 0 |
| Public render uptime | ≥ 99.5% |
| Draft leak ke public | 0 |
| Publish success rate | ≥ 98% |
| Admin content save success | ≥ 99% |
| User bisa publish tanpa bantuan manual | ≥ 80% |

---

## 8. Scope MVP

### 8.1 Must Have

| Feature | Description |
|---|---|
| Auth | User bisa sign up/login |
| Organization | User otomatis punya organization default |
| Site | User bisa punya 1 site awal |
| CMS | Edit profile, project, experience, education, skills, SEO |
| Template registry | Template didefinisikan via manifest/config |
| Section registry | Section dirender data-driven |
| SiteRenderer | Public renderer pengganti `PortfolioClient` monolith |
| Publish snapshot | Public render dari snapshot |
| Subdomain routing | `username.platform.com` |
| RLS | Tenant isolation |
| SEO basic | title, description, OG, canonical |
| Analytics basic | page views, referrer, device |
| Preview draft | Lihat draft sebelum publish |
| 2–3 base template | Minimal Developer, Creative Bento, Classic Resume |
| Theme preset | Color/font/layout basic |

---

### 8.2 Should Have

| Feature | Description |
|---|---|
| Section reorder UI | User bisa ubah urutan section |
| Hide/show section | User bisa disable section |
| Guestbook moderation | Admin approve/hide guestbook |
| Sitemap | Sitemap per site/domain |
| OG image generator | Auto OG image basic |
| Watermark | Free plan badge |
| Plan limit | Limit server-side untuk free plan |
| Template preview | Preview sebelum apply |
| Rollback snapshot | Rollback ke publish version sebelumnya |

---

### 8.3 Nice to Have

| Feature | Description |
|---|---|
| Custom domain | Paid plan |
| Billing | Stripe/Midtrans/Xendit |
| Static export | Paid/custom domain performance |
| Advanced analytics | Country, click event, top project |
| Team member | Multi-user org |
| Template marketplace | Post-validation |
| AI content helper | Generate bio/project summary |

---

## 9. User Journey

### 9.1 First-time User Journey

```txt
Landing page
→ Sign up
→ Create organization default
→ Create first site
→ Pick template
→ Choose subdomain
→ Fill profile
→ Add project
→ Add experience
→ Preview
→ Publish
→ Share public link
```

### 9.2 Returning User Journey

```txt
Login
→ Open dashboard
→ Select site
→ Edit content/theme
→ Preview changes
→ Publish
→ Analytics check
```

### 9.3 Visitor Journey

```txt
Open username.platform.com
→ Middleware resolve tenant
→ Load latest published snapshot
→ Render public portfolio
→ Track page view
→ Visitor clicks project/contact
```

---

## 10. Information Architecture

### 10.1 Public Site

```txt
/
├─ Hero
├─ Proof / Stats / Social proof
├─ Projects
├─ About
├─ Career / Experience
├─ Education / Skills
├─ Guestbook / Testimonials
└─ Contact
```

Public site MVP bisa one-page. Multi-page bisa v1.

---

### 10.2 Admin Dashboard

```txt
/admin/dashboard
├─ Overview
├─ Sites
│  └─ Current Site
├─ Content
│  ├─ Profile
│  ├─ Projects
│  ├─ Experience
│  ├─ Education
│  ├─ Skills
│  └─ Guestbook
├─ Design
│  ├─ Template
│  ├─ Theme
│  ├─ Sections
│  └─ Preview
├─ SEO
├─ Analytics
├─ Domains
├─ Billing
└─ Settings
```

---

## 11. Functional Requirements

## Epic 1 — Renderer Refactor

### Objective

Mengubah public UI dari hardcoded `PortfolioClient` menjadi renderer data-driven yang bisa membaca template config dan section order.

### User Story

Sebagai platform, public page harus dirender dari config agar template dan section bisa dinamis.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| R-1.1 | Buat `SiteRenderer` sebagai renderer utama public site | P0 |
| R-1.2 | Buat `SectionRenderer` untuk render section berdasarkan type/variant | P0 |
| R-1.3 | Buat `sectionRegistry` untuk mapping type → component/schema/variant | P0 |
| R-1.4 | Buat `templateRegistry` untuk mapping template_id → manifest | P0 |
| R-1.5 | Existing `PortfolioClient` dipertahankan sementara atau di-wrap ke renderer baru | P0 |
| R-1.6 | Section order bisa berasal dari config | P0 |
| R-1.7 | Section bisa hide/show dari config | P0 |
| R-1.8 | Unknown section tidak crash, fallback ke null/placeholder aman | P1 |
| R-1.9 | Renderer support mobile responsive existing | P0 |
| R-1.10 | Renderer support theme token dari template config | P0 |

### Acceptance Criteria

- Public site existing tetap tampil normal.
- Section bisa diubah urutannya tanpa edit React page.
- Section bisa disabled dari config.
- Minimal 2 layout POC bisa dirender dari registry yang sama.
- Unknown section tidak membuat halaman error.
- Tidak ada perubahan data model besar di fase ini.

### Out of Scope

- Multi-tenant.
- Billing.
- Custom domain.
- Marketplace template.

---

## Epic 2 — Template System

### Objective

Membuat sistem template berbasis manifest/config, bukan banyak codebase template terpisah.

### User Story

Sebagai user, aku bisa memilih template portfolio agar tampilan sesuai kebutuhan.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| TPL-2.1 | Template punya `template_id`, label, category, description | P0 |
| TPL-2.2 | Template mendefinisikan default sections | P0 |
| TPL-2.3 | Template mendefinisikan supported section variants | P0 |
| TPL-2.4 | Template mendefinisikan default theme tokens | P0 |
| TPL-2.5 | Template bisa di-preview sebelum apply | P1 |
| TPL-2.6 | Apply template tidak menghapus konten user | P0 |
| TPL-2.7 | Template incompatible section harus fallback/hide aman | P1 |
| TPL-2.8 | Template gallery tersedia di admin | P0 |

### Template Manifest Example

```ts
export const templateRegistry = {
  'minimal-dev': {
    id: 'minimal-dev',
    label: 'Minimal Developer',
    category: 'developer',
    description: 'Clean portfolio for developers and job seekers.',
    defaultSections: [
      'hero',
      'proof',
      'projects',
      'about',
      'career',
      'guestbook',
      'contact'
    ],
    defaultTheme: {
      colorPreset: 'forest',
      fontPreset: 'inter-geist',
      radius: 'lg',
      density: 'comfortable',
      motion: 'subtle'
    },
    supportedVariants: {
      hero: ['centered', 'split', 'terminal'],
      projects: ['grid', 'bento', 'case-study'],
      career: ['timeline', 'compact']
    }
  }
};
```

### Acceptance Criteria

- User bisa memilih template.
- Template apply mengubah layout/tampilan tanpa menghapus project/experience.
- Template config tersimpan per site.
- Minimal 3 base template tersedia untuk MVP.

---

## Epic 3 — Multi-Tenant Foundation

### Objective

Membuat struktur SaaS multi-tenant agar satu platform bisa digunakan banyak user/site.

### User Story

Sebagai user, aku punya site sendiri dan data tidak tercampur dengan user lain.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| MT-3.1 | Buat table `organizations` | P0 |
| MT-3.2 | Buat table `organization_members` | P0 |
| MT-3.3 | Buat table `sites` | P0 |
| MT-3.4 | Tambah `site_id` ke semua table content | P0 |
| MT-3.5 | Existing data dimigrate ke site default | P0 |
| MT-3.6 | Semua query admin wajib filter by `site_id` | P0 |
| MT-3.7 | Server actions wajib validasi ownership | P0 |
| MT-3.8 | User baru otomatis punya org/site default | P0 |
| MT-3.9 | Support 1 site per free user MVP | P0 |
| MT-3.10 | Struktur org mendukung team member di v1 | P1 |

### Required Tables

- `organizations`
- `organization_members`
- `sites`
- `site_domains`
- `site_sections`
- `site_publish_snapshots`
- `subscriptions`

### Existing Tables yang Perlu `site_id`

- `projects`
- `experiences`
- `education`
- `skills`
- `guestbook`
- `seo_settings`
- `page_views`
- `custom_sections`
- Table content lain yang sudah ada di repo

### Acceptance Criteria

- User A tidak bisa melihat/mengubah data User B.
- Admin actions tidak bisa dijalankan untuk site milik orang lain.
- Existing portfolio tetap bisa dimigrate sebagai tenant pertama.
- Semua list/detail/create/update/delete content scoped by `site_id`.

---

## Epic 4 — RLS Security

### Objective

Mengaktifkan Row Level Security untuk mencegah data leak antar tenant.

### User Story

Sebagai platform, aku harus memastikan setiap tenant terisolasi secara database-level.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| SEC-4.1 | Enable RLS di semua table tenant-owned | P0 |
| SEC-4.2 | Buat helper function `is_org_member(org_id)` | P0 |
| SEC-4.3 | Owner/admin/editor bisa edit sesuai role | P0 |
| SEC-4.4 | Viewer hanya read admin data jika nanti role digunakan | P2 |
| SEC-4.5 | Public hanya bisa read published snapshot | P0 |
| SEC-4.6 | Test cross-tenant read/write wajib dibuat | P0 |
| SEC-4.7 | Service role hanya dipakai server-side dan tidak expose ke client | P0 |
| SEC-4.8 | Semua API route/server action audit ownership | P0 |

### Acceptance Criteria

- RLS aktif di semua table yang punya data tenant.
- Cross-tenant test pass.
- Public tidak bisa baca draft.
- User tanpa membership tidak bisa query data site.
- Tidak ada service role key di client bundle.

---

## Epic 5 — Publish & Snapshot

### Objective

Memisahkan draft dan public agar perubahan CMS tidak langsung muncul di website live.

### User Story

Sebagai user, aku ingin edit draft dan publish saat sudah siap.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| PUB-5.1 | Buat table `site_publish_snapshots` | P0 |
| PUB-5.2 | Publish action generate JSON snapshot | P0 |
| PUB-5.3 | Public site render dari latest published snapshot | P0 |
| PUB-5.4 | Draft preview render dari draft data | P1 |
| PUB-5.5 | Publish harus revalidate cache | P0 |
| PUB-5.6 | Publish version bertambah otomatis | P0 |
| PUB-5.7 | Rollback snapshot | P2 |
| PUB-5.8 | Publish log/history | P1 |

### Snapshot Payload Example

```json
{
  "site": {
    "id": "site-id",
    "name": "Arik Portfolio",
    "slug": "arik"
  },
  "template": {
    "id": "minimal-dev",
    "version": "1.0.0"
  },
  "theme": {
    "colorPreset": "forest",
    "fontPreset": "inter-geist",
    "radius": "lg",
    "density": "comfortable",
    "motion": "subtle"
  },
  "seo": {
    "title": "Arik Riko — Mobile Developer",
    "description": "Portfolio mobile developer focused on Kotlin and React Native.",
    "canonical": "https://arik.platform.com"
  },
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "variant": "split",
      "isEnabled": true,
      "sortOrder": 1,
      "content": {}
    }
  ],
  "generatedAt": "2026-06-27T00:00:00Z"
}
```

### Acceptance Criteria

- Edit CMS tidak mengubah public site sampai publish.
- Public site selalu render latest snapshot.
- Snapshot punya version.
- Publish gagal tidak merusak snapshot live sebelumnya.
- Preview draft bisa melihat perubahan sebelum publish.

---

## Epic 6 — Subdomain Routing

### Objective

Setiap site bisa diakses dari subdomain sendiri.

### User Story

Sebagai visitor, aku bisa membuka portfolio user dari `username.platform.com`.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| DOM-6.1 | Buat table `site_domains` | P0 |
| DOM-6.2 | Buat middleware tenant resolver dari hostname | P0 |
| DOM-6.3 | Subdomain dibuat saat onboarding | P0 |
| DOM-6.4 | Slug/subdomain harus unique | P0 |
| DOM-6.5 | Root domain tetap untuk marketing/app | P0 |
| DOM-6.6 | Unknown domain menampilkan 404 | P1 |
| DOM-6.7 | Suspended site menampilkan status page | P1 |
| DOM-6.8 | Custom domain placeholder disiapkan untuk v1 | P2 |

### Routing Flow

```txt
Request masuk
→ baca hostname
→ cek root domain atau tenant domain
→ jika root domain: render marketing/app
→ jika tenant domain: resolve ke site_domains
→ cek status domain dan site
→ load latest snapshot
→ render public site
```

### Acceptance Criteria

- `arik.platform.com` render site Arik.
- `naya.platform.com` render site Naya.
- Root domain tidak salah resolve jadi tenant.
- Unknown subdomain menampilkan 404.
- Suspended site tidak render portfolio.

---

## Epic 7 — CMS Content Management

### Objective

User bisa mengelola konten portfolio dari dashboard.

### User Story

Sebagai user, aku bisa mengisi dan mengupdate konten portfolio tanpa coding.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| CMS-7.1 | Edit profile/bio/headline | P0 |
| CMS-7.2 | CRUD projects | P0 |
| CMS-7.3 | CRUD experiences/career | P0 |
| CMS-7.4 | CRUD education | P1 |
| CMS-7.5 | CRUD skills/tech stack | P1 |
| CMS-7.6 | Manage social links | P0 |
| CMS-7.7 | Manage CV/resume link | P1 |
| CMS-7.8 | Manage guestbook/testimonials | P1 |
| CMS-7.9 | Upload/manage images | P1 |
| CMS-7.10 | Draft save state | P0 |

### Acceptance Criteria

- User bisa menyimpan konten dari dashboard.
- Konten tersimpan scoped by `site_id`.
- Konten baru muncul di preview draft.
- Konten baru muncul di public hanya setelah publish.
- Form validation jelas.

---

## Epic 8 — Design Customization

### Objective

User bisa mengubah tampilan tanpa coding.

### User Story

Sebagai user, aku ingin portfolio terasa personal melalui template, warna, font, dan layout.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| DES-8.1 | Template picker | P0 |
| DES-8.2 | Color preset picker | P1 |
| DES-8.3 | Font preset picker | P1 |
| DES-8.4 | Layout density picker | P1 |
| DES-8.5 | Motion/animation picker | P1 |
| DES-8.6 | Section reorder | P1 |
| DES-8.7 | Section hide/show | P0 |
| DES-8.8 | Per-section variant picker | P1 |
| DES-8.9 | Preview design before publish | P1 |

### Acceptance Criteria

- User bisa ganti template.
- User bisa ganti warna/font/layout.
- Design change tidak menghapus konten.
- Preview menampilkan perubahan.
- Public baru berubah setelah publish.

---

## Epic 9 — SEO

### Objective

Setiap site punya SEO dasar agar mudah dibagikan dan ditemukan.

### User Story

Sebagai user, aku ingin portfolio punya title, description, dan preview link yang bagus.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| SEO-9.1 | SEO title per site | P0 |
| SEO-9.2 | SEO description per site | P0 |
| SEO-9.3 | OG title/description/image | P0 |
| SEO-9.4 | Canonical URL | P0 |
| SEO-9.5 | Robots setting | P1 |
| SEO-9.6 | Sitemap per domain | P1 |
| SEO-9.7 | Structured data basic Person/ProfilePage | P1 |
| SEO-9.8 | Draft/preview noindex | P0 |

### Acceptance Criteria

- Public site memiliki metadata benar.
- Preview/draft tidak ke-index.
- Jika custom domain aktif nanti, canonical mengarah ke primary domain.
- Share link menghasilkan OG preview yang benar.

---

## Epic 10 — Analytics

### Objective

User bisa melihat performa dasar portfolio.

### User Story

Sebagai user, aku ingin tahu berapa orang membuka portfolio dan dari mana asalnya.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| ANA-10.1 | Track page views per `site_id` | P1 |
| ANA-10.2 | Track referrer | P1 |
| ANA-10.3 | Track device/browser basic | P1 |
| ANA-10.4 | Privacy-friendly visitor hash | P1 |
| ANA-10.5 | Dashboard views total | P1 |
| ANA-10.6 | Dashboard top paths | P1 |
| ANA-10.7 | Dashboard referrer list | P1 |
| ANA-10.8 | Exclude preview/admin traffic | P1 |

### Acceptance Criteria

- Page view tercatat dengan `site_id`.
- Admin bisa melihat analytics site miliknya.
- User tidak bisa melihat analytics site lain.
- Preview/admin tidak dihitung sebagai traffic publik.
- Tidak menyimpan IP mentah secara permanen.

---

## Epic 11 — Plan Limit & Billing Foundation

### Objective

Membuat pondasi plan agar free/paid feature bisa dikontrol server-side.

### User Story

Sebagai platform, aku ingin membatasi fitur berdasarkan plan.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| BILL-11.1 | Table `subscriptions` | P2 |
| BILL-11.2 | Plan checker utility | P1 |
| BILL-11.3 | Free plan max 1 site | P0 |
| BILL-11.4 | Watermark untuk free plan | P1 |
| BILL-11.5 | Custom domain gated by paid plan | P2 |
| BILL-11.6 | Template premium gated by plan | P2 |
| BILL-11.7 | Payment integration post-MVP | P2 |

### Acceptance Criteria

- Limit site dicek di server.
- Free user tidak bisa bypass fitur paid hanya dari client.
- Struktur plan siap untuk billing integration.

---

## 12. Non-Functional Requirements

### 12.1 Performance

| Requirement | Target |
|---|---:|
| Public LCP | < 2.5s p75 |
| Public CLS | < 0.1 |
| Public INP | < 200ms |
| Admin page load | < 3s p75 |
| Publish action | < 10s untuk shared app |
| Snapshot load | < 500ms server-side target |

### 12.2 Security

- RLS wajib aktif.
- Service role tidak boleh di client.
- No arbitrary user JS/HTML.
- Sanitize rich text.
- Escape all user content.
- Validate URLs.
- Rate limit guestbook and tracking.
- Preview token harus expired.
- Draft noindex.
- Public only reads published snapshot.

### 12.3 Reliability

- Publish gagal tidak boleh merusak versi live.
- Snapshot versioning wajib.
- Rollback disiapkan.
- Unknown section fallback aman.
- Unknown template fallback ke default atau error state yang jelas.

### 12.4 Scalability

- Shared app cukup untuk MVP.
- Public render harus cacheable.
- Snapshot dipakai agar query public ringan.
- Static/CDN disiapkan untuk paid/custom domain.
- Free tier harus punya quota untuk menghindari abuse.

### 12.5 Accessibility

- Template harus keyboard accessible.
- Kontras warna minimal WCAG AA untuk text utama.
- Link dan button punya label jelas.
- Motion bisa dikurangi/disabled.
- Semantic HTML untuk section.

### 12.6 Privacy

- Analytics privacy-friendly.
- Jangan simpan IP mentah jangka panjang.
- Guestbook harus bisa dimoderasi/dihapus.
- User bisa disable analytics di masa depan.
- Privacy policy perlu disiapkan sebelum public launch.

---

## 13. Data Model Requirements

### 13.1 New Tables

#### `organizations`

```sql
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  owner_id uuid not null references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `organization_members`

```sql
create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  created_at timestamptz default now(),
  unique (organization_id, user_id)
);
```

#### `sites`

```sql
create table sites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived', 'suspended')),
  template_id text not null default 'minimal-dev',
  theme_config jsonb not null default '{}',
  settings jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz,
  unique (organization_id, slug)
);
```

#### `site_domains`

```sql
create table site_domains (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  domain text unique not null,
  type text not null check (type in ('subdomain', 'custom')),
  status text not null default 'pending' check (status in ('pending', 'verified', 'failed', 'disabled')),
  verification_token text,
  verified_at timestamptz,
  created_at timestamptz default now()
);
```

#### `site_sections`

```sql
create table site_sections (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  type text not null,
  variant text not null default 'default',
  title text,
  config jsonb not null default '{}',
  content jsonb not null default '{}',
  sort_order int not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `site_publish_snapshots`

```sql
create table site_publish_snapshots (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  version int not null,
  template_id text not null,
  theme_config jsonb not null,
  payload jsonb not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  unique (site_id, version)
);
```

#### `subscriptions`

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  plan text not null default 'free',
  status text not null default 'active',
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

### 13.2 Existing Tables Migration

Existing content tables harus ditambah `site_id`.

Minimal:

```sql
alter table projects add column site_id uuid references sites(id);
alter table experiences add column site_id uuid references sites(id);
alter table education add column site_id uuid references sites(id);
alter table guestbook add column site_id uuid references sites(id);
alter table page_views add column site_id uuid references sites(id);
```

Migration sequence:

```txt
1. Create organizations.
2. Create organization_members.
3. Create sites.
4. Create first organization + first site for existing data.
5. Add nullable site_id to content tables.
6. Backfill existing rows.
7. Update app queries to filter by site_id.
8. Validate no null site_id.
9. Set site_id not null.
10. Enable RLS.
```

---

## 14. API / Server Action Requirements

### 14.1 Public APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/track` | POST | Track page view/click |
| `/sitemap.xml` | GET | Generate sitemap for domain |
| `/robots.txt` | GET | Robots per domain |
| `/opengraph-image` | GET | Generate OG image |

### 14.2 Admin Actions

| Action | Description |
|---|---|
| `createSite` | Create site scoped to org |
| `updateSiteSettings` | Update template/theme/settings |
| `publishSite` | Generate snapshot |
| `rollbackSiteSnapshot` | Rollback snapshot |
| `updateSectionOrder` | Reorder sections |
| `toggleSection` | Hide/show section |
| `applyTemplate` | Apply template config |
| `updateSeoSettings` | Update SEO |
| `createProject` | Create project |
| `updateProject` | Update project |
| `deleteProject` | Delete project |
| `updateProfile` | Update profile |
| `moderateGuestbook` | Approve/hide guestbook |

### 14.3 Server-side Guard

Semua admin action wajib:

```txt
1. Get authenticated user.
2. Resolve site_id.
3. Check organization membership.
4. Check role permission.
5. Validate payload.
6. Execute mutation.
7. Return typed result.
```

---

## 15. UX Requirements

### 15.1 Onboarding

MVP onboarding harus pendek.

Steps:

1. Create account.
2. Choose site name.
3. Choose subdomain.
4. Pick template.
5. Fill basic profile.
6. Add first project.
7. Preview.
8. Publish.

### 15.2 Dashboard UX

Dashboard harus memisahkan:

- Content
- Design
- SEO
- Analytics
- Domains
- Billing/settings

User tidak boleh bingung antara edit draft dan live site.

Wajib ada status:

```txt
Draft has unpublished changes
Last published: date/time
Public URL: username.platform.com
Preview draft button
Publish button
```

### 15.3 Template Gallery UX

Setiap template card menampilkan:

- Thumbnail
- Name
- Category
- Best for
- Preview
- Apply

Apply template harus memberi warning:

```txt
Template akan mengubah layout dan style, tetapi konten kamu tidak akan dihapus.
```

### 15.4 Publish UX

Publish button harus:

- Disabled saat validation error.
- Menampilkan loading.
- Menampilkan success message.
- Menampilkan public link.
- Menampilkan error jika gagal.

---

## 16. Plan & Pricing Draft

> Pricing masih draft dan perlu validasi pasar.

| Feature | Free | Starter | Pro | Business |
|---|---:|---:|---:|---:|
| Sites | 1 | 1 | 3 | 10 |
| Subdomain | Yes | Yes | Yes | Yes |
| Custom domain | No | Optional | Yes | Yes |
| Watermark | Yes | No | No | No |
| Templates | Limited | More | All | All |
| Analytics | Basic | Basic | Advanced | Advanced |
| Guestbook | Limited | Yes | Yes | Yes |
| Team members | No | No | 1–3 | 10 |
| Static/CDN | No | No | Yes | Yes |
| Priority support | No | No | No | Yes |

Suggested price Indonesia:

| Plan | Monthly |
|---|---:|
| Free | Rp0 |
| Starter | Rp19k–29k |
| Pro | Rp49k–79k |
| Business | Rp149k+ |

---

## 17. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|---|---:|---:|---|
| Renderer refactor merusak UI existing | High | Medium | Phase 1 tanpa DB change, visual check |
| Tenant data leak | Critical | Medium | RLS + integration tests |
| Scope creep ke visual builder | High | High | Non-goals jelas |
| Template terlalu banyak sulit maintain | High | High | Config-driven variation |
| XSS dari content | High | Medium | Sanitize + no arbitrary HTML |
| Guestbook spam | Medium | Medium | Rate limit + moderation |
| Public performance lambat | Medium | Medium | Snapshot + cache |
| Supabase limit | Medium | Medium | Quota, cache, plan limit |
| Billing webhook bug | High | Medium | Idempotent webhook, post-MVP |
| Custom domain SSL kompleks | Medium | Medium | Defer, gunakan managed platform |

---

## 18. Rollout Plan

### Phase 0 — Audit

Duration: 2–3 days

Output:

- DB audit.
- Component dependency map.
- Existing table list.
- Backup plan.
- Migration risk list.

### Phase 1 — Renderer Foundation

Duration: 1–2 weeks

Output:

- `SiteRenderer`
- `SectionRenderer`
- `sectionRegistry`
- `templateRegistry`
- Existing UI still works
- 2 template POC

### Phase 2 — Multi-Tenant Data

Duration: 1–2 weeks

Output:

- `organizations`
- `sites`
- `site_id`
- migration/backfill
- query scoped by site

### Phase 3 — RLS + Security

Duration: 1–2 weeks

Output:

- RLS policies
- ownership validation
- cross-tenant tests

### Phase 4 — Publish + Routing

Duration: 1–2 weeks

Output:

- published snapshot
- subdomain resolver
- public render by hostname
- preview draft

### Phase 5 — Template Gallery + UX

Duration: 2–3 weeks

Output:

- template gallery
- theme picker
- section reorder
- design preview

### Phase 6 — SEO/Analytics/QA

Duration: 1–2 weeks

Output:

- SEO per site
- analytics dashboard
- performance test
- QA checklist

### Phase 7 — Post-MVP Billing/Custom Domain

Duration: 2–4 weeks

Output:

- plan checker
- payment integration
- custom domain verification
- remove watermark

---

## 19. Release Criteria

MVP boleh dirilis private/beta jika:

- User baru bisa sign up.
- User bisa membuat 1 site.
- User bisa mengisi CMS.
- User bisa pilih minimal 2 template.
- User bisa preview draft.
- User bisa publish ke subdomain.
- Public site render dari snapshot.
- RLS test pass.
- Cross-tenant data leak = 0.
- Basic SEO metadata benar.
- Basic analytics tercatat.
- Unknown route/site punya 404.
- Performance public site acceptable.
- No arbitrary HTML/JS.
- Backup/migration sudah aman.

---

## 20. QA Checklist

### Public Site

- [ ] Site load di desktop.
- [ ] Site load di mobile.
- [ ] Hero section benar.
- [ ] Project section benar.
- [ ] Experience section benar.
- [ ] Contact/social link benar.
- [ ] SEO metadata benar.
- [ ] OG preview benar.
- [ ] Unknown subdomain 404.
- [ ] Suspended site tidak render.
- [ ] Draft tidak muncul public.

### Admin

- [ ] Login berhasil.
- [ ] Create site berhasil.
- [ ] Edit profile berhasil.
- [ ] CRUD project berhasil.
- [ ] Apply template berhasil.
- [ ] Reorder section berhasil.
- [ ] Preview draft benar.
- [ ] Publish berhasil.
- [ ] Analytics tampil.
- [ ] User tidak bisa access site orang lain.

### Security

- [ ] RLS aktif.
- [ ] Cross-tenant select blocked.
- [ ] Cross-tenant update blocked.
- [ ] Service role tidak expose.
- [ ] Guestbook rate limit.
- [ ] Input sanitized.
- [ ] Preview noindex.
- [ ] External link safe.

---

## 21. Dependencies & File Terkait

| Area | File / Path | Action |
|---|---|---|
| Public entry | `src/app/page.tsx` | Resolve tenant and render site |
| Existing renderer | `src/components/portfolio/PortfolioClient.tsx` | Refactor/wrap to `SiteRenderer` |
| Sections | `src/components/infinite-field/sections/*` | Move/register into section registry |
| Theme preset | `src/lib/theme/landing-theme.ts` | Extend to per-site theme config |
| Data layer | `src/lib/portfolio.ts` | Add `site_id` filter |
| Types | `src/types/portfolio.ts` | Add site/template/section types |
| SEO page | `src/app/admin/dashboard/seo/page.tsx` | Scope SEO by site |
| Admin actions | `src/app/admin/actions.ts` | Ownership + site_id validation |
| Validation | `src/lib/admin/validation.ts` | Add section/template schema |
| Supabase service | `src/lib/supabase/service.ts` | Ensure server-only service role |
| Analytics data | `src/lib/admin/analytics-data.ts` | Filter by site_id |
| Track API | `src/app/api/track/route.ts` | Add site_id + rate limit |
| Middleware | `src/middleware.ts` | New tenant resolver |
| Templates | `src/lib/templates/*` | New registry/config |
| Site renderer | `src/components/site-renderer/*` | New renderer layer |

---

## 22. Open Questions

### Product

1. Nama produk final apa?
2. Domain root dan app domain apa?
3. Target awal Indonesia saja atau global?
4. Bahasa UI Indonesia, English, atau bilingual?
5. Guestbook wajib di MVP atau optional?
6. Portfolio MVP one-page saja atau multi-page?
7. Free tier pakai watermark atau tidak?

### Business

1. Payment provider: Stripe, Midtrans, Xendit?
2. Pricing final IDR atau USD?
3. Custom domain masuk Pro atau add-on?
4. Template premium masuk Starter atau Pro?
5. Agency plan perlu dari awal?

### Technical

1. Hosting awal Vercel, Cloudflare, atau self-host?
2. Supabase project tetap satu atau pisah staging/prod?
3. Image upload pakai Supabase Storage?
4. Static export dimulai kapan?
5. Queue/worker perlu dari MVP atau post-MVP?
6. Cache pakai Next cache, Redis, KV, atau CDN?

### Migration

1. Data existing jadi tenant pertama?
2. User existing admin jadi owner organization default?
3. Perlu migration rollback SQL?
4. Apakah table existing boleh diubah langsung di production?
5. Perlu staging migration dry run?

---

## 23. Final Recommendation

Urutan implementasi yang paling aman:

```txt
1. Refactor renderer dulu.
2. Buat section/template registry.
3. Tambah site model dan site_id.
4. Aktifkan RLS.
5. Buat publish snapshot.
6. Buat subdomain routing.
7. Buat template gallery.
8. Tambah SEO/analytics polish.
9. Baru billing/custom domain.
```

Jangan mulai dari:

- Ribuan template.
- Billing.
- Custom domain.
- Marketplace.
- Drag-and-drop builder.

Alasannya:

- Risiko utama ada di renderer dan tenant isolation.
- Produk bisa divalidasi dengan subdomain dan 2–3 template dulu.
- Template system harus stabil sebelum jumlah template diperbanyak.
- Billing/custom domain tidak berguna kalau publish/render/multi-tenant belum aman.

---

## 24. PRD Conclusion

SaaS Portfolio Platform layak dibuat dari repo existing dengan pendekatan incremental.

MVP harus membuktikan 5 hal utama:

1. Repo existing bisa menjadi data-driven renderer.
2. Banyak user/site bisa berjalan aman dalam satu platform.
3. User bisa publish portfolio sendiri tanpa bantuan manual.
4. Template system bisa menghasilkan variasi tanpa banyak codebase.
5. Public site cepat, aman, dan SEO-ready.

Kesimpulan final:

```txt
Product feasibility: High
Technical risk: Medium
Main risk: Tenant isolation + renderer refactor
MVP scope: Clear
Recommended timeline: 12–16 weeks part-time
Recommended next step: Phase 1 — SiteRenderer + SectionRegistry
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
