# Analisis & Perbaikan Paket SaaS Docs

> Tanggal: 2026-06-27  
> Status: Paket sudah diperbaiki menjadi versi v0.2

## Ringkasan

Zip awal berisi 30 dokumen Markdown untuk SaaS Portfolio Platform. Struktur dokumennya sudah bagus dan sudah mencakup roadmap, technical design, ERD, RLS, API, template system, migration, QA, deployment, monitoring, launch, dan GTM.

Masalah utamanya bukan isi yang salah total, tetapi inkonsistensi dan beberapa link/istilah yang bisa bikin bingung saat mulai implementasi.

## Masalah yang Ditemukan

| No | Masalah | Dampak |
|---:|---|---|
| 1 | Ada folder `__MACOSX` dan file `._*` dari macOS | Mengotori repo/dokumentasi |
| 2 | README referensi ke `../saas-rnd.md`, `../saas-prd.md`, `../saas-roadmap.md`, tapi file master tidak ada di zip | Link dokumentasi putus |
| 3 | Domain placeholder tersebar sebagai `platform.com`, sementara PRD pakai pola `platform.com` | Membingungkan saat setup DNS/env |
| 4 | Nama tabel snapshot tidak konsisten: `site_publish_snapshots` vs `site_publish_snapshots` | Bisa bikin salah migration |
| 5 | Decision log memakai tanggal `2026-06-12`, sedangkan paket dokumen bertanggal `2026-06-27` | Timeline/riwayat keputusan tidak sinkron |
| 6 | Billing terlalu mengunci ke Stripe, padahal konteks produk Indonesia masih mungkin Midtrans/Xendit | Keputusan bisnis terlalu cepat |
| 7 | Beberapa checklist launch/deployment menyebut Stripe day-1, padahal billing post-MVP | Scope MVP bisa melebar |
| 8 | Status dokumen masih `v0.1` | Tidak mencerminkan paket sudah direvisi |

## Perbaikan yang Dilakukan

| No | Perbaikan |
|---:|---|
| 1 | Menghapus metadata macOS dari paket final |
| 2 | Menambahkan master docs root: `saas-rnd.md`, `saas-prd.md`, `saas-roadmap.md` |
| 3 | Menormalisasi domain placeholder menjadi `platform.com` dan `{slug}.platform.com` |
| 4 | Menormalisasi nama tabel menjadi `site_publish_snapshots` |
| 5 | Menyamakan tanggal decision log menjadi `2026-06-27` |
| 6 | Mengubah billing spec menjadi provider-agnostic: Stripe / Midtrans / Xendit |
| 7 | Menyesuaikan deployment, launch, monitoring, security, dan task docs agar billing tetap post-MVP |
| 8 | Menaikkan status dokumen menjadi `Draft v0.3` |
| 9 | Menambahkan catatan paket revisi di README |

## Rekomendasi Lanjutan

Urutan berikutnya setelah paket ini:

1. Review `saas-technical-design.md`
2. Review `saas-database-design-erd.md`
3. Review `saas-supabase-rls-policies.md`
4. Review `saas-renderer-refactor-plan.md`
5. Review `saas-implementation-tasks.md`
6. Baru mulai implementasi Phase 1

## Catatan yang Masih Perlu Diputuskan

- Nama produk final.
- Domain final.
- Hosting final: Vercel, Cloudflare, atau self-host.
- Payment provider final: Stripe, Midtrans, atau Xendit.
- Apakah MVP wajib guestbook atau optional.
- Apakah public beta langsung pakai billing atau billing ditunda.

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

---

## Detail v0.3 — Apa yang Ditingkatkan

- Semua dokumen ditambah detail implementasi.
- Tiap area punya checklist.
- Tiap area punya acceptance criteria tambahan.
- Naming tetap `saas-*.md`.
- Istilah teknis disamakan.
- Fokus implementasi dibuat lebih jelas.
