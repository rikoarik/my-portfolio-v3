# Daftar Lengkap Test Case E2E (Browser Automation)

## Konteks Pengujian
- Base URL: `http://localhost:3000`
- Pendekatan: QA engineer (user flow + critical functionality)
- Status eksekusi saat ini:
  - Berhasil dieksekusi: eksplorasi browser dasar via Playwright MCP pada homepage, admin login, redirect dashboard tanpa session, dan halaman 404
  - Diverifikasi dari source: fitur admin CMS, guestbook public form, auth guard, state banner, dan modul CRUD utama

## Ringkasan Hasil Uji Aktual (sudah dijalankan)
- `/` -> **200**
- `/admin/login` -> **200**
- Seluruh `/admin/dashboard/*` tanpa login -> **307 redirect** ke `/admin/login?next=...`
- Route invalid (`/route-tidak-ada`) -> **404**
- Homepage menampilkan skip link `Lewati ke konten`
- Halaman login menampilkan form `Admin CMS`
- Halaman 404 menampilkan CTA `Take me home`

---

## Cakupan Fitur Teridentifikasi

### Public
- Homepage / landing page portfolio
- Skip link aksesibilitas ke konten utama
- Navigasi section di homepage
- Guestbook public dengan modal `Leave a Message`
- Submit pesan guestbook publik
- Halaman 404 custom dengan CTA kembali ke home

### Admin / Authentication
- Login admin via email + password
- Redirect guard untuk seluruh `/admin/dashboard/*`
- Validasi role admin via tabel `admin_users`
- Logout admin

### Admin / CMS Modules
- Dashboard analytics
- Profile / site profile update
- Projects: create, update, delete, reorder
- Experiences: create, update, delete, reorder
- Guestbook moderation: filter, update status, moderation note, delete
- Sections: create, update, delete
- Media: create, update, delete, open asset
- SEO global settings: update
- SEO page overrides: create, update, delete
- Loader settings: update

---

## 1) Authentication (login, logout, register)

### AUTH-01 — Redirect ke login saat akses dashboard tanpa session
**Langkah pengujian**
1. Hapus cookie/session browser.
2. Buka `/admin/dashboard`.

**Expected result**
- User di-redirect ke `/admin/login`.
- Query `next` berisi route asal.

### AUTH-02 — Login admin berhasil
**Langkah pengujian**
1. Buka `/admin/login`.
2. Isi email + password admin valid.
3. Klik tombol `Masuk`.

**Expected result**
- Redirect ke `/admin/dashboard`.
- Sidebar CMS tampil.

### AUTH-03 — Login gagal (password salah)
**Langkah pengujian**
1. Buka `/admin/login`.
2. Isi email valid + password salah.
3. Submit form.

**Expected result**
- Tetap di halaman login.
- Muncul pesan error autentikasi.

### AUTH-04 — Logout admin
**Langkah pengujian**
1. Login sebagai admin.
2. Klik tombol `Keluar` di sidebar admin.
3. Akses ulang `/admin/dashboard`.

**Expected result**
- Session berakhir.
- User kembali ke login (redirect saat akses dashboard).

### AUTH-05 — User non-admin ditolak ke dashboard
**Langkah pengujian**
1. Login dengan user yang ada di Auth tapi tidak ada di tabel `admin_users`.
2. Buka `/admin/dashboard`.

**Expected result**
- Redirect ke `/?error=forbidden`.

### AUTH-06 — Register admin tidak tersedia publik
**Langkah pengujian**
1. Buka `/admin/login`.
2. Verifikasi tidak ada tombol/tautan register.
3. Akses `/admin/register`.

**Expected result**
- Tidak ada flow register publik.
- Route register tidak valid (404 atau tidak tersedia).

### AUTH-07 — Link kembali ke portfolio dari login
**Langkah pengujian**
1. Buka `/admin/login`.
2. Klik link `← Kembali ke portofolio`.

**Expected result**
- User diarahkan ke `/`.

---

## 2) Navigation

### NAV-01 — Navigasi sidebar admin ke semua modul
**Langkah pengujian**
1. Login admin.
2. Klik menu: Dashboard, Profil situs, Projects, Experiences, Guestbook, Sections, Media, SEO, Loader.

**Expected result**
- Tiap klik membuka route yang benar sesuai label menu.

### NAV-02 — Link `Lihat situs` dari admin
**Langkah pengujian**
1. Login admin.
2. Klik `Lihat situs` pada sidebar.

