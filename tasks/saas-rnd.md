# SaaS Portfolio Platform — R&D

> Research & exploration document.  
> Bukan spec final — dokumen ini dipakai untuk mengevaluasi feasibility, pilihan arsitektur, trade-off, risiko, dan urutan implementasi.  
> Tanggal: 2026-06-27  
> Status: Draft R&D v0.2

---

## 1. Executive Summary

Repo portfolio yang sekarang **bisa dikembangkan menjadi SaaS portfolio multi-tenant tanpa rewrite total**, tapi tidak disarankan langsung loncat ke multi-tenant sejak hari pertama.

Fondasi yang sudah ada cukup kuat: content model, CMS admin, Supabase, theme preset, analytics, SEO setting, dan public portfolio renderer. Namun struktur public UI saat ini masih cenderung monolith dan hardcoded, sehingga bagian pertama yang perlu dikerjakan adalah **refactor renderer menjadi data-driven**.

Kesimpulan utama R&D:

1. **Repo sekarang layak dilanjutkan**, bukan dibuang.
2. “Ribuan template” secara realistis bukan berarti 1000 komponen/template code terpisah.
3. Pola industri adalah **base template sedikit + variasi layout + warna + font + content user**.
4. Multi-tenant paling realistis untuk MVP adalah **shared schema + `site_id` + RLS**.
5. Hosting awal paling aman adalah **shared Next.js app dengan tenant resolver**.
6. Untuk skala lebih besar, gunakan **hybrid hosting**: dynamic/shared untuk free tier, static/CDN untuk paid/custom domain.
7. Template engine MVP sebaiknya **config-driven**, bukan arbitrary React code dari user.
8. Marketplace template sebaiknya masuk fase akhir karena risiko security dan maintenance tinggi.

Rekomendasi implementasi:

- **Phase 1:** Refactor `PortfolioClient` menjadi `SiteRenderer`.
- **Phase 2:** Tambah `sites`, `site_id`, RLS, dan tenant isolation.
- **Phase 3:** Subdomain routing + onboarding + publish flow.
- **Phase 4:** Template generator dan template gallery.
- **Phase 5:** Custom domain + billing.
- **Phase 6:** Marketplace template, jika produk sudah valid.

---

## 2. Pertanyaan R&D

### 2.1 Bisakah repo sekarang jadi SaaS portfolio multi-tenant tanpa rewrite total?

**Jawaban:** Bisa, dengan pendekatan incremental refactor.

Repo sekarang sudah punya fondasi yang mendekati SaaS portfolio:

- CMS admin
- Public portfolio page
- Data model portfolio
- Theme preset
- Supabase
- Analytics
- SEO config
- Draft/published concept

Yang perlu diubah bukan seluruh codebase, tapi cara data dirender dan diisolasi.

Masalah utamanya sekarang:

- Public UI masih layout tunggal.
- Section order masih hardcoded.
- Data belum punya `site_id`.
- Belum ada konsep tenant/site/domain.
- Belum ada template registry.
- Belum ada publish snapshot.
- Belum ada billing dan plan limit.

Jadi pendekatan yang benar:

```txt
Existing portfolio app
→ refactor renderer
→ introduce site entity
→ introduce tenant isolation
→ introduce routing
→ introduce templates
→ introduce billing/custom domain
```

Bukan:

```txt
Existing portfolio app
→ rewrite dari nol jadi SaaS
```

---

### 2.2 Realistis nggak “ribuan template”?

**Jawaban:** Realistis secara marketing, tidak realistis kalau artinya 1000 codebase template terpisah.

Pola produk website builder biasanya:

```txt
base template × color preset × font preset × layout density × section combination
```

Contoh:

```txt
10 base templates
× 12 color palettes
× 8 font pairings
× 5 layout variants
× 4 animation modes
= 19.200 kombinasi tampilan
```

Jadi “ribuan template” bisa valid jika didefinisikan sebagai **ribuan kombinasi desain**, bukan ribuan file template manual.

Untuk MVP, target realistis:

- 3 base template
- 6 color preset
- 4 font preset
- 3 layout density
- 2 animation mode

Hasil:

```txt
3 × 6 × 4 × 3 × 2 = 432 variasi
```

Untuk v1:

```txt
8 × 10 × 6 × 4 × 3 = 5.760 variasi
```

---

### 2.3 Hosting model mana yang scale?

Ada 3 opsi utama:

1. Shared Next.js app
2. Static export per site
3. Edge rendering + KV/cache

Untuk MVP, shared app paling cepat dan murah dari sisi development. Untuk skala besar, static/CDN lebih murah dan stabil.

Rekomendasi final:

```txt
Free tier:
Shared Next app + subdomain

Paid tier:
Shared app + better cache

Pro/custom domain:
Static export / ISR / CDN cached output
```

Dengan begitu, free user tidak membebani build pipeline, sedangkan paid user dapat performa dan SEO lebih baik.

---

### 2.4 Multi-tenant Supabase: shared schema atau schema-per-tenant?

Untuk produk portfolio SaaS dengan potensi banyak free user, shared schema adalah pilihan paling realistis.

Rekomendasi:

```txt
shared schema + site_id + organization_id + RLS
```

Alasan:

- Mudah migrate dari struktur sekarang.
- Cocok untuk banyak tenant kecil.
- Tidak perlu migrasi schema berkali-kali.
- Lebih cocok untuk free tier.
- Lebih sederhana untuk dashboard analytics global.
- Bisa tetap aman dengan RLS yang benar.

Schema-per-tenant atau DB-per-tenant baru masuk akal jika:

- Tenant besar enterprise.
- Ada kebutuhan compliance kuat.
- Data per tenant sangat besar.
- Ada SLA dan backup khusus per tenant.

Untuk produk portfolio, itu overkill di awal.

---

### 2.5 Template engine: build-time atau runtime?

Untuk MVP, gunakan runtime config-driven renderer.

Artinya template bukan file React bebas dari user, tapi data/config yang menentukan:

- Section yang aktif
- Urutan section
- Layout variant
- Color preset
- Font preset
- Spacing
- Border radius
- Animation mode
- Component variant

Contoh:

```json
{
  "template_id": "minimal-dev",
  "theme": {
    "color_preset": "forest",
    "font_preset": "inter-geist",
    "radius": "large",
    "animation": "light"
  },
  "sections": [
    { "type": "hero", "variant": "split" },
    { "type": "proof_strip", "variant": "compact" },
    { "type": "projects", "variant": "grid" },
    { "type": "career", "variant": "timeline" },
    { "type": "guestbook", "variant": "minimal" }
  ]
}
```

