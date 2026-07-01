import type { DeepString } from "./types";

export const messages = {
  common: {
    offlineBanner:
      "Mode offline — data seed. Hubungkan Supabase untuk konten live.",
    backToTop: {
      ariaLabel: "Kembali ke atas",
      label: "↑ Atas",
    },
    skipToContent: "Lewati ke konten",
  },
  loader: {
    label: "Memuat",
    ariaLabel: "Memuat",
    messages: {
      preparingScene: "Menyiapkan scene",
      loadingPortfolio: "Memuat portofolio",
    },
  },
  nav: {
    ariaLabel: "Navigasi situs",
    brandFallback: "ARP · Portofolio",
    scrollToTopAria: "Gulir ke atas",
    items: {
      work: "Karya",
      about: "Tentang",
      career: "Karier",
      guestbook: "Buku tamu",
      contact: "Kontak",
    },
  },
  hero: {
    nameFallback: "Arik Riko Prasetya",
    taglineLine1:
      "Pengembang mobile fokus fintech, pembayaran, dan aplikasi multi-tenant.",
    taglineLine2:
      "Saya membangun aplikasi mobile siap produksi dengan Kotlin, React Native, Flutter, dan integrasi backend.",
    ctaExploreWork: "Jelajahi Karya",
    scrollIndicator: "gulir",
  },
  github: {
    unavailable: "[Data GitHub tidak tersedia]",
    contributionsTitle: "Kontribusi GitHub",
    hoverTimeline: "Arahkan kursor untuk melihat timeline",
    commitCount: "{date} · {count} commit",
    legendLess: "Sedikit",
    legendMore: "Banyak",
  },
  proofStrip: {
    ariaLabel: "Statistik utama",
    stats: {
      productionApps: { value: "15+", label: "Aplikasi Produksi" },
      mobileExperience: { value: "2+ Tahun", label: "Pengalaman Mobile" },
      ship: { value: "Rilis", label: "Play Store · App Store" },
      fintech: { value: "Fintech", label: "Fokus Domain" },
    },
  },
  projects: {
    kicker: "Portofolio",
    title: "Karya Terpilih",
    lead: "Aplikasi mobile fintech, pembayaran, merchant/member, dan operasional — karya terpilih dengan alur produksi nyata.",
    count: "{count} proyek",
    featuredSuffix: " · {count} unggulan",
    tablistAria: "Proyek karya terpilih",
    accordion: {
      tabAria: "Proyek {index}: {title}",
      kicker: "Proyek {index}",
      featured: "Unggulan",
      viewDetail: "Lihat detail",
    },
    modal: {
      closeAria: "Tutup detail proyek",
      close: "Tutup",
      kicker: "Proyek",
      stackTags: "Stack & tag",
      stackTagsHint: "Teknologi dan label yang dipakai di project ini.",
      highlights: "Sorotan",
      highlightsHint: "Hasil, metrik, atau dampak utama — bukan daftar fitur.",
      caseStudy: "Studi kasus",
      caseStudyHint: "Problem, batasan, solusi, lalu dampak terukur.",
      problem: "Masalah",
      constraints: "Batasan",
      solution: "Solusi",
      impact: "Dampak",
      ctaAria: "Tautan proyek",
      demo: "Demo ↗",
      repo: "Repo ↗",
    },
  },
  about: {
    sectionLabel: "[ 01 — {title} ]",
    titleFallback: "Tentang Saya",
    headlineFallback: "Aplikasi mobile andal untuk fintech dan pembayaran.",
    introFallback:
      "Saya membangun aplikasi mobile produksi dengan arsitektur bersih, alur pengguna andal, integrasi API, dan kode yang mudah dirawat di kondisi pengguna nyata.",
    philosophyTitleFallback: "Pendekatan Engineering",
    philosophyBodyFallback:
      "Saya fokus pada alur mobile yang bisa dipercaya pengguna dan operator: state jelas, validasi terprediksi, penanganan API tangguh, dan cakupan edge case yang teliti.",
    focusTitleFallback: "Fokus Domain",
    focusBodyFallback:
      "Fintech, pembayaran, aplikasi merchant dan member, PPOB, QRIS, NFC, dan arsitektur mobile multi-tenant.",
    craftTitleFallback: "Pengiriman",
    craftBodyFallback:
      "Saya menjaga fitur tetap mudah dirawat dari development hingga rilis: modul reusable, GitLab CI/CD, deployment store, dan triase issue produksi.",
    stats: {
      yearsMobile: "Tahun Mobile",
      productionApps: "Aplikasi Produksi",
      coreStacks: "Stack Utama",
    },
  },
  career: {
    title: "Karier",
    present: "Sekarang",
    stackPill: "Stack",
    stackTitle: "Keahlian",
    stackLead: "Tools dan domain dikelompokkan sesuai cara Anda mengirim produk.",
    educationPill: "Fondasi",
    educationTitle: "Pendidikan",
    gpa: "IPK {gpa}",
  },
  guestbook: {
    title: "Pesan Tamu",
    lead: "Pesan dari kolaborator dan pengunjung muncul di sini setelah ditinjau. Jaga relevansi dan profesionalisme.",
    orbitingCount: "{visible} dari {total} pesan mengorbit",
    writeMessage: "Tulis Pesan",
    modal: {
      closeAria: "Tutup formulir pesan",
      title: "Tinggalkan Pesan",
      subtitle: "Pesan Anda akan bergabung di medan hanyut yang tak terbatas.",
      nameLabel: "Nama Anda",
      namePlaceholder: "mis. Satoshi",
      messageLabel: "Pesan",
      messagePlaceholder: "Apa yang ada di pikiran Anda?",
      sending: "Mengirim...",
      success: "Berhasil!",
      post: "Kirim Pesan",
      successMessage: "Pesan terkirim! Sampai jumpa di rute pelayaran.",
    },
    errors: {
      required: "Nama dan pesan wajib diisi.",
      supabaseDisconnected: "Supabase tidak terhubung.",
      sendFailed: "Gagal mengirim pesan. Silakan coba lagi.",
    },
  },
  footer: {
    kickerFallback: "Kontak",
    headingFallback: "Mari bangun aplikasi mobile yang andal.",
    leadFallback:
      "Tersedia untuk peran mobile, proyek fintech/pembayaran, dan pemeliharaan aplikasi produksi.",
    bodyFallback:
      "Kirim email atau unduh CV untuk diskusi Kotlin, React Native, Flutter, atau pekerjaan mobile terintegrasi backend.",
    emailFallback: "Email saya",
    cvFallback: "Unduh CV",
    github: "GitHub",
    linkedin: "LinkedIn",
    website: "Website",
    marquee: {
      kotlin: "Kotlin Android",
      reactNative: "React Native Expo",
      flutter: "Flutter",
      fintech: "Fintech",
      payment: "Pembayaran",
      apiIntegration: "Integrasi API",
    },
    copyright: "© {year} {name}. Hak cipta dilindungi.",
  },
} as const;

export type MessageSchema = typeof messages;
export type Messages = DeepString<MessageSchema>;