**Expected result**
- User berpindah ke `/`.

### NAV-03 — Skip link aksesibilitas homepage
**Langkah pengujian**
1. Buka `/`.
2. Gunakan keyboard focus di awal halaman.
3. Aktifkan link `Lewati ke konten`.

**Expected result**
- Fokus lompat ke area konten utama (`#hero-title`).

### NAV-04 — 404 navigation
**Langkah pengujian**
1. Buka route tidak valid.
2. Klik CTA kembali ke home (jika tersedia).

**Expected result**
- Halaman 404 tampil.
- CTA kembali ke `/`.

### NAV-05 — Redirect `next` kembali ke dashboard target setelah login
**Langkah pengujian**
1. Akses `/admin/dashboard/projects` saat belum login.
2. Pastikan redirect ke `/admin/login?next=%2Fadmin%2Fprojects` atau route asal setara.
3. Login dengan kredensial valid.

**Expected result**
- Setelah login, user kembali ke area dashboard yang diminta atau minimal masuk ke dashboard tanpa kehilangan intent navigasi.

---

## 3) UI Rendering

### UI-01 — Login form render lengkap
**Langkah pengujian**
1. Buka `/admin/login`.

**Expected result**
- Judul `Admin CMS` tampil.
- Input email, password, tombol `Masuk` tampil.

### UI-02 — Dashboard analytics cards render
**Langkah pengujian**
1. Login admin.
2. Buka `/admin/dashboard`.

**Expected result**
- Card analytics tampil: Projects, Experiences, Guestbook, Sections, Media Assets, SEO Pages.

### UI-03 — Status banner pada list pages render
**Langkah pengujian**
1. Jalankan aksi simpan/hapus pada Projects/Experiences/Guestbook/Sections/Media/SEO.
2. Kembali ke list page.

**Expected result**
- Banner status (`Tersimpan`, `Terhapus`, `Urutan diperbarui`, dst.) tampil sesuai query state.

### UI-04 — Empty state guestbook admin
**Langkah pengujian**
1. Buka admin guestbook dengan filter yang tidak punya data.

**Expected result**
- Tampil pesan `Belum ada pesan untuk filter ini.`

### UI-05 — Home page render tanpa crash
**Langkah pengujian**
1. Buka `/`.

**Expected result**
- Halaman publik ter-render normal tanpa error fatal.

### UI-06 — Modal guestbook public render lengkap
**Langkah pengujian**
1. Buka `/`.
2. Scroll ke section guestbook.
3. Klik CTA untuk membuka form pesan.

**Expected result**
- Modal tampil.
- Judul `Leave a Message` tampil.
- Field `Your Name`, `Message`, tombol `Post Message`, dan tombol tutup tampil.

### UI-07 — Dashboard sidebar render lengkap
**Langkah pengujian**
1. Login admin.
2. Buka halaman dashboard mana pun.

**Expected result**
- Sidebar menampilkan menu: Dashboard, Profil situs, Projects, Experiences, Guestbook, Sections, Media, SEO, Loader, `Lihat situs`, dan tombol `Keluar`.

---

## 4) Form Validation

### FV-01 — Login required field
**Langkah pengujian**
1. Buka `/admin/login`.
2. Kosongkan email/password.
3. Submit.

**Expected result**
- Submit diblok oleh validasi required.

### FV-02 — Login email format
**Langkah pengujian**
1. Isi email invalid (contoh `abc`).
2. Isi password.
3. Submit.

**Expected result**
- Validasi email menolak submit.

### FV-03 — Profile form email type validation
**Langkah pengujian**
1. Login admin, buka `/admin/dashboard/profile`.
2. Isi field email dengan format invalid.
3. Submit.

**Expected result**
- Form tidak boleh tersubmit (validation type email).

### FV-04 — New project title wajib
**Langkah pengujian**
1. Buka `/admin/dashboard/projects/new`.
2. Kosongkan `Title`.
3. Submit.

**Expected result**
- Submit ditolak (required).

### FV-05 — Cover URL project valid URL
**Langkah pengujian**
1. Isi `cover_url` bukan URL valid.
2. Submit.

**Expected result**
- Validasi URL menolak nilai invalid.

### FV-06 — Sections `section_key` wajib
**Langkah pengujian**
1. Buka `/admin/dashboard/sections`.
2. Kosongkan input `section_key`.
3. Submit.

**Expected result**
- Submit ditolak (required).