Build-time/static export bisa dipakai nanti untuk paid plan atau custom domain.

---

## 3. Product Vision

### 3.1 Visi Produk

Membangun platform SaaS untuk membuat portfolio profesional secara cepat, modern, dan bisa dipersonalisasi tanpa user harus coding.

Target produk:

```txt
Portfolio builder yang simple seperti Carrd,
tapi lebih cocok untuk developer, freelancer, mahasiswa, designer, dan kreator digital.
```

Core value:

- Cepat publish
- Template modern
- SEO-ready
- Bisa custom domain
- CMS mudah
- Analytics bawaan
- Bisa dipakai tanpa coding
- Tetap fleksibel untuk developer

---

### 3.2 Positioning Produk

Produk ini tidak perlu melawan Webflow/Framer secara langsung di awal. Lebih realistis masuk ke niche:

1. Developer portfolio
2. Freelancer portfolio
3. Student/job seeker portfolio
4. Personal branding page
5. Simple agency/team profile
6. Creator link/portfolio hybrid

Positioning awal:

```txt
“Portfolio SaaS untuk developer dan freelancer yang ingin punya website profesional cepat, ringan, SEO-ready, dan tidak ribet.”
```

---

### 3.3 Target User

#### Primary user

- Developer
- Mobile developer
- UI/UX designer
- Freelancer
- Mahasiswa IT/desain
- Job seeker tech

#### Secondary user

- Photographer
- Content creator
- Consultant
- Small agency
- Personal brand
- UMKM jasa

#### User pain point

- Malas setup hosting.
- Tidak punya waktu bikin portfolio dari nol.
- Bingung desain.
- Sulit update konten.
- Tidak paham SEO.
- Ingin custom domain tapi tidak mau ribet.
- Ingin terlihat profesional saat apply kerja/freelance.

---

## 4. Kompetitor & Benchmark

> Angka pricing dan jumlah template bersifat indikatif. Perlu diverifikasi ulang sebelum dokumen ini dijadikan materi bisnis final.

| Produk | Model | Template Count | Hosting | Pricing Indikatif | Catatan |
|---|---|---:|---|---|---|
| Framer | Visual builder + CMS + AI | Ratusan | Managed | Free sampai paid bulanan | Kuat di visual dan landing page modern |
| Webflow | Visual builder + CMS | Ratusan | Managed | Paid bulanan | Kuat untuk agency dan website bisnis |
| Carrd | One-page builder | Puluhan | Managed | Tahunan murah | Simpel, murah, cepat publish |
| Popsy/Notion-based | Notion-to-site | Puluhan | Managed | Free sampai paid | Cocok untuk user yang sudah pakai Notion |
| Squarespace | Website builder | 100+ | Managed | Paid bulanan | Kuat di template bisnis dan kreator |
| Pixpa | Portfolio builder | 100+ | Managed | Paid bulanan | Fokus kreator, fotografi, portfolio |
| Typedream | No-code site builder | Puluhan | Managed | Free sampai paid | Simple landing page dan startup page |

---

## 5. Industry Pattern

### 5.1 Pola Template

Produk website builder jarang benar-benar punya ribuan template unik berbasis code. Biasanya yang terjadi:

```txt
Base template
+ layout variant
+ typography preset
+ color preset
+ section combination
+ user content
= ribuan kemungkinan tampilan
```

Contoh struktur:

```txt
Template: Minimal Developer
Variants:
- hero centered
- hero split
- hero terminal
- project grid
- project bento
- project case study
- timeline vertical
- timeline compact
```

Satu base template bisa menghasilkan banyak variasi tanpa membuat file baru terus-menerus.

---

### 5.2 Pola Hosting

Website builder biasanya menggunakan hosting managed:

- User tidak mikir server.
- Platform handle SSL.
- Platform handle custom domain.
- Platform handle CDN.
- Platform handle build/render.
- Platform handle SEO base config.

Untuk SaaS portfolio ini, arah idealnya sama:

```txt
User cukup pilih template → isi konten → publish.
```

Tidak boleh user harus:

- Setup VPS
- Setup DNS manual terlalu rumit
- Deploy sendiri
- Build sendiri
- Config SSL sendiri

---

### 5.3 Pola Monetisasi

Plan yang umum:

| Plan | Target | Limit |
|---|---|---|
| Free | Trial/user kecil | Subdomain, watermark, limited template |
| Starter | Personal portfolio | Remove watermark, more template |
| Pro | Freelancer/profesional | Custom domain, analytics, SEO |
| Business | Agency/team | Multiple sites, team member, priority |

Rekomendasi awal:

| Plan | Harga Indikatif | Fitur |
|---|---:|---|
| Free | Rp0 | 1 site, subdomain, watermark kecil |
| Starter | Rp19k–29k/bln | remove watermark, more themes |
| Pro | Rp49k–79k/bln | custom domain, analytics, SEO advanced |
| Business | Rp149k+/bln | multiple sites, team, priority support |

Untuk Indonesia, pricing sebaiknya tidak langsung mengikuti USD SaaS karena target user awal kemungkinan sensitif harga.

---

## 6. Feasibility Repo Sekarang

### 6.1 Sudah Siap

Estimasi fondasi yang sudah tersedia: **40–50%**.

| Area | Status | Catatan |
|---|---|---|
| Content model | Ada | Projects, experience, education, sections, SEO, guestbook |
| CMS admin | Ada | CRUD dan dashboard sudah bisa jadi basis SaaS |
| Supabase backend | Ada | Cocok untuk MVP |
| Theme preset | Ada | `landing_theme_preset` + `data-landing-theme` bisa diperluas |
| Analytics | Ada | `page_views` + dashboard bisa dibuat per site |
| SEO setting | Ada | Bisa diperluas ke per-site SEO |
| Public UI | Ada | Tapi perlu refactor dari hardcoded ke data-driven |

---

### 6.2 Belum Siap

| Area | Gap | Dampak |
|---|---|---|
| Tenant isolation | Belum ada `site_id` | Data antar user belum bisa dipisah |
| Template registry | Belum ada | Tidak bisa punya banyak template |
| Section registry | Belum ada | Section masih hardcoded |
| Site/domain model | Belum ada | Belum bisa subdomain/custom domain |
| Publish snapshot | Belum ada | Draft/published sulit dikontrol |
| Billing | Belum ada | Belum bisa monetisasi |
| Plan limit | Belum ada | Free tier bisa abuse |
| Team/member role | Belum ada | Belum bisa multi-user per site |
| Domain verification | Belum ada | Custom domain belum aman |
| Rate limit | Belum jelas | Guestbook/form bisa spam |

