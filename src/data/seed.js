// Data contoh Lekasva — seluruh nama dokter, pasien, obat, diagnosis, dan
// angka bersifat FIKTIF. Demo simulasi — bukan layanan medis nyata.
// Timestamp dihitung relatif terhadap waktu halaman dibuka supaya demo
// selalu terlihat "hidup".

const D = 86400000; // satu hari dalam ms
const H = 3600000; // satu jam dalam ms

export const WA_NUMBER = "6281234567890";

export const HERO_IMG =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=70";

// ---------- Pasien demo (fiktif) ----------
export const PATIENT = {
  name: "Dimas Prayoga",
  age: 27,
  blood: "A+",
  height: 172,
  weight: 68,
};

export const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Halo Lekasva! Saya mau tanya layanan konsultasi dokter."
)}`;

// ---------- Dokter ----------
// days = hari praktik (0=Minggu ... 6=Sabtu). Avatar memakai inisial, tanpa foto.
export const DOCTORS = [
  {
    id: "d1",
    name: "dr. Amara Wijayanti",
    title: "Sp.PD",
    specialty: "Penyakit Dalam",
    initial: "AW",
    tone: "teal",
    days: [1, 3, 5],
    time: "08:00 – 12:00",
    slots: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30"],
    rating: 4.9,
    reviews: 214,
    fee: 150000,
    exp: 12,
    bio: "Konsultan penyakit dalam dengan fokus diabetes dan gangguan pencernaan. Berpengalaman konsultasi online sejak 2020.",
    probe: "Apakah demamnya disertai mual, nyeri perut, atau pandangan berbayang?",
    diagnosis: "Demam virus (febris viralis)",
    meds: [
      { name: "Paracetamol 500 mg", dose: "3x1 tablet", rule: "sesudah makan, bila demam" },
      { name: "ORS (cairan elektrolit)", dose: "2x1 sachet", rule: "larutkan dalam 200 ml air" },
    ],
    advice: "Istirahat yang cukup, minum air minimal 2 liter per hari, dan konsumsi makanan bergizi lunak. Segera pergi ke IGD bila demam di atas 39°C lebih dari 3 hari.",
  },
  {
    id: "d2",
    name: "dr. Bimo Prasetyo",
    title: "Sp.A",
    specialty: "Kesehatan Anak",
    initial: "BP",
    tone: "sky",
    days: [1, 2, 4],
    time: "13:00 – 17:00",
    slots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
    rating: 4.8,
    reviews: 186,
    fee: 175000,
    exp: 9,
    bio: "Spesialis anak dengan minat pada tumbuh kembang dan imunisasi. Ramah untuk konsultasi kehamilan & menyusui.",
    probe: "Apakah si kecil masih aktif minum susu dan tidak muntah-muntah?",
    diagnosis: "Infeksi virus ringan pada anak",
    meds: [
      { name: "Paracetamol sirup 120 mg/5 ml", dose: "3x1 sendok takar", rule: "sesuai berat badan, bila demam" },
      { name: "Zinc sirup", dose: "1x1 sendok takar", rule: "sesudah makan, selama 10 hari" },
    ],
    advice: "Pantau suhu dan aktivitas anak, beri ASI/makanan lunak lebih sering dalam porsi kecil. Bawa ke IGD bila anak lesu, tidak mau minum, atau napas cepat.",
  },
  {
    id: "d3",
    name: "dr. Citra Larasati",
    title: "",
    specialty: "Dokter Umum",
    initial: "CL",
    tone: "rose",
    days: [1, 2, 3, 4, 5],
    time: "08:00 – 11:30",
    slots: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"],
    rating: 4.7,
    reviews: 342,
    fee: 80000,
    exp: 6,
    bio: "Dokter umum untuk keluhan harian: flu, batuk, alergi, kontrol tekanan darah, dan medical check-up.",
    probe: "Apakah ada demam, batuk berdahak, atau pilek yang menyertai?",
    diagnosis: "ISPA (infeksi saluran pernapasan atas)",
    meds: [
      { name: "Paracetamol 500 mg", dose: "3x1 tablet", rule: "bila demam/nyeri, sesudah makan" },
      { name: "Cetirizine 10 mg", dose: "1x1 tablet", rule: "malam hari sebelum tidur" },
    ],
    advice: "Perbanyak istirahat dan cairan, hindari minuman es sementara. Bila batuk lebih dari 7 hari atau muncul sesak napas, mohon konsultasi ulang.",
  },
  {
    id: "d4",
    name: "dr. Mahesa Dirgantara",
    title: "Sp.THT-KL",
    specialty: "Telinga, Hidung & Tenggorokan",
    initial: "MD",
    tone: "amber",
    days: [2, 4, 6],
    time: "09:00 – 13:00",
    slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
    rating: 4.8,
    reviews: 158,
    fee: 160000,
    exp: 11,
    bio: "Spesialis THT-KL, berpengalaman menangani sinusitis, rinitis alergi, dan gangguan tenggorokan.",
    probe: "Apakah hidung tersumbat terus-menerus atau hanya di pagi hari?",
    diagnosis: "Rinitis alergi ringan-sedang",
    meds: [
      { name: "Loratadine 10 mg", dose: "1x1 tablet", rule: "pagi hari, sesudah makan" },
      { name: "Larutan NaCl (spray hidung)", dose: "2x1 semprot tiap lubang", rule: "bersihkan hidung sebelum digunakan" },
    ],
    advice: "Hindari debu dan perubahan suhu yang ekstrem, cuci hidung dengan larutan garam secara rutin. Bila muncul nyeri wajah hebat atau demam, pemeriksaan langsung diperlukan.",
  },
  {
    id: "d5",
    name: "dr. Ratna Puspitasari",
    title: "Sp.KJ",
    specialty: "Kesehatan Jiwa",
    initial: "RP",
    tone: "violet",
    days: [2, 3, 5],
    time: "10:00 – 16:00",
    slots: ["10:00", "10:30", "11:00", "13:00", "13:30", "14:00"],
    rating: 4.9,
    reviews: 121,
    fee: 250000,
    exp: 14,
    bio: "Spesialis kesehatan jiwa untuk stres, kecemasan, gangguan tidur, dan burnout. Konsultasi bersifat privasi penuh.",
    probe: "Bagaimana pola tidur Anda belakangan — apakah sulit memulai tidur atau mudah terbangun?",
    diagnosis: "Gangguan tidur terkait stres (ringan)",
    meds: [],
    medNote: "Tidak ada resep obat pada sesi ini — rekomendasi terapi perilaku & evaluasi lanjutan.",
    advice: "Terapkan jurnal tidur dan latihan napas 4-7-8 sebelum tidur, batasi layar 1 jam sebelum istirahat, dan jadwalkan sesi konseling lanjutan. Bila muncul pikiran menyakiti diri, segera hubungi layanan darurat.",
  },
  {
    id: "d6",
    name: "dr. Galih Nusantara",
    title: "Sp.OG",
    specialty: "Kebidanan & Kandungan",
    initial: "GN",
    tone: "emerald",
    days: [1, 3, 6],
    time: "13:00 – 17:00",
    slots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
    rating: 4.8,
    reviews: 203,
    fee: 200000,
    exp: 13,
    bio: "Spesialis obstetri & ginekologi. Melayani konsultasi kehamilan, program hamil, dan kesehatan reproduksi.",
    probe: "Apakah keluhannya hilang-timbul atau memburuk setelah aktivitas berat?",
    diagnosis: "Anemia kehamilan ringan",
    meds: [
      { name: "Asam folat 400 mcg", dose: "1x1 tablet", rule: "pagi hari, sesudah makan" },
      { name: "Tablet zat besi (Fe)", dose: "1x1 tablet", rule: "malam hari, dengan air jeruk" },
    ],
    advice: "Konsumsi makanan kaya zat besi dan vitamin C, hindari teh/kopi bersamaan dengan makan. Lakukan kontrol antenatal rutin sesuai jadwal kehamilan.",
  },
  {
    id: "d7",
    name: "dr. Nadia Kusumawati",
    title: "Sp.DV",
    specialty: "Kulit & Kelamin",
    initial: "NK",
    tone: "orange",
    days: [4, 5, 6],
    time: "10:00 – 15:00",
    slots: ["10:00", "10:30", "11:00", "11:30", "13:00", "13:30"],
    rating: 4.7,
    reviews: 264,
    fee: 180000,
    exp: 8,
    bio: "Spesialis dermatologi & venereologi. Menangani jerawat, eksim, alergi kulit, dan masalah rambut.",
    probe: "Apakah ruamnya gatal setelah bersentuhan dengan sesuatu, misalnya kosmetik atau deterjen?",
    diagnosis: "Dermatitis kontak ringan",
    meds: [
      { name: "Hydrocortisone cream 1%", dose: "2x1", rule: "oleskan tipis pada area ruam, maksimal 7 hari" },
      { name: "Cetirizine 10 mg", dose: "1x1 tablet", rule: "malam hari sebelum tidur" },
    ],
    advice: "Hindari bahan yang memicu iritasi, gunakan sabun lembut dan pelembap bebas pewangi. Bila ruam melebar atau bernanah, minta jadwal pemeriksaan ulang.",
  },
  {
    id: "d8",
    name: "dr. Yudha Ramadhan",
    title: "Sp.OT(K)",
    specialty: "Ortopedi & Traumatologi",
    initial: "YR",
    tone: "cyan",
    days: [1, 2, 4],
    time: "08:00 – 12:00",
    slots: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30"],
    rating: 4.8,
    reviews: 179,
    fee: 190000,
    exp: 10,
    bio: "Spesialis ortopedi untuk nyeri sendi, cedera olahraga, dan keluhan punggung karena posisi kerja.",
    probe: "Apakah nyerinya menjalar ke kaki atau hanya di area pinggang?",
    diagnosis: "Nyeri punggung mekanis (low back pain)",
    meds: [
      { name: "Ibuprofen 400 mg", dose: "2x1 tablet", rule: "sesudah makan, bila nyeri" },
      { name: "Kalsium + Vitamin D3", dose: "1x1 tablet", rule: "pagi hari" },
    ],
    advice: "Kompres hangat 15 menit 2x sehari, lakukan peregangan ringan, dan perbaiki posisi duduk. Bila muncul kelemahan kaki atau mati rasa, pemeriksaan fisik segera diperlukan.",
  },
];

export const doctorById = (id) => DOCTORS.find((d) => d.id === id);

// Slot "penuh" deterministik agar demo konsisten
export const isSlotFull = (doctor, slotIdx) =>
  (DOCTORS.indexOf(doctor) * 3 + slotIdx) % 4 === 0;

// Hari praktik dalam 7 hari ke depan → [{ iso, ts }]
export function practiceDates(doctor, ahead = 7) {
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < ahead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (doctor.days.includes(d.getDay())) {
      out.push({
        iso: d.toISOString().slice(0, 10),
        ts: d.getTime(),
      });
    }
  }
  return out;
}

// ---------- Janji temuan seed ----------
const now = Date.now();

export const SEED_APPOINTMENTS = [
  {
    id: "LKV-38512",
    doctorId: "d1",
    date: new Date(now + 5 * H).toISOString().slice(0, 10),
    slot: "09:30",
    complaint: "Demam dan sakit kepala sejak dua hari lalu",
    status: "mendatang",
    createdAt: now - 2 * H,
  },
  {
    id: "LKV-28741",
    doctorId: "d3",
    date: new Date(now - 12 * D).toISOString().slice(0, 10),
    slot: "09:00",
    complaint: "Gatal dan ruam merah di tangan",
    status: "selesai",
    createdAt: now - 13 * D,
  },
];

// ---------- Rekam medis seed ----------
export const SEED_RECORDS = [
  {
    id: "RM-1011",
    apptId: "LKV-28741",
    doctorId: "d3",
    dateTs: now - 12 * D,
    complaint: "Gatal dan ruam merah di tangan",
    diagnosis: "Dermatitis kontak ringan",
    meds: [
      { name: "Hydrocortisone cream 1%", dose: "2x1", rule: "oles tipis pada ruam, maksimal 7 hari" },
      { name: "Cetirizine 10 mg", dose: "1x1 tablet", rule: "malam hari sebelum tidur" },
    ],
    fee: 80000,
  },
  {
    id: "RM-0942",
    doctorId: "d1",
    dateTs: now - 96 * D,
    complaint: "Maag kambuh, perih di ulu hati setelah makan pedas",
    diagnosis: "Dispepsia (asam lambung naik)",
    meds: [
      { name: "Omeprazole 20 mg", dose: "1x1 kapsul", rule: "pagi hari, 30 menit sebelum makan" },
      { name: "Antasida Doxinate", dose: "3x1 tablet", rule: "bila perih, dikunyah" },
    ],
    fee: 150000,
  },
  {
    id: "RM-0871",
    doctorId: "d4",
    dateTs: now - 205 * D,
    complaint: "Hidung tersumbat dan bersin saat pagi hari",
    diagnosis: "Rinitis alergi ringan",
    meds: [
      { name: "Loratadine 10 mg", dose: "1x1 tablet", rule: "pagi hari sesudah makan" },
      { name: "Larutan NaCl (spray hidung)", dose: "2x1", rule: "pagi & malam" },
    ],
    fee: 160000,
  },
];

// ---------- Respon chat (rule-based simulasi) ----------
export const CHAT_CHIPS = [
  {
    label: "Sudah 2–3 hari",
    reply: "Baik, saya catat durasinya. Kita mulai dengan penanganan awal dulu, ya.",
  },
  {
    label: "Sudah lebih dari seminggu",
    reply: "Terima kasih, infonya penting. Kalau sudah selama itu, ada beberapa hal yang perlu saya telusuri lebih lanjut.",
  },
  {
    label: "Ada gejala lain juga",
    reply: "Hmm, oke — itu membantu sekali. Saya susun saran dan resep digitalnya sekarang, ya.",
  },
];

export const CHAT_FALLBACK_REPLY =
  "Baik, saya catat. Terima kasih sudah menjelaskan kondisinya dengan jelas.";
