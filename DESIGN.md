# CMS Dashboard Design Spec

Referensi visual: Dribbble shot **“CMS / Content management dashboard UI Design”** oleh Sharmin Akter Diti. Dokumen ini bukan instruksi untuk menyalin 1:1, tetapi adaptasi arah visual, layout, dan komponen agar bisa dipakai sebagai design guideline untuk implementasi dashboard CMS.

---

## 1. Arah Desain

Dashboard memakai gaya **clean SaaS admin dashboard** dengan background terang, sidebar kiri, topbar sederhana, card putih, border halus, radius sedang, dan visual data yang ringan. Fokus utamanya adalah membuat admin cepat melihat status konten, aktivitas user, statistik performa, dan shortcut pengelolaan CMS.

Kesan utama yang perlu dijaga adalah **rapi, ringan, modern, tidak terlalu ramai, dan mudah discan**. UI tidak perlu terlalu dekoratif; yang penting data terlihat jelas, jarak antar elemen lega, dan hierarchy visual terasa kuat.

---

## 2. Tujuan Layar

Layar dashboard harus membantu admin untuk:

- Melihat ringkasan performa CMS.
- Mengakses modul utama seperti Pages, Posts, Media Files, Categories, Tags, Comments, Settings, dan Users.
- Melihat grafik aktivitas user/content.
- Melihat statistik ringkas seperti visitor, subscriber, contributor, author, grade, page size, load time, dan request.
- Mengakses aksi cepat seperti membuat page, category/template, user alteration, dan post.

---

## 3. Struktur Layout

### Desktop Layout

Gunakan struktur 3 area utama:

```txt
┌──────────────────────────────────────────────────────────────┐
│ Sidebar │ Topbar                                             │
│         ├────────────────────────────────────────────────────┤
│         │ Content Area                                       │
│         │ ┌──────────── Shortcut Cards ────────────────────┐ │
│         │ ├──────────── Main Chart ───────┬── Stat Card ───┤ │
│         │ ├──────────── KPI Cards ────────┴── Stat Card ───┤ │
└─────────┴────────────────────────────────────────────────────┘
```

Recommended desktop size:

- Sidebar width: `220px - 260px`
- Topbar height: `64px - 72px`
- Content padding: `24px - 32px`
- Card radius: `12px - 16px`
- Grid gap: `16px - 24px`

---

## 4. Information Architecture

### Sidebar Menu

Menu utama:

- Dashboard
- Pages
- Posts
- Media Files
- Categories
- Tags
- Comments
- Settings
- Users

Sidebar harus punya active state yang jelas. Pada referensi, active menu memakai background soft dan teks lebih tebal. Untuk implementasi, gunakan active background biru muda atau abu muda agar tidak terlalu mencolok.

### User List / Team Status

Bagian bawah sidebar dapat dipakai untuk daftar user/team kecil dengan avatar dan status online/offline. Ini cocok kalau CMS punya workflow multi-user seperti editor, author, admin, atau reviewer.

---

## 5. Komponen Utama

### 5.1 Topbar

Topbar berisi:

- Search input di kiri.
- Navigation shortcut kecil di tengah: Dashboard, Pages, Posts, Files, Users.
- Notification icon.
- Profile avatar dan nama user di kanan.

Search input harus dibuat minimal, tidak terlalu dominan. Profile area harus bisa diklik untuk membuka account menu.

### 5.2 Shortcut Cards

Shortcut cards berada di bagian atas content. Fungsinya sebagai aksi cepat dan ringkasan modul.

Contoh card:

- About Page Company
- Category/Templates
- New User Alteration
- Add New Post / Second Post

Isi card:

- Icon kecil berwarna.
- Judul card.
- Deskripsi singkat 1-2 baris.
- Metadata kecil seperti tanggal, kategori, atau author.
- Menu action `three dots` di kanan atas.

Card ini tidak boleh terlalu tinggi. Fokusnya adalah quick access, bukan detail penuh.

### 5.3 User Stat Chart

Chart utama berada di kiri tengah dan menjadi elemen terbesar. Gunakan area chart atau line chart dengan warna soft purple/blue.

Isi chart:

- Title: `User Stat`
- Filter: `Weekly`, `Monthly`, `Yearly`
- Tooltip saat hover.
- Axis tipis dan tidak terlalu gelap.

Catatan penting: di referensi visual, chart terlihat bagus, tetapi label dan value masih kecil. Untuk implementasi production, ukuran label harus lebih readable.

### 5.4 Statistic Card

Statistic card kanan atas berisi perbandingan beberapa data seperti:

- Visitors
- Subscriber
- Contributor
- Author

Gunakan kombinasi legend + vertical bar chart. Warna tiap kategori harus konsisten di semua bagian dashboard.

### 5.5 KPI Cards

Bagian bawah chart berisi card kecil untuk angka ringkas.

Contoh KPI:

- Comments
- Posts
- Pages
- Categories

Isi card:

- Label
- Persentase perubahan
- Circular mini progress / icon trend
- Angka utama
- Link kecil `View All`

KPI card harus sederhana. Jangan terlalu banyak teks agar admin bisa scan cepat.

### 5.6 Performance Statistic Card

Card kanan bawah berisi data teknis/performa seperti:

- Grade
- Page Size
- Load Time
- Requests
- Circular progress score

Komponen ini cocok untuk CMS yang ingin menampilkan health/performance website.

---

## 6. Visual Style

### Warna

Gunakan warna netral sebagai base dan warna aksen hanya untuk status/data.