---

### 6.3 Kesimpulan Feasibility

Repo tidak perlu rewrite, tapi perlu refactor bertahap.

Prioritas bukan langsung billing atau ribuan template, tapi:

1. Renderer data-driven
2. Section registry
3. Site model
4. RLS
5. Routing tenant
6. Template config
7. Publish flow
8. Billing/custom domain

---

## 7. Target Architecture

### 7.1 High-level Architecture

```txt
Browser
  ↓
Next.js App
  ↓
Tenant Resolver Middleware
  ↓
Site Loader
  ↓
SiteRenderer
  ↓
SectionRegistry + TemplateRegistry
  ↓
Supabase / Cache / Analytics
```

Flow public page:

```txt
Request masuk
→ baca hostname
→ resolve hostname ke site
→ ambil published snapshot
→ render berdasarkan template config
→ track page view
→ cache response
```

Flow admin:

```txt
User login
→ masuk dashboard
→ pilih site
→ edit content
→ preview draft
→ publish
→ generate published snapshot
→ revalidate cache/static page
```

---

### 7.2 Core Concepts

| Concept | Definisi |
|---|---|
| Tenant | Organization/user pemilik satu atau banyak site |
| Site | Satu portfolio/website publik |
| Domain | Subdomain atau custom domain yang mengarah ke site |
| Template | Paket layout dan style config |
| Section | Blok konten seperti hero, projects, career, about |
| Published snapshot | Versi konten yang sudah dipublish |
| Draft | Versi konten yang sedang diedit |
| Theme preset | Warna, font, radius, spacing, animation |
| Plan | Limit dan fitur berdasarkan billing |

---

## 8. Data Model Rekomendasi

### 8.1 Tables Baru

#### `organizations`

Untuk menyimpan tenant/account group.

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

Untuk support team/member di masa depan.

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

Core entity SaaS.

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

Untuk subdomain dan custom domain.

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

Untuk section order data-driven.

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

Untuk published version dan rollback.

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

Untuk billing.

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

### 8.2 Tables Existing yang Perlu Ditambah `site_id`

Tabel existing yang menyimpan konten perlu ditambah `site_id`.

Contoh:

```txt
projects
experiences
education
skills
guestbook
seo_settings
page_views
custom_sections
```

Minimal migration:

```sql
alter table projects add column site_id uuid references sites(id);
alter table experiences add column site_id uuid references sites(id);
alter table education add column site_id uuid references sites(id);
alter table guestbook add column site_id uuid references sites(id);
alter table page_views add column site_id uuid references sites(id);
```

Setelah itu backfill:

```sql
update projects set site_id = '<first-site-id>' where site_id is null;
```

Lalu enforce:

```sql
alter table projects alter column site_id set not null;
```

---

## 9. RLS Strategy

### 9.1 Prinsip RLS

Setiap query admin harus dibatasi berdasarkan organisasi/site yang dimiliki user.

Rule utama:

```txt
User hanya bisa membaca/mengubah data dari organization/site tempat dia menjadi member.
```

Public page tidak boleh membaca draft. Public hanya boleh membaca:

```txt
site status = published
domain status = verified
published snapshot latest
public sections enabled
```

---

### 9.2 Helper Function

Buat helper function agar policy tidak duplikatif.

```sql
create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from organization_members om
    where om.organization_id = org_id
      and om.user_id = auth.uid()
  );
$$;
```

---

### 9.3 Example Policy `sites`

```sql
alter table sites enable row level security;

create policy "members can read own sites"
on sites
for select
using (
  public.is_org_member(organization_id)
);

create policy "members can update own sites"
on sites
for update
using (
  public.is_org_member(organization_id)
)
with check (
  public.is_org_member(organization_id)
);
```

---

### 9.4 Example Policy `site_sections`

```sql
alter table site_sections enable row level security;

create policy "members can read own site sections"
on site_sections
for select
using (
  exists (
    select 1
    from sites s
    where s.id = site_sections.site_id
      and public.is_org_member(s.organization_id)
  )
);

create policy "members can modify own site sections"
on site_sections
for all
using (
  exists (
    select 1
    from sites s
    where s.id = site_sections.site_id
      and public.is_org_member(s.organization_id)
  )
)
with check (
  exists (
    select 1
    from sites s
    where s.id = site_sections.site_id
      and public.is_org_member(s.organization_id)
  )
);
```

---

### 9.5 Public Data Access

Public page sebaiknya tidak langsung query semua table draft. Gunakan salah satu:

1. RPC khusus public
2. View khusus published
3. Server-side service role dengan validasi ketat
4. Published snapshot table

Rekomendasi:

```txt
Admin edit draft di banyak table.
Saat publish, generate snapshot JSON.
Public page render dari snapshot.
```

Keuntungan:

- Public render lebih cepat.
- Tidak bocor draft.
- Bisa rollback.
- Bisa cache lebih agresif.
- Struktur section lebih stabil.

---

## 10. Rendering Architecture

### 10.1 Masalah Sekarang

Sekarang `PortfolioClient` masih hardcoded:

```tsx
<IFProofStrip />
<IFProjectsSection />
<IFAboutSection />
<IFCareerSection />
<IFGuestbookSection />
```

Ini membuat:

- Susah ubah urutan section.
- Susah punya template berbeda.
- Susah hide/show section per user.
- Susah bikin template gallery.
- Susah membuat variasi layout.

---

### 10.2 Target Renderer

Target:

```tsx
export function SiteRenderer({ site }: { site: PublishedSite }) {
  const template = templateRegistry[site.templateId];

  return (
    <main data-template={site.templateId} data-theme={site.theme.id}>
      {site.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          template={template}
        />
      ))}
    </main>
  );
}
```

---

### 10.3 Section Renderer

```tsx
export function SectionRenderer({ section, template }: Props) {
  const registryItem = sectionRegistry[section.type];

  if (!registryItem) {
    return null;
  }

  const Component = registryItem.variants[section.variant] 
    ?? registryItem.variants.default;

  return (
    <Component
      content={section.content}
      config={section.config}
      template={template}
    />
  );
}
```

---

### 10.4 Section Registry