### FV-07 — Media field wajib
**Langkah pengujian**
1. Buka `/admin/dashboard/media`.
2. Kosongkan `path` atau `public_url`.
3. Submit.

**Expected result**
- Submit ditolak (required).

### FV-08 — Loader field wajib
**Langkah pengujian**
1. Buka `/admin/dashboard/loader`.
2. Kosongkan `label` atau `messages`.
3. Submit.

**Expected result**
- Submit ditolak (required).

### FV-09 — Guestbook public required field
**Langkah pengujian**
1. Buka modal guestbook publik.
2. Kosongkan `Your Name` dan `Message`.
3. Submit.

**Expected result**
- Submit diblok oleh validasi required atau muncul pesan error.

### FV-10 — Guestbook public whitespace-only validation
**Langkah pengujian**
1. Buka modal guestbook publik.
2. Isi `Your Name` dan `Message` hanya dengan spasi.
3. Submit.

**Expected result**
- Muncul pesan `Nama dan pesan wajib diisi.`

### FV-11 — SEO page `page_key` wajib
**Langkah pengujian**
1. Buka `/admin/dashboard/seo`.
2. Pada form `Tambah SEO page`, kosongkan `page_key`.
3. Submit.

**Expected result**
- Submit ditolak (required).

### FV-12 — SEO URL fields harus valid URL
**Langkah pengujian**
1. Isi `default_og_image_url`, `canonical_url`, atau `og_image_url` dengan nilai non-URL.
2. Submit form terkait.

**Expected result**
- Request ditolak validasi schema/server.

### FV-13 — Sections meta JSON valid
**Langkah pengujian**
1. Buka `/admin/dashboard/sections`.
2. Isi field `meta` dengan JSON invalid.
3. Submit.

**Expected result**
- Request gagal diproses.
- Data tidak tersimpan.

### FV-14 — SEO metadata JSON valid
**Langkah pengujian**
1. Buka `/admin/dashboard/seo`.
2. Isi field `metadata` dengan JSON invalid pada SEO global atau SEO page.
3. Submit.

**Expected result**
- Request gagal diproses.
- Data tidak tersimpan.

---

## 5) CRUD Operations

### CRUD-01 — Create project
**Langkah pengujian**
1. Login admin.
2. Buka `/admin/dashboard/projects/new`.
3. Isi data valid.
4. Klik `Create`.

**Expected result**
- Data project baru muncul di list `/admin/dashboard/projects`.

### CRUD-02 — Update project
**Langkah pengujian**
1. Buka edit project `/admin/dashboard/projects/{id}`.
2. Ubah field (misal subtitle/tags).
3. Klik `Save`.

**Expected result**
- Perubahan tersimpan dan terlihat saat reload.

### CRUD-03 — Delete project
**Langkah pengujian**
1. Dari list projects klik `Delete` pada satu item.

**Expected result**
- Item hilang dari list.

### CRUD-04 — Reorder project (up/down)
**Langkah pengujian**
1. Dari list projects, klik tombol `↑` atau `↓`.

**Expected result**
- Urutan item berubah sesuai arah.

### CRUD-05 — Create experience
**Langkah pengujian**
1. Buka `/admin/dashboard/experiences/new`.
2. Isi data valid.
3. Submit.

**Expected result**
- Experience baru muncul di list.

### CRUD-06 — Update + delete experience
**Langkah pengujian**
1. Edit satu experience lalu simpan.
2. Delete satu experience.

**Expected result**
- Update tersimpan.
- Item delete hilang dari list.

### CRUD-07 — Moderasi guestbook (update status)
**Langkah pengujian**
1. Buka `/admin/dashboard/guestbook`.
2. Klik status `approved`/`hidden` pada satu pesan.

**Expected result**
- Status pesan berubah dan tersimpan.

### CRUD-08 — Simpan catatan moderasi guestbook
**Langkah pengujian**
1. Isi `Catatan moderasi` pada satu pesan.
2. Klik `Simpan catatan`.

**Expected result**
- Catatan tersimpan dan tetap ada saat reload.

### CRUD-09 — Delete guestbook message
**Langkah pengujian**
1. Klik `Delete` pada satu pesan guestbook.

**Expected result**
- Pesan terhapus dari list.

### CRUD-10 — Profile update
**Langkah pengujian**
1. Buka `/admin/dashboard/profile`.
2. Ubah nama/tagline/email.
3. Klik `Simpan`.

**Expected result**
- Data profil tersimpan.

