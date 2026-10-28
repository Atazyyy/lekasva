import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus, ChevronRight, Clock, MessageCircle, Search, Star, UserRound } from "lucide-react";
import { DOCTORS } from "../data/seed";
import { rupiah } from "../utils/format";
import DoctorAvatar from "./DoctorAvatar";

const DAY_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const dayLabel = (days) =>
  [...days].sort((a, b) => a - b).map((d) => DAY_SHORT[d]).join(", ");

function DoctorCard({ doctor, onBook, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col rounded-2xl border border-edge bg-card p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3.5">
        <DoctorAvatar tone={doctor.tone} initial={doctor.initial} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-ink">
            {doctor.name}
            {doctor.title && <span className="text-mute">, {doctor.title}</span>}
          </h3>
          <p className="text-sm font-semibold text-teal">{doctor.specialty}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mute">
            <span className="inline-flex items-center gap-1 font-bold text-ink">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {doctor.rating.toFixed(1)}
              <span className="font-normal text-mute">({doctor.reviews})</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <UserRound className="h-3.5 w-3.5" />
              {doctor.exp} th pengalaman
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-mute">{doctor.bio}</p>

      <div className="mt-3 flex items-center gap-2 rounded-xl bg-canvas px-3 py-2 text-xs text-mute">
        <Clock className="h-3.5 w-3.5 shrink-0 text-teal" />
        <span className="font-semibold text-ink">{dayLabel(doctor.days)}</span>
        <span>· {doctor.time}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-edge pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-mute">Biaya konsultasi</p>
          <p className="font-extrabold text-ink">{rupiah(doctor.fee)}</p>
        </div>
        <button
          onClick={() => onBook(doctor)}
          className="inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-deep"
        >
          <CalendarPlus className="h-4 w-4" />
          Buat Janji
        </button>
      </div>
    </motion.div>
  );
}

export default function Doctors({ onBook }) {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("Semua");

  const specialties = useMemo(
    () => ["Semua", ...DOCTORS.map((d) => d.specialty)],
    []
  );

  const filtered = DOCTORS.filter((d) => {
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q);
    const matchS = specialty === "Semua" || d.specialty === specialty;
    return matchQ && matchS;
  });

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="grid grid-cols-1 items-center gap-6 rounded-3xl border border-edge bg-card p-6 md:grid-cols-[1.15fr_0.85fr] md:p-10">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1.5 text-xs font-bold text-teal-deep">
            <MessageCircle className="h-3.5 w-3.5" />
            Konsultasi chat &amp; video — tanpa antre
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink md:text-4xl">
            Konsultasi dokter kini cukup dari rumah.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mute md:text-base">
            Pilih dokter, atur jadwal janji, dan dapatkan saran medis beserta
            resep digital — seluruh riwayat tercatat rapi di rekam medis Anda.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-canvas px-3.5 py-2 text-teal-deep">
              8 dokter &amp; spesialis
            </span>
            <span className="rounded-full bg-canvas px-3.5 py-2 text-teal-deep">
              Respon chat cepat
            </span>
            <span className="rounded-full bg-canvas px-3.5 py-2 text-teal-deep">
              Rekam medis terpusat
            </span>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=70"
            alt="Ilustrasi layanan kesehatan digital"
            className="h-48 w-full rounded-2xl object-cover md:h-64"
            loading="lazy"
          />
          <div className="absolute right-3 bottom-3 rounded-xl bg-card/95 px-3 py-2 text-xs font-bold text-ink shadow-sm">
            🩺 Demo simulasi — bukan layanan medis nyata
          </div>
        </div>
      </section>

      {/* Pencarian & filter spesialisasi */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-extrabold text-ink">Pilih Dokter</h2>
          <div className="relative sm:w-72">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-mute" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau spesialisasi…"
              className="w-full rounded-full border border-edge bg-card py-2.5 pr-4 pl-10 text-sm text-ink outline-none placeholder:text-mute/70 focus:border-teal"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {specialties.map((s) => (
            <button
              key={s}
              onClick={() => setSpecialty(s)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                specialty === s
                  ? "bg-teal text-white shadow-sm"
                  : "border border-edge bg-card text-mute hover:border-teal hover:text-teal"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-edge bg-card p-10 text-center text-sm text-mute">
            Tidak ada dokter yang cocok dengan pencarian Anda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtered.map((d, i) => (
              <DoctorCard key={d.id} doctor={d} onBook={onBook} delay={i * 0.05} />
            ))}
          </div>
        )}

        <p className="flex items-center justify-center gap-1 pt-2 text-center text-xs text-mute">
          Semua janji dan chat hanya tersimpan di perangkat Anda (localStorage)
          <ChevronRight className="h-3.5 w-3.5" />
        </p>
      </section>
    </div>
  );
}