```ts
export const sectionRegistry = {
  hero: {
    label: 'Hero',
    schema: heroSchema,
    variants: {
      default: HeroDefault,
      split: HeroSplit,
      terminal: HeroTerminal,
      editorial: HeroEditorial,
    },
  },
  projects: {
    label: 'Projects',
    schema: projectsSchema,
    variants: {
      default: ProjectsGrid,
      bento: ProjectsBento,
      caseStudy: ProjectsCaseStudy,
    },
  },
  career: {
    label: 'Career',
    schema: careerSchema,
    variants: {
      default: CareerTimeline,
      compact: CareerCompact,
    },
  },
  guestbook: {
    label: 'Guestbook',
    schema: guestbookSchema,
    variants: {
      default: GuestbookMinimal,
    },
  },
};
```

---

### 10.5 Template Registry

```ts
export const templateRegistry = {
  'minimal-dev': {
    label: 'Minimal Developer',
    category: 'developer',
    sections: ['hero', 'proof_strip', 'projects', 'career', 'guestbook'],
    defaultTheme: 'forest',
    layout: {
      maxWidth: '1120px',
      spacing: 'comfortable',
      radius: 'large',
    },
  },
  'editorial-creative': {
    label: 'Editorial Creative',
    category: 'creative',
    sections: ['hero', 'about', 'projects', 'writing', 'contact'],
    defaultTheme: 'mono',
    layout: {
      maxWidth: '960px',
      spacing: 'spacious',
      radius: 'medium',
    },
  },
};
```

---

## 11. Template Strategy

### 11.1 Jangan Buat 1000 Code Template

Yang harus dibuat:

```txt
Template system
bukan template manual satu-satu.
```

Template code terlalu banyak akan menyebabkan:

- Maintenance berat
- Bug tersebar
- UI tidak konsisten
- Performance susah dikontrol
- QA mahal
- Authoring sulit
- Security review berat

---

### 11.2 Base Template Awal

Untuk MVP:

| Template ID | Target | Style |
|---|---|---|
| `minimal-dev` | Developer/job seeker | Clean, structured |
| `creative-bento` | Designer/freelancer | Visual, grid/bento |
| `classic-resume` | Mahasiswa/profesional | CV-like, formal |

Untuk v1:

| Template ID | Target | Style |
|---|---|---|
| `terminal-dev` | Developer | Terminal/coding vibe |
| `agency-clean` | Team kecil | Business landing |
| `photographer-grid` | Photographer | Visual gallery |
| `writer-editorial` | Writer/blogger | Typography-heavy |
| `student-simple` | Student | Simple and guided |

---

### 11.3 Variation System

Variasi bisa dibuat dari:

#### Color preset

```txt
forest
midnight
mono
sand
indigo
rose
cyber
warm
```

#### Font preset

```txt
inter-geist
space-grotesk
instrument-serif
ibm-plex
manrope
sora
```

#### Layout density

```txt
compact
comfortable
spacious
```

#### Radius

```txt
none
small
medium
large
full
```

#### Animation

```txt
none
light
cinematic
```

#### Project display

```txt
grid
bento
list
case-study
carousel
```

---

### 11.4 Formula Template Count

Contoh v1:

```txt
8 base templates
× 10 color presets
× 6 font presets
× 4 project layouts
× 3 animation modes
= 5.760 design combinations
```

Marketing bisa menyebut:

```txt
5.000+ portfolio styles
```

Bukan:

```txt
5.000 handcrafted templates
```

Karena itu misleading dan tidak scalable.

---

## 12. Hosting Model

### 12.1 Option A — Shared Next App

Request:

```txt
arik.app.com
```

Middleware:

```txt
hostname = arik.app.com
→ find site_domains.domain
→ get site_id
→ load latest published snapshot
→ render
```

Kelebihan:

- Cepat dibuat.
- Satu deploy.
- Cocok untuk MVP.
- Tidak butuh build per user.
- Mudah preview draft.

Kekurangan:

- Semua traffic masuk app yang sama.
- Perlu cache kuat.
- Bisa mahal kalau traffic besar.
- Cold start/server load bisa terasa.

---

### 12.2 Option B — Static Export Per Site

Flow:

```txt
User klik publish
→ generate static HTML/CSS/JS
→ upload ke object storage/CDN
→ custom domain serve dari CDN
```

Kelebihan:

- Sangat cepat.
- Murah untuk traffic besar.
- Cocok untuk SEO.
- Cocok untuk custom domain.
- Tidak membebani app utama.

Kekurangan:

- Build pipeline lebih kompleks.
- Update konten harus rebuild.
- Preview draft perlu mekanisme terpisah.
- Perlu queue worker.

---

### 12.3 Option C — Edge Rendering + KV Cache

Flow:

```txt
Request
→ edge resolve hostname
→ get snapshot from KV/cache
→ render atau serve cached HTML
```

Kelebihan:

- Cepat.
- Dynamic tapi tetap ringan.
- Cocok untuk global traffic.
- Cache invalidation bisa granular.

Kekurangan:

- Vendor lock-in.
- Debug lebih sulit.
- Beberapa library React/Node tidak cocok edge.
- Perlu desain cache matang.

---

### 12.4 Rekomendasi Hosting

| Phase | Hosting |
|---|---|
| MVP | Shared Next app |
| Beta | Shared app + aggressive cache |
| Paid custom domain | Static/ISR/CDN |
| Large scale | Hybrid static + edge cache |

Final recommendation:

```txt
Start simple with shared app.
Add static/CDN only after product validated.
```

---

## 13. Routing Strategy

### 13.1 Subdomain

Format:

```txt
username.app.com
```

Resolver:

```ts
function resolveTenant(hostname: string) {
  if (hostname.endsWith('.app.com')) {
    const slug = hostname.replace('.app.com', '');
    return findSiteBySubdomain(slug);
  }

  return findSiteByCustomDomain(hostname);
}
```

---

### 13.2 Custom Domain

Format:

```txt
arikriko.com
www.arikriko.com
portfolio.client.com
```

Flow:

```txt
User input domain
→ generate verification token
→ user add DNS TXT/CNAME
→ system verify
→ mark domain verified
→ route domain to site
→ SSL handled by platform
```

---

### 13.3 Domain Table

```txt
site_domains
- site_id
- domain
- type: subdomain/custom
- status: pending/verified/failed
- verification_token
- verified_at
```

---

## 14. Publishing Model

### 14.1 Draft vs Published

Admin edit tidak boleh langsung mengubah public website.

Flow:

```txt
Edit draft
→ Preview
→ Publish
→ Generate snapshot
→ Public site update
```