### CRUD-11 — Sections create/update/delete
**Langkah pengujian**
1. Tambah section content baru.
2. Edit section existing.
3. Delete section existing.

**Expected result**
- Semua perubahan tersimpan sesuai aksi.

### CRUD-12 — Media create/update/delete
**Langkah pengujian**
1. Tambah media baru.
2. Edit metadata media.
3. Delete media.

**Expected result**
- Semua aksi CRUD berhasil.

### CRUD-13 — SEO global + SEO pages CRUD
**Langkah pengujian**
1. Simpan SEO global.
2. Tambah SEO page.
3. Update SEO page.
4. Delete SEO page.

**Expected result**
- Data SEO global dan per-page berubah sesuai input.

### CRUD-14 — Loader settings update
**Langkah pengujian**
1. Ubah label/messages/animation/color di `/admin/dashboard/loader`.
2. Submit.

**Expected result**
- Konfigurasi loader tersimpan.

### CRUD-15 — Guestbook public create message
**Langkah pengujian**
1. Buka `/`.
2. Buka modal guestbook.
3. Isi nama dan pesan valid.
4. Submit.

**Expected result**
- Muncul status sukses `Pesan terkirim! Sampai jumpa di rute pelayaran.`
- Tombol submit berubah ke state sukses/disabled.
- Pesan baru tercatat di admin guestbook dengan status `pending`.

### CRUD-16 — Open media asset dari admin list
**Langkah pengujian**
1. Login admin.
2. Buka `/admin/dashboard/media`.
3. Klik link `Open asset` pada salah satu item.

**Expected result**
- Asset terbuka pada tab/window baru.
- URL yang dibuka sesuai `public_url` item.

---

## 6) Error Handling

### ERR-01 — Invalid project ID menampilkan not found
**Langkah pengujian**
1. Buka `/admin/dashboard/projects/{id_tidak_ada}`.

**Expected result**
- Halaman not found (record tidak ditemukan).

### ERR-02 — Invalid experience ID menampilkan not found
**Langkah pengujian**
1. Buka `/admin/dashboard/experiences/{id_tidak_ada}`.

**Expected result**
- Halaman not found (record tidak ditemukan).

### ERR-03 — Login error state dari query param
**Langkah pengujian**
1. Buka `/admin/login?error=1`.

**Expected result**
- Pesan `Autentikasi gagal. Coba lagi.` tampil.

### ERR-04 — Guestbook server error handling
**Langkah pengujian**
1. Simulasikan insert guestbook gagal dari backend.
2. Kirim pesan dari form guestbook publik.

**Expected result**
- User menerima pesan error yang jelas, tanpa crash halaman.

### ERR-05 — Route tidak ada
**Langkah pengujian**
1. Akses route random.

**Expected result**
- Return 404.

### ERR-06 — Guestbook public gagal saat Supabase tidak terhubung
**Langkah pengujian**
1. Jalankan aplikasi tanpa koneksi/env Supabase anon.
2. Kirim pesan dari modal guestbook publik.

**Expected result**
- Muncul pesan `Supabase tidak terhubung.`
- Halaman tidak crash.

