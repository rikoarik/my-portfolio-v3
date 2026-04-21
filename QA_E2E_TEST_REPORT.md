# QA E2E Test Report — Portfolio V2

Tanggal: 2026-04-17  
Base URL: `http://localhost:3000`  
Tester mode: QA smoke + route-level verification

## 1) Ringkasan hasil uji

Status: **PARTIAL PASS**

- ✅ Aplikasi hidup, halaman publik bisa diakses.
- ✅ Proteksi auth admin berjalan (redirect 307 ke login + query `next`).
- ✅ Route tidak valid return 404.
- ✅ Playwright MCP berhasil dipakai untuk navigasi dan snapshot halaman utama, login admin, redirect guard, dan 404 page.
- ⚠️ Flow yang butuh kredensial admin/data mutasi nyata belum dieksekusi end-to-end penuh karena tidak ada kredensial uji pada konteks ini.

## 2) Hasil eksplorasi browser automation

- Homepage `/` berhasil dibuka via Playwright MCP.
- Admin login `/admin/login` berhasil dibuka dan form login terdeteksi.
- Route `/admin/dashboard` tanpa session ter-redirect ke `/admin/login?next=%2Fadmin%2Fdashboard`.
- Route invalid `/route-tidak-ada` berhasil menampilkan halaman 404.

## 3) Bukti uji aktual (yang berhasil dijalankan)

Metode: kombinasi Playwright MCP + HTTP smoke test ke route kritikal.

| Route | HTTP | Hasil | Catatan |
|---|---:|---|---|
| `/` | 200 | PASS | Homepage dapat diakses |
| `/admin/login` | 200 | PASS | Login page dapat diakses |
| `/admin/dashboard` | 307 | PASS | Redirect ke `/admin/login?next=%2Fadmin%2Fdashboard` |
| `/admin/dashboard/projects` | 307 | PASS | Redirect auth guard aktif |
| `/admin/dashboard/experiences` | 307 | PASS | Redirect auth guard aktif |
| `/admin/dashboard/guestbook` | 307 | PASS | Redirect auth guard aktif |
| `/admin/dashboard/profile` | 307 | PASS | Redirect auth guard aktif |
| `/admin/dashboard/sections` | 307 | PASS | Redirect auth guard aktif |
| `/admin/dashboard/media` | 307 | PASS | Redirect auth guard aktif |
| `/admin/dashboard/seo` | 307 | PASS | Redirect auth guard aktif |
| `/admin/dashboard/loader` | 307 | PASS | Redirect auth guard aktif |
| `/route-tidak-ada` | 404 | PASS | Not found handler jalan |

Temuan UI dari Playwright:
- Homepage memiliki skip link `Lewati ke konten`.
- Login page memiliki judul `Admin CMS`, input email, input password, tombol `Masuk`.
- 404 page memiliki CTA `Take me home` ke homepage.

## 4) Status kategori wajib (berdasarkan eksekusi aktual)

| Kategori | Status | Keterangan |
|---|---|---|
| Authentication (login/logout/register) | PARTIAL | Guard route tervalidasi via redirect; login/logout UI flow belum dieksekusi browser |
| Navigation | PARTIAL | Redirect, homepage, login, dan 404 tervalidasi; klik menu auth-only belum dieksekusi |
| UI Rendering | PARTIAL | Homepage, login page, dan 404 page tervalidasi via snapshot |
| Form Validation | NOT EXECUTED | Butuh submit form via browser |
| CRUD Operations | NOT EXECUTED | Butuh auth + interaksi form |
| Error Handling | PARTIAL | 404 dan unauthorized redirect tervalidasi |
| Edge Cases | NOT EXECUTED | Butuh skenario interaktif |
| Performance ringan (load page) | PARTIAL | Route load dasar tervalidasi; metrik browser detail (LCP/INP) belum diambil |
| Security basic (input validation) | PARTIAL | Route protection tervalidasi; input tampering/XSS belum dieksekusi browser |

## 5) Daftar test case siap automation

Daftar lengkap test case untuk semua kategori sudah disusun sebelumnya (Authentication, Navigation, UI Rendering, Form Validation, CRUD, Error Handling, Edge Cases, Performance, Security) dengan format:

- Nama test case
- Step-by-step
- Expected result

Rekomendasi eksekusi: Playwright/Cypress data-driven berdasarkan ID test case.

## 6) Next action agar full E2E bisa jalan

1. Siapkan kredensial admin test dan user non-admin test.  
2. Jalankan suite browser automation untuk semua flow auth-only dan mutasi data.  
3. Lengkapi report ini dengan `Actual Result`, `Pass/Fail`, screenshot, dan trace.

---

## Lampiran A — Command evidence

```bash
for r in / /admin/login /admin/dashboard /admin/dashboard/projects /admin/dashboard/experiences /admin/dashboard/guestbook /admin/dashboard/profile /admin/dashboard/sections /admin/dashboard/media /admin/dashboard/seo /admin/dashboard/loader /route-tidak-ada; do
  printf "%s\t" "$r"
  curl -s -o /dev/null -w "code=%{http_code}\ttime=%{time_total}s\tredirect=%{redirect_url}\n" "http://localhost:3000$r"
done
```