---

### 14.2 Published Snapshot

Snapshot menyimpan data final:

```json
{
  "site": {},
  "seo": {},
  "theme": {},
  "template": {},
  "sections": [],
  "generated_at": "2026-06-27T00:00:00Z"
}
```

Keuntungan:

- Public render cepat.
- Draft aman.
- Bisa rollback.
- Bisa versioning.
- Cache invalidation mudah.
- Cocok untuk static export.

---

### 14.3 Versioning

Setiap publish menghasilkan version baru:

```txt
v1 initial publish
v2 update projects
v3 update theme
v4 update SEO
```

Admin bisa rollback:

```txt
Rollback to v2
→ create v5 from v2 payload
```

Jangan menghapus history langsung.

---

## 15. Security Analysis

### 15.1 XSS Risk

Risiko:

- User memasukkan HTML/script di bio.
- User memasukkan malicious link.
- Guestbook berisi script.
- Template marketplace menjalankan arbitrary code.

Mitigasi:

- Jangan izinkan arbitrary HTML di MVP.
- Gunakan rich text terbatas.
- Sanitize output.
- Escape semua user content.
- Validasi URL.
- Gunakan CSP.
- `rel="noopener noreferrer"` untuk external link.
- Jangan render `dangerouslySetInnerHTML` kecuali sudah sanitize.

---

### 15.2 Malicious Template Author

Untuk MVP, tidak boleh ada upload template bebas.

Template hanya:

```txt
prebuilt React components from internal codebase
+ JSON config from user
```

Marketplace baru aman jika ada:

- Manual review
- Static analysis
- Sandbox
- No server-side code
- No arbitrary fetch
- No secret access
- No custom JS bebas
- Version approval

---

### 15.3 Tenant Data Leak

Risiko terbesar multi-tenant adalah data user A terbaca user B.

Mitigasi:

- Semua table tenant-owned wajib punya `site_id` atau `organization_id`.
- RLS wajib aktif.
- Test RLS dengan user berbeda.
- Jangan expose service role ke client.
- Server action harus validasi ownership.
- Public API hanya baca published snapshot.

---

### 15.4 Guestbook/Form Abuse

Risiko:

- Spam guestbook.
- Bot submit.
- Link phishing.
- Flood analytics.
- Abuse free tier.

Mitigasi:

- Rate limit per IP.
- CAPTCHA optional.
- Moderation queue.
- Profanity/spam filter.
- Disable guestbook per site.
- Email notification limit.
- Blocklist domain/link.

---

### 15.5 Custom Domain Abuse

Risiko:

- User klaim domain milik orang lain.
- Domain dipakai untuk phishing.
- DNS salah.
- SSL gagal.

Mitigasi:

- DNS verification wajib.
- Domain status pending sebelum aktif.
- Abuse reporting.
- Suspended status.
- Rate limit domain add.
- Manual review untuk domain mencurigakan.

---

## 16. SEO Strategy

### 16.1 Per-site SEO

Setiap site punya:

- Title
- Description
- Open Graph image
- Twitter card
- Canonical URL
- Robots setting
- Sitemap
- Favicon
- Structured data

---

### 16.2 Sitemap

Untuk portfolio sederhana:

```txt
/
/projects
/projects/[slug]
/resume
/contact
```

Jika one-page:

```txt
/
```

Sitemap harus per domain:

```txt
https://arik.app.com/sitemap.xml
https://arikriko.com/sitemap.xml
```

---

### 16.3 Duplicate Content

Jika user punya subdomain dan custom domain aktif, canonical harus mengarah ke domain utama.

Contoh:

```txt
canonical = https://arikriko.com
```

Bukan:

```txt
canonical = https://arik.app.com
```

---

### 16.4 SEO Risk

| Risk | Mitigasi |
|---|---|
| Duplicate content | Canonical per primary domain |
| Thin content | Onboarding checklist |
| Slow page | CDN/static/cache |
| Missing metadata | SEO wizard |
| Bad OG image | Auto-generate OG image |
| Draft indexed | Robots noindex untuk preview/draft |

---

## 17. Analytics Strategy

### 17.1 Metrics MVP

Minimal:

- Page views
- Unique visitors
- Referrer
- Country
- Device type
- Browser
- Top pages
- Click on social links
- Click on project links

---

### 17.2 Privacy

Analytics sebaiknya privacy-friendly:

- Jangan simpan IP mentah terlalu lama.
- Hash visitor ID.
- Jangan collect data sensitif.
- Sediakan toggle analytics.
- Jelaskan di privacy policy.

---

### 17.3 Analytics Table

```sql
create table page_views (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  path text not null,
  referrer text,
  user_agent text,
  country text,
  device text,
  visitor_hash text,
  created_at timestamptz default now()
);
```

---

## 18. Billing & Plan Limit

### 18.1 Rekomendasi Plan

| Feature | Free | Starter | Pro | Business |
|---|---:|---:|---:|---:|
| Sites | 1 | 1 | 3 | 10 |
| Subdomain | Yes | Yes | Yes | Yes |
| Custom domain | No | No/optional | Yes | Yes |
| Watermark | Yes | No | No | No |
| Templates | Limited | More | All | All |
| Analytics | Basic | Basic | Advanced | Advanced |
| Guestbook | Limited | Yes | Yes | Yes |
| Team member | No | No | 1–3 | 10 |
| Static export | No | No | Yes | Yes |
| Priority support | No | No | No | Yes |

---

### 18.2 Plan Enforcement

Plan limit harus dicek di server.

Contoh:

```txt
create site
→ check active subscription
→ count existing sites
→ compare with plan limit
→ allow/deny
```

Jangan hanya hide button di UI.

---

### 18.3 Free Tier Abuse Mitigation

- Limit 1 site.
- Limit page views per bulan.
- Watermark kecil.
- Template terbatas.
- Tidak ada custom domain.
- Guestbook moderation.
- Disable site jika abuse.
- Dormant site compression/archive.

---

## 19. Admin/CMS UX

### 19.1 Onboarding Flow

Flow MVP:

```txt
Sign up
→ Create organization
→ Pick template
→ Choose subdomain
→ Fill basic profile
→ Add projects
→ Preview
→ Publish
```

---

### 19.2 Dashboard Structure

```txt
Dashboard
├─ Overview
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
│  └─ Custom CSS later
├─ SEO
├─ Analytics
├─ Domains
├─ Billing
└─ Settings
```

---