```css
--color-bg: #F7F8FA;
--color-surface: #FFFFFF;
--color-border: #EEF0F3;
--color-text-primary: #111827;
--color-text-secondary: #6B7280;
--color-text-muted: #9CA3AF;

--color-primary: #2563EB;
--color-purple: #A855F7;
--color-red: #EF4444;
--color-orange: #F59E0B;
--color-green: #22C55E;
--color-blue: #3B82F6;
```

### Typography

Recommended font:

- `Inter`
- `SF Pro Display`
- `Plus Jakarta Sans`

Scale:

```css
--font-xs: 11px;
--font-sm: 12px;
--font-md: 14px;
--font-lg: 16px;
--font-xl: 20px;
--font-2xl: 24px;
```

Usage:

- Page title: `20px - 24px`, semibold.
- Card title: `14px - 16px`, semibold.
- Body text: `12px - 14px`, regular.
- Metadata: `11px - 12px`, muted.
- KPI number: `18px - 22px`, semibold.

### Spacing

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
```

### Radius & Shadow

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;

--shadow-card: 0 8px 24px rgba(15, 23, 42, 0.04);
```

Gunakan shadow sangat halus. Jangan pakai shadow tebal karena desain ini mengandalkan clean surface, bukan efek 3D.

---

## 7. Kritik Desain Referensi

Desain referensi sudah kuat untuk tampilan portfolio karena clean, modern, dan nyaman dilihat. Layout-nya juga jelas: sidebar untuk navigasi, topbar untuk search/profile, area utama untuk statistik dan chart.

Namun untuk production, ada beberapa hal yang perlu diperbaiki:

- Beberapa teks terlalu kecil dan bisa sulit dibaca di layar laptop kecil.
- Contrast border dan teks muted terlalu tipis jika dipakai harian.
- Chart terlihat cantik, tetapi informasi detailnya kurang kuat tanpa tooltip dan label yang jelas.
- Shortcut card di atas cukup banyak, jadi perlu state hover dan action yang jelas agar tidak terasa hanya dekorasi.
- Sidebar user list bagus secara visual, tapi harus dipastikan memang berguna; kalau tidak, lebih baik diganti recent activity atau workspace switcher.

---

## 8. Responsive Behavior

### Desktop

Sidebar selalu tampil. Content memakai 12-column grid.

```txt
Shortcut cards: 4 columns
Main chart: 8 columns
Right stats: 4 columns
KPI cards: 4 columns inside left area
```

### Tablet

Sidebar bisa diperkecil menjadi icon-only. Shortcut cards menjadi 2 columns. Chart dan stats turun menjadi stack vertikal.

### Mobile

Dashboard tidak boleh dipaksa sama seperti desktop. Untuk mobile:

- Sidebar berubah menjadi bottom navigation atau drawer.
- Shortcut cards menjadi horizontal scroll.
- Chart full width.
- Statistic cards stack 1 column.
- KPI cards 2 column atau 1 column tergantung ukuran.

---

## 9. Interaction State

Setiap komponen clickable harus punya state:

```txt
Default: normal surface
Hover: background sedikit lebih gelap / shadow naik tipis
Active: border primary atau background soft blue
Focus: outline primary untuk accessibility
Disabled: opacity 50%, cursor not-allowed
Loading: skeleton block
Empty: ilustrasi kecil + teks singkat + CTA
Error: alert card ringan dengan action retry
```

---

## 10. Data Model UI

### Dashboard Summary Card

```ts
type DashboardShortcut = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'purple' | 'red' | 'green' | 'orange';
  meta: {
    date?: string;
    category?: string;
    author?: string;
  };
};
```

### KPI Card

```ts
type KpiCard = {
  id: string;
  label: string;
  value: number | string;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
  href: string;
};
```

### Statistic Item

```ts
type StatisticItem = {
  id: string;
  label: string;
  value: number | string;
  color: string;
};
```

---

## 11. Implementation Notes

Frontend stack yang cocok:

- Next.js / React
- Tailwind CSS
- shadcn/ui untuk base component
- Recharts / Tremor / Nivo untuk chart
- Lucide React untuk icon

Komponen yang perlu dibuat:

```txt
DashboardLayout
Sidebar
Topbar
SearchInput
ProfileMenu
ShortcutCard
ChartCard
StatisticCard
KpiCard
PerformanceCard
PeriodTabs
```

Struktur folder contoh:

```txt
src/
  app/
    dashboard/
      page.tsx
  components/
    layout/
      dashboard-layout.tsx
      sidebar.tsx
      topbar.tsx
    dashboard/
      shortcut-card.tsx
      chart-card.tsx
      statistic-card.tsx
      kpi-card.tsx
      performance-card.tsx
  lib/
    dashboard-data.ts
```

---

## 12. Acceptance Criteria

Dashboard dianggap selesai jika:

- Sidebar, topbar, shortcut cards, chart, statistic cards, dan KPI cards sudah tampil rapi.
- Layout desktop tidak overflow di lebar `1366px`.
- Tablet dan mobile tidak pecah.
- Semua card punya hover/focus state.
- Data loading punya skeleton.
- Empty state tersedia untuk chart dan card.
- Warna chart konsisten dengan legend.
- Font minimal masih terbaca di ukuran laptop normal.
- UI tetap ringan tanpa dekorasi berlebihan.

---

## 13. Final Direction

Desain ini cocok dipakai untuk CMS internal, admin panel, analytics dashboard, atau dashboard multi-role. Jangan terlalu fokus meniru detail visual referensi. Ambil polanya: **clean layout, card-based dashboard, soft color, strong hierarchy, dan data yang mudah discan**.
