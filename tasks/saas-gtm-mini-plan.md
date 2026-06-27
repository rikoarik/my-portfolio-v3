# 29. Go-To-Market Mini Plan

## Positioning

**One-liner:** *Deploy a stunning developer portfolio in minutes — no code, no hosting headaches.*

**Differentiation vs Carrd/Webflow:**
- Dev-native templates (GitHub, projects, career timeline)
- Infinite Field aesthetic — motion-rich, not generic
- Built for job seekers and freelancers who code

## Target Audience

1. **Primary:** Software engineers job hunting (0–5 YOE)
2. **Secondary:** Freelance devs/designers needing quick presence
3. **Tertiary:** Bootcamp grads

## Channels (Low Budget)

| Channel | Tactic |
|---------|--------|
| Twitter/X | Build in public threads, demo GIFs |
| LinkedIn | Portfolio before/after posts |
| Reddit | r/webdev, r/cscareerquestions (value-first, no spam) |
| Product Hunt | Launch day spike |
| Hacker News | Show HN post |
| Dev.to | "How I built portfolio SaaS" article |
| Personal network | Direct invites to beta |

## Content Ideas

- "My portfolio vs Infinite Field template" comparison
- 60-second Loom: signup → publish
- Template gallery as marketing asset
- Open-source section of renderer (optional goodwill)

## Pricing Launch

- **Free tier generous** — 1 site, subdomain, watermark OK
- **Pro early bird** — 20% off first year for first 100 customers
- No annual-only lock-in at launch

## Landing Page Must-Haves

- Hero with live demo subdomain
- Template screenshots / video
- 3-step "How it works"
- Social proof (beta quotes)
- CTA: Start free

## Metrics

| Funnel Stage | KPI |
|--------------|-----|
| Visit → Signup | 5–10% |
| Signup → Publish | 40%+ |
| Free → Pro | 3–5% (month 3) |
| CAC | ~$0 organic MVP |
| LTV | Pro × avg retention |

## Competitive Watch

- Carrd, Read.cv, GitHub Pages, Vercel templates
- Monitor: pricing changes, feature gaps we can fill

## 90-Day GTM Goals

| Month | Goal |
|-------|------|
| M1 | 100 signups, 50 live sites |
| M2 | Product Hunt, first paying customers |
| M3 | 10 Pro subscribers, custom domain live |

## Risks

| Risk | Mitigation |
|------|------------|
| Low conversion | Improve onboarding checklist |
| Churn after job found | Target freelancers; add blog later |
| Support overload | FAQ + in-app tooltips |

---

## Detail v0.3 — First Beta Offer

Suggested copy:

```txt
Aku lagi bikin SaaS portfolio builder buat developer/freelancer.
Bisa pilih template, isi project, publish ke subdomain sendiri.
Butuh 10–20 beta tester buat coba flow dan kasih feedback.
```

### First Channels

- LinkedIn
- WhatsApp dev group
- Telegram komunitas
- Instagram story
- Kampus/mahasiswa IT

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