### 19.3 Preview Mode

Preview harus bisa melihat draft tanpa publish.

URL:

```txt
/admin/sites/[siteId]/preview
```

Atau:

```txt
preview.app.com/[preview-token]
```

Preview token harus:

- Expired
- Read-only
- Tidak diindex
- Tidak masuk analytics publik

---

## 20. Migration Plan dari Repo Sekarang

### Phase 0 — Audit & Safety

Durasi: 2–3 hari

Tujuan:

- Pahami struktur data sekarang.
- Catat table existing.
- Catat component dependency.
- Backup DB.
- Pastikan admin existing tidak rusak.

Output:

- Migration checklist
- Current architecture map
- Risk list
- Backup plan

---

### Phase 1 — Refactor Renderer Tanpa Multi-tenant

Durasi: 1–2 minggu

Tujuan:

- Ubah `PortfolioClient` menjadi `SiteRenderer`.
- Buat `sectionRegistry`.
- Buat `templateRegistry`.
- Section order dari config lokal dulu.
- Belum perlu `site_id`.

Kenapa ini dulu?

Karena risiko paling kecil. Public page tetap satu user, tapi struktur sudah siap SaaS.

Deliverables:

- `SiteRenderer`
- `SectionRenderer`
- `sectionRegistry`
- `templateRegistry`
- 2–3 template config
- Existing portfolio tetap tampil sama

Acceptance criteria:

- Tampilan existing tidak rusak.
- Section bisa reorder dari config.
- Section bisa hide/show.
- Template bisa diganti tanpa ubah page utama.

---

### Phase 2 — Site Model + `site_id`

Durasi: 1–2 minggu

Tujuan:

- Tambah `organizations`.
- Tambah `sites`.
- Tambah `site_id` ke tabel konten.
- Backfill existing data ke tenant pertama.
- Update query data layer.

Deliverables:

- DB migration
- Backfill script
- Updated `src/lib/portfolio.ts`
- Updated admin actions
- First tenant/site created from current data

Acceptance criteria:

- Data existing tetap muncul.
- Admin CRUD membaca/menulis berdasarkan `site_id`.
- Tidak ada query global tanpa filter `site_id`.

---

### Phase 3 — RLS + Auth Multi-user

Durasi: 1–2 minggu

Tujuan:

- Aktifkan RLS di semua table tenant-owned.
- Tambah organization member.
- Server action validasi ownership.
- Test user A tidak bisa akses user B.

Deliverables:

- RLS policies
- Helper SQL function
- RLS test cases
- Admin ownership validation

Acceptance criteria:

- User hanya bisa akses site miliknya.
- Public hanya bisa akses published site.
- Service role tidak dipakai sembarangan.
- Tidak ada data leak antar tenant.

---

### Phase 4 — Subdomain Routing + Publish Snapshot

Durasi: 1–2 minggu

Tujuan:

- Tambah `site_domains`.
- Middleware resolve tenant by hostname.
- Publish flow generate snapshot.
- Public render dari snapshot.

Deliverables:

- Middleware tenant resolver
- Domain resolver
- Publish action
- Snapshot table
- Public page by hostname

Acceptance criteria:

- `username.app.com` render site yang benar.
- Draft tidak muncul di public.
- Publish update public page.
- Cache bisa di-revalidate saat publish.

---

### Phase 5 — Template Gallery + Theme Generator

Durasi: 2–3 minggu

Tujuan:

- 5–10 base template.
- Template picker.
- Theme picker.
- Font/color/layout combinations.
- Preview sebelum apply.

Deliverables:

- Template gallery
- Template preview
- Theme config editor
- More section variants

Acceptance criteria:

- User bisa pilih template.
- User bisa ganti warna/font/layout.
- Perubahan bisa preview.
- Template tidak merusak content.

---

### Phase 6 — Billing + Custom Domain

Durasi: 2–4 minggu

Tujuan:

- Plan limit.
- Payment provider.
- Custom domain.
- DNS verification.
- Remove watermark for paid user.

Deliverables:

- Billing table
- Subscription webhook
- Plan guard
- Domain settings
- Verification flow
- Custom domain resolver

Acceptance criteria:

- Free user kena limit.
- Paid user bisa custom domain.
- Domain harus verified sebelum aktif.
- Subscription expired menurunkan fitur sesuai aturan.

---

### Phase 7 — Static Export / CDN

Durasi: 3–6 minggu

Tujuan:

- Paid/custom domain bisa serve static.
- Build queue.
- CDN upload.
- Cache invalidation.

Deliverables:

- Build worker
- Static output
- CDN deployment
- Build logs
- Rollback static version

Acceptance criteria:

- Publish paid site bisa trigger build.
- Static site bisa serve cepat.
- Rollback bisa dilakukan.
- Failed build tidak merusak versi live.

---

### Phase 8 — Marketplace Template

Durasi: Nanti setelah produk valid

Tujuan:

- Author bisa submit template.
- Review template.
- Revenue share.
- Install template.

Tidak direkomendasikan untuk MVP.

---

## 21. Risk Analysis

| Risk | Impact | Probability | Mitigasi |
|---|---:|---:|---|
| Refactor terlalu besar | High | Medium | Phase 1 hanya renderer, tidak DB dulu |
| Data leak multi-tenant | Critical | Medium | RLS, tests, ownership validation |
| 1000 template tidak maintainable | High | High | Config-driven variation system |
| XSS dari content | High | Medium | Sanitize, no arbitrary HTML |
| Custom domain SSL ribet | Medium | Medium | Gunakan managed platform/CDN |
| Supabase limit | Medium | Medium | Cache, plan limits, snapshot |
| Free tier abuse | High | Medium | Rate limit, quota, watermark |
| SEO buruk | Medium | Medium | Sitemap, canonical, static option |
| Build pipeline kompleks | Medium | Medium | Static export hanya setelah MVP |
| Billing/webhook bug | High | Medium | Idempotent webhook, audit log |
| Marketplace security | Critical | High | Tunda sampai phase akhir |

---

## 22. Technical Decisions

### 22.1 Decision: Shared Schema + RLS

Dipilih karena:

- Cocok untuk MVP.
- Cocok untuk banyak tenant kecil.
- Mudah migrate dari repo sekarang.
- Tidak kompleks secara operasional.

Tidak dipilih:

- Schema-per-tenant
- DB-per-tenant

Alasan tidak dipilih:

- Terlalu kompleks untuk free-tier SaaS.
- Migration berat.
- Tidak perlu untuk portfolio kecil.