### ERR-07 — Akses dashboard tanpa env Supabase
**Langkah pengujian**
1. Jalankan app tanpa `NEXT_PUBLIC_SUPABASE_URL` atau `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Buka `/admin/dashboard`.

**Expected result**
- Muncul instruksi konfigurasi env.
- Halaman tidak blank/crash.

---

## 7) Edge Cases

### EDGE-01 — Double click submit login
**Langkah pengujian**
1. Isi kredensial valid.
2. Klik tombol `Masuk` berulang cepat.

**Expected result**
- Tombol masuk menjadi disabled saat submit.
- Tidak terjadi submit ganda.

### EDGE-02 — Reorder boundary item
**Langkah pengujian**
1. Pada list projects/experiences, cek item teratas dan terbawah.
2. Klik tombol arah yang seharusnya tidak valid.

**Expected result**
- Tombol boundary disabled.
- Tidak ada error.

### EDGE-03 — Guestbook filter tanpa data
**Langkah pengujian**
1. Filter guestbook ke status yang kosong.

**Expected result**
- Empty state tampil, halaman tetap stabil.

### EDGE-04 — Input whitespace-only di form guestbook publik
**Langkah pengujian**
1. Isi nama/pesan hanya spasi.
2. Submit.

**Expected result**
- Ditolak dengan pesan `Nama dan pesan wajib diisi.`

### EDGE-05 — Supabase env tidak tersedia
**Langkah pengujian**
1. Jalankan app tanpa env Supabase.
2. Buka halaman admin dashboard.

**Expected result**
- Muncul pesan konfigurasi env, tidak crash.

### EDGE-06 — Tutup modal guestbook dengan Escape
**Langkah pengujian**
1. Buka modal guestbook publik.
2. Tekan tombol `Escape`.

**Expected result**
- Modal tertutup.
- Fokus kembali ke elemen pemicu atau tetap stabil di halaman.

### EDGE-07 — Tutup modal guestbook dengan klik backdrop
**Langkah pengujian**
1. Buka modal guestbook publik.
2. Klik area backdrop di luar panel modal.

**Expected result**
- Modal tertutup dengan aman.

### EDGE-08 — Tombol submit guestbook disabled setelah sukses
**Langkah pengujian**
1. Kirim pesan guestbook valid.
2. Setelah sukses, klik tombol submit lagi.

**Expected result**
- Tombol tidak bisa dipakai untuk submit ulang.
- Tidak terjadi duplikasi kirim.

---

## 8) Performance ringan (load page)

### PERF-01 — Homepage load response
**Langkah pengujian**
1. Buka `/` dari cold start.
2. Ukur waktu response/load dasar.

**Expected result**
- Halaman terbuka cepat dan stabil (baseline lokal konsisten).

### PERF-02 — Login page load response
**Langkah pengujian**
1. Buka `/admin/login`.
2. Ukur waktu sampai form interaktif.

**Expected result**
- Form login siap dipakai tanpa delay berlebih.

### PERF-03 — Redirect admin guard cepat
**Langkah pengujian**
1. Akses `/admin/dashboard/*` tanpa login.
2. Ukur durasi redirect ke login.

**Expected result**
- Redirect cepat dan konsisten.

### PERF-04 — Modal guestbook terbuka ringan
**Langkah pengujian**
1. Buka `/`.
2. Buka modal guestbook.
3. Ukur waktu dari klik CTA sampai modal interaktif.

**Expected result**
- Modal terbuka mulus tanpa freeze signifikan.

---

## 9) Security basic (input validation)

### SEC-01 — Proteksi route admin
**Langkah pengujian**
1. Tanpa login, akses semua route `/admin/dashboard/*`.

**Expected result**
- Seluruh route terproteksi via redirect ke login.

### SEC-02 — Role-based access admin
**Langkah pengujian**
1. Login dengan user non-admin.
2. Akses dashboard admin.

**Expected result**
- Akses ditolak, redirect ke `/?error=forbidden`.

### SEC-03 — XSS payload di guestbook message
**Langkah pengujian**
1. Submit payload script di message guestbook.
2. Approve dan render di UI.

**Expected result**
- Script tidak dieksekusi.
- Konten ditampilkan aman.

### SEC-04 — Hidden field tampering status guestbook
**Langkah pengujian**
1. Ubah hidden input `status` ke nilai ilegal sebelum submit.

**Expected result**
- Request ditolak validasi server.

### SEC-05 — Hidden field tampering reorder direction
**Langkah pengujian**
1. Ubah hidden input `direction` selain `up/down`.
2. Submit form reorder.

**Expected result**
- Request ditolak validasi server.

### SEC-06 — Input SQLi-like pada login
**Langkah pengujian**
1. Isi email/password dengan pola SQL injection umum.
2. Submit.

**Expected result**
- Tidak bisa bypass autentikasi.

### SEC-07 — Hidden field tampering status publish project
**Langkah pengujian**
1. Intercept submit form project.
2. Ubah field `status` ke nilai di luar `draft/published`.
3. Lanjutkan request.

**Expected result**
- Request ditolak validasi server.
- Data tidak berubah.

### SEC-08 — XSS payload di profile/section/SEO text field
**Langkah pengujian**
1. Simpan payload HTML/script pada field teks admin seperti tagline, section body, atau SEO description.
2. Render ulang halaman publik/admin yang menampilkan data.

**Expected result**
- Payload tidak dieksekusi sebagai script.
- Konten dirender aman.

---

## Catatan Eksekusi Automation
- Dokumen ini sudah siap dipakai untuk implementasi Playwright/Cypress.
- Urutan prioritas implementasi disarankan: Authentication -> Navigation -> CRUD -> Validation -> Security -> Edge -> Performance.
