Kategori: Web App — Healthcare/Telemedicine

# Lekasva — Konsultasi Dokter Online & Rekam Medis Digital

> **Kategori proyek: Web App — Healthcare/Telemedicine.**
> Pasien memilih dokter, membuat janji, menjalani konsultasi chat simulasi,
> dan mengelola rekam medis digital dari satu aplikasi.

Aplikasi telemedicine fiktif "Lekasva" — dari pencarian dokter dan pemesanan
janji sampai ruang konsultasi chat dan rekam medis. Proyek ini adalah
**concept demo** untuk portofolio jasa pembuatan web app. **Demo simulasi —
bukan layanan medis nyata**: seluruh nama dokter, pasien, obrolan, diagnosis,
obat, dan resep bersifat fiktif dan tidak untuk keperluan diagnosis maupun
pengobatan. Nama "Lekasva" sengaja dibuat unik dan tidak meniru brand
kesehatan mana pun.

**Live:** https://lekasva.vercel.app

## Fitur

- **Cari Dokter**: 8 dokter & spesialis fiktif (avatar inisial berwarna, tanpa
  foto) dengan rating, tahun pengalaman, jadwal praktik, dan biaya
  konsultasi. Pencarian + filter spesialisasi.
- **Buat janji** 3 langkah: pilih tanggal (hanya hari praktik, 7 hari ke
  depan) → pilih slot jam (sebagian "penuh") → tulis keluhan → konfirmasi
  (kode janji, mis. LKV-38512). Keluhan cepat bisa dipilih dari chip.
- **Ruang konsultasi**: chat simulasi dokter berfase — sapaan → tanya gejala
  → pertanyaan lanjutan (quick reply chips + teks bebas) → saran medis →
  **resep digital** (obat + dosis + aturan pakai) lengkap dengan indikator
  "dokter sedang menulis".
- **Janji Saya**: daftar janji dengan badge status (mendatang / selesai /
  dibatalkan), masuk konsultasi, batalkan janji, dan tautan ke rekam medis.
- **Rekam Medis**: kartu profil pasien (gol. darah, tinggi, berat), daftar
  **alergi** yang bisa ditambah/hapus, riwayat kunjungan yang bisa
  dibuka-tutup berisi keluhan, diagnosis, tabel resep (obat + dosis + aturan
  pakai), dan biaya. Konsultasi yang diakhiri otomatis tersimpan di sini.
- Semua data client-side (array mock + **localStorage**) — janji, transkrip
  chat, rekam medis, dan alergi bertahan antar kunjungan, tanpa backend.
- Responsif desktop + mobile (bottom navigation, modal, dan tabel yang
  beradaptasi), animasi halus Framer Motion, ikon Lucide, tanpa API eksternal.
- **Disclaimer** ditampilkan menonjol di banner global, ruang konsultasi,
  kartu resep, rekam medis, dan footer: "Demo simulasi — bukan layanan medis
  nyata".

## Untuk siapa demo ini?

Klinik, praktik mandiri, atau startup kesehatan yang ingin menampilkan alur
telemedicine modern — pemesanan janji, konsultasi chat, dan rekam medis
terpusat — kepada pasien dan investor.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4 (token tema `@theme`)
- Framer Motion
- Lucide Icons

## Menjalankan

```bash
npm install
npm run dev      # development
npm run build    # production build ke folder dist/
npm run preview  # preview hasil build
```

---

Dibuat oleh [Agni Miftah Fauzi](https://github.com/Atazyyy) — jasa pembuatan
website & web app.