---

### 22.2 Decision: Config-driven Template

Dipilih karena:

- Aman.
- Mudah divalidasi.
- Tidak menjalankan arbitrary code.
- Cocok untuk user non-teknis.
- Maintenance lebih ringan.

Code template marketplace ditunda.

---

### 22.3 Decision: Published Snapshot

Dipilih karena:

- Memisahkan draft dan public.
- Memudahkan cache.
- Memudahkan rollback.
- Mengurangi query public.
- Cocok untuk static export nanti.

---

### 22.4 Decision: Hybrid Hosting

Dipilih karena:

- MVP cepat dengan shared app.
- Scale nanti dengan static/CDN.
- Paid user bisa dapat performa lebih baik.
- Tidak over-engineering di awal.

---

## 23. MVP Scope

### 23.1 Must Have

- [ ] `SiteRenderer`
- [ ] `SectionRenderer`
- [ ] `sectionRegistry`
- [ ] `templateRegistry`
- [ ] 2–3 base template
- [ ] `organizations`
- [ ] `sites`
- [ ] `site_id` di tabel konten
- [ ] RLS policies
- [ ] Subdomain routing
- [ ] Publish snapshot
- [ ] Admin choose template
- [ ] Admin reorder section
- [ ] Public render by hostname
- [ ] Basic analytics per site
- [ ] SEO per site

---

### 23.2 Should Have

- [ ] Theme picker
- [ ] Font picker
- [ ] Layout density picker
- [ ] Preview draft
- [ ] Guestbook moderation
- [ ] Basic plan limit
- [ ] Watermark free plan
- [ ] Sitemap per site
- [ ] OG image per site

---

### 23.3 Nice to Have

- [ ] Custom domain
- [ ] Billing
- [ ] Static export
- [ ] Advanced analytics
- [ ] Team member
- [ ] Template marketplace
- [ ] Revenue share author

---

### 23.4 Out of Scope MVP

- [ ] Arbitrary user HTML
- [ ] Arbitrary custom JS
- [ ] Marketplace template upload
- [ ] Enterprise tenant isolation
- [ ] DB-per-tenant
- [ ] Full visual drag-and-drop builder
- [ ] Complex animation editor
- [ ] E-commerce
- [ ] Blog CMS advanced

---

## 24. Estimated Timeline

### Solo Developer Estimate

| Phase | Estimate |
|---|---:|
| Audit + planning | 2–3 days |
| Renderer refactor | 1–2 weeks |
| Site model + migration | 1–2 weeks |
| RLS + auth multi-user | 1–2 weeks |
| Subdomain + publish snapshot | 1–2 weeks |
| Template gallery + theme generator | 2–3 weeks |
| Basic analytics/SEO polish | 3–5 days |
| QA + bugfix | 1 week |

Total MVP realistic:

```txt
8–12 weeks
```

Jika sambil kerja full-time, realistis:

```txt
12–16 weeks
```

---

## 25. Suggested Folder Structure

```txt
src/
├─ app/
│  ├─ (public)/
│  │  └─ page.tsx
│  ├─ admin/
│  │  └─ dashboard/
│  ├─ api/
│  │  ├─ track/
│  │  └─ publish/
│  └─ middleware.ts
│
├─ components/
│  ├─ site-renderer/
│  │  ├─ SiteRenderer.tsx
│  │  ├─ SectionRenderer.tsx
│  │  ├─ TemplateProvider.tsx
│  │  └─ ThemeProvider.tsx
│  │
│  ├─ sections/
│  │  ├─ hero/
│  │  ├─ projects/
│  │  ├─ career/
│  │  ├─ about/
│  │  └─ guestbook/
│  │
│  └─ admin/
│
├─ lib/
│  ├─ sites/
│  │  ├─ resolve-site.ts
│  │  ├─ load-site.ts
│  │  ├─ publish-site.ts
│  │  └─ plan-limits.ts
│  │
│  ├─ templates/
│  │  ├─ template-registry.ts
│  │  ├─ section-registry.ts
│  │  └─ template-utils.ts
│  │
│  ├─ supabase/
│  ├─ analytics/
│  └─ seo/
│
├─ types/
│  ├─ site.ts
│  ├─ template.ts
│  ├─ section.ts
│  └─ billing.ts
│
└─ db/
   ├─ migrations/
   └─ seeds/
```

---

## 26. File Terkait Repo Sekarang

| Area | Path | Action |
|---|---|---|
| Public UI entry | `src/app/page.tsx` | Ubah agar load site berdasarkan hostname |
| Portfolio renderer | `src/components/portfolio/PortfolioClient.tsx` | Refactor menjadi `SiteRenderer` |
| Sections | `src/components/infinite-field/sections/*` | Jadikan registry candidate |
| Theme preset | `src/lib/theme/landing-theme.ts` | Extend jadi theme config per site |
| Data layer | `src/lib/portfolio.ts` | Tambah `site_id` filter |
| Types | `src/types/portfolio.ts` | Tambah `Site`, `Section`, `Template` |
| SEO setting | `src/app/admin/dashboard/seo/page.tsx` | Pindah ke per-site SEO |
| Validation | `src/lib/admin/validation.ts` | Tambah schema section/template |
| Admin actions | `src/app/admin/actions.ts` | Validasi ownership |
| Supabase service | `src/lib/supabase/service.ts` | Pastikan server-only |
| Analytics | `src/lib/admin/analytics-data.ts` | Filter by `site_id` |
| Tracking API | `src/app/api/track/route.ts` | Tambah `site_id`, rate limit |

---

## 27. Implementation Backlog

### Epic 1 — Renderer Refactor

User story:

```txt
Sebagai developer,
aku ingin public page dirender dari config,
agar template dan section bisa dinamis.
```

Tasks:

- [ ] Create `SiteRenderer`
- [ ] Create `SectionRenderer`
- [ ] Create `sectionRegistry`
- [ ] Create `templateRegistry`
- [ ] Move existing sections into registry
- [ ] Add section config type
- [ ] Add fallback for unknown section
- [ ] Add visual regression check

---

### Epic 2 — Site & Tenant Model

User story:

```txt
Sebagai user,
aku ingin memiliki portfolio sendiri,
agar data tidak tercampur dengan user lain.
```

Tasks:

- [ ] Create `organizations`
- [ ] Create `organization_members`
- [ ] Create `sites`
- [ ] Add `site_id` to content tables
- [ ] Create first site from existing data
- [ ] Update data queries
- [ ] Update admin actions
- [ ] Add ownership validation

---

### Epic 3 — RLS Security

User story:

```txt
Sebagai platform,
aku ingin setiap tenant terisolasi,
agar data antar user tidak bocor.
```

Tasks:

- [ ] Enable RLS on tenant tables
- [ ] Create helper function
- [ ] Add policies
- [ ] Add test users
- [ ] Test cross-tenant access
- [ ] Review all server actions

---

### Epic 4 — Publish Flow

User story:

```txt
Sebagai user,
aku ingin bisa edit draft dan publish saat sudah siap,
agar website publik tidak berubah saat masih diedit.
```

Tasks:

- [ ] Create snapshot table
- [ ] Create publish action
- [ ] Create preview mode
- [ ] Create rollback action
- [ ] Revalidate public cache
- [ ] Track publish history

---

### Epic 5 — Routing

User story:

```txt
Sebagai visitor,
aku ingin membuka portfolio dari subdomain user,
agar setiap site punya alamat publik sendiri.
```

Tasks:

- [ ] Create `site_domains`
- [ ] Create middleware resolver
- [ ] Add subdomain lookup
- [ ] Add custom domain lookup
- [ ] Add 404 state
- [ ] Add suspended state
- [ ] Add domain settings UI

---

### Epic 6 — Template & Theme

User story:

```txt
Sebagai user,
aku ingin memilih tampilan portfolio,
agar website terasa personal dan profesional.
```

Tasks:

- [ ] Create template gallery
- [ ] Create template preview
- [ ] Add color presets
- [ ] Add font presets
- [ ] Add layout variants
- [ ] Add animation mode
- [ ] Add section reorder UI
- [ ] Add apply template action

---

## 28. Testing Strategy

### 28.1 Unit Test

- Section registry lookup
- Template config validation
- Site resolver
- Plan limit checker
- Publish payload generator
- SEO generator

---

### 28.2 Integration Test

- Create site
- Edit content
- Publish
- Public render
- Analytics tracking
- RLS access user A vs user B
- Domain resolver

---

### 28.3 Manual QA

- Existing portfolio masih sama.
- Template switch tidak menghapus data.
- Section reorder benar.
- Draft tidak muncul di public.
- Published site cepat.
- Mobile responsive.
- SEO metadata benar.
- Guestbook tidak spam.

---

## 29. Performance Strategy

### 29.1 Public Page

Target:

```txt
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Mitigasi:

- Render from snapshot.
- Cache public site.
- Optimize images.
- Lazy load heavy sections.
- Disable heavy animation on low-end device.
- Avoid large JS per template.
- Static/CDN for paid sites later.

---

### 29.2 Admin Dashboard

Admin boleh lebih dynamic, tapi tetap harus:

- Paginate projects.
- Debounce autosave.
- Lazy load analytics chart.
- Avoid huge client bundle.
- Use server actions carefully.

---

## 30. Open Questions

### Product

1. Target awal developer saja atau general freelancer juga?
2. Apakah ingin fokus Indonesia dulu?
3. Bahasa UI: Indonesia, Inggris, atau bilingual?
4. Free tier harus ada watermark atau tidak?
5. Template awal lebih condong ke developer atau creative portfolio?
6. Mau one-page only atau multi-page juga?
7. Guestbook perlu ada dari awal atau optional?

### Business

1. Pricing mau IDR atau USD?
2. Payment pakai Midtrans/Xendit/Stripe?
3. Custom domain masuk plan Pro atau add-on?
4. Free user dibatasi page views atau tidak?
5. Apakah agency bisa punya multiple client site?

### Technical

1. Hosting awal pakai Vercel, Cloudflare, atau self-host?
2. Domain utama platform apa?
3. Apakah perlu static export sejak awal?
4. Apakah analytics disimpan sendiri atau pakai provider?
5. Apakah image upload pakai Supabase Storage?
6. Apakah perlu background worker/queue dari awal?

### Migration

1. Data portfolio existing jadi tenant pertama?
2. Admin existing tetap satu user dulu atau langsung multi-user?
3. Apakah table existing boleh diubah langsung?
4. Perlu backup/rollback migration seperti apa?

---

## 31. Recommendation

Rekomendasi teknis paling aman:

```txt
Jangan mulai dari billing, custom domain, atau ribuan template.
Mulai dari renderer dan data model.
```

Urutan yang disarankan:

```txt
1. Refactor PortfolioClient → SiteRenderer
2. Buat sectionRegistry dan templateRegistry
3. Tambah sites + site_id
4. Aktifkan RLS
5. Buat publish snapshot
6. Buat subdomain routing
7. Buat template gallery
8. Baru billing/custom domain
```

Alasan:

- Mengurangi risiko rewrite.
- Bisa tetap memakai repo sekarang.
- Bisa validasi produk lebih cepat.
- Tidak terjebak over-engineering.
- Security multi-tenant bisa dikunci sejak awal.
- Template system bisa scale tanpa maintenance berat.

---

## 32. Decision Log

| Date | Decision | Reason |
|---|---|---|
| 2026-06-27 | R&D doc dibuat | Mengevaluasi feasibility SaaS portfolio |
| 2026-06-27 | Shared schema + RLS direkomendasikan | Cocok untuk banyak tenant kecil dan MVP |
| 2026-06-27 | Config-driven template direkomendasikan | Aman dan scalable untuk variasi template |
| 2026-06-27 | Hybrid hosting direkomendasikan | Shared app untuk MVP, static/CDN untuk scale |
| 2026-06-27 | Marketplace template ditunda | Risiko security dan maintenance tinggi |

---

## 33. Final R&D Conclusion

Repo sekarang **layak dijadikan SaaS Portfolio Platform** dengan pendekatan incremental.

Yang paling penting bukan membuat banyak template dulu, tapi membangun fondasi:

- Tenant-safe data model
- Data-driven renderer
- Section registry
- Template registry
- Publish snapshot
- Routing per site
- RLS security

Setelah fondasi ini stabil, fitur seperti ribuan variasi template, custom domain, billing, static hosting, dan marketplace bisa ditambahkan bertahap.

Kesimpulan akhir:

```txt
Feasible: Yes
Rewrite total: No
Recommended approach: Incremental refactor
MVP estimate: 8–12 weeks
Architecture: Shared schema + RLS + config-driven templates + hybrid hosting
Main risk: Tenant isolation, renderer refactor, template security
Next step: Start Phase 1 — PortfolioClient → SiteRenderer
```
