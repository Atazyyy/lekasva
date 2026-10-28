import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  Droplets,
  FileHeart,
  Pill,
  Plus,
  Ruler,
  ShieldAlert,
  Stethoscope,
  Trash2,
  Weight,
  X,
} from "lucide-react";
import { PATIENT, doctorById } from "../data/seed";
import { fmtDate, rupiah } from "../utils/format";
import DoctorAvatar from "./DoctorAvatar";

function RecordCard({ rec, delay }) {
  const [open, setOpen] = useState(false);
  const doctor = doctorById(rec.doctorId);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-2xl border border-edge bg-card"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3.5 p-5 text-left"
      >
        <DoctorAvatar tone={doctor.tone} initial={doctor.initial} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-bold text-ink">
              {doctor.name}
              {doctor.title ? `, ${doctor.title}` : ""}
            </h3>
            <span className="rounded-full bg-canvas px-2.5 py-0.5 text-[11px] font-bold text-teal-deep">
              {doctor.specialty}
            </span>
          </div>
          <p className="mt-1 text-xs text-mute">
            {fmtDate(rec.dateTs)} · {rec.diagnosis}
          </p>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-mute transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-edge px-5 py-5">
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-canvas p-3.5">
                  <p className="text-[11px] font-bold tracking-wide text-mute uppercase">
                    Keluhan
                  </p>
                  <p className="mt-1 text-ink">{rec.complaint}</p>
                </div>
                <div className="rounded-xl bg-canvas p-3.5">
                  <p className="text-[11px] font-bold tracking-wide text-mute uppercase">
                    Diagnosis
                  </p>
                  <p className="mt-1 font-bold text-teal-deep">{rec.diagnosis}</p>
                </div>
              </div>

              <div>
                <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide text-mute uppercase">
                  <Pill className="h-3.5 w-3.5 text-teal" />
                  Resep (obat &amp; dosis)
                </p>
                {rec.meds && rec.meds.length > 0 ? (
                  <div className="mt-2 overflow-hidden rounded-xl border border-edge">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-canvas text-xs text-mute">
                        <tr>
                          <th className="px-3.5 py-2 font-bold">Obat</th>
                          <th className="px-3.5 py-2 font-bold">Dosis</th>
                          <th className="hidden px-3.5 py-2 font-bold sm:table-cell">
                            Aturan pakai
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-edge">
                        {rec.meds.map((m) => (
                          <tr key={m.name}>
                            <td className="px-3.5 py-2.5 font-bold text-ink">{m.name}</td>
                            <td className="px-3.5 py-2.5 text-mute">{m.dose}</td>
                            <td className="hidden px-3.5 py-2.5 text-mute sm:table-cell">
                              {m.rule}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="mt-2 rounded-xl bg-canvas p-3.5 text-sm text-mute">
                    Tidak ada resep obat pada kunjungan ini.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-edge pt-3.5 text-sm">
                <span className="text-mute">Biaya konsultasi</span>
                <span className="font-extrabold text-teal-deep">{rupiah(rec.fee)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Records({ records, allergies, onAddAllergy, onRemoveAllergy }) {
  const [newAllergy, setNewAllergy] = useState("");

  const visitCount = records.length;
  const medCount = records.reduce(
    (sum, r) => sum + (r.meds ? r.meds.length : 0),
    0
  );
  const doctorsSeen = new Set(records.map((r) => r.doctorId)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Rekam Medis
        </h1>
        <p className="mt-1 text-sm text-mute">
          Riwayat kunjungan, diagnosis, alergi, dan resep terpusat dalam satu
          tempat.
        </p>
      </div>

      {/* Kartu profil pasien */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-edge bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 select-none items-center justify-center rounded-2xl bg-teal text-lg font-extrabold text-white">
                DP
              </div>
              <div>
                <h2 className="font-extrabold text-ink">{PATIENT.name} <span className="text-xs font-bold text-mute">(pasien demo)</span></h2>
                <p className="text-sm text-mute">{PATIENT.age} tahun · Laki-laki</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-canvas p-3">
              <Droplets className="mx-auto h-4 w-4 text-teal" />
              <p className="mt-1.5 text-sm font-extrabold text-ink">{PATIENT.blood}</p>
              <p className="text-[11px] text-mute">Gol. darah</p>
            </div>
            <div className="rounded-xl bg-canvas p-3">
              <Ruler className="mx-auto h-4 w-4 text-teal" />
              <p className="mt-1.5 text-sm font-extrabold text-ink">{PATIENT.height} cm</p>
              <p className="text-[11px] text-mute">Tinggi</p>
            </div>
            <div className="rounded-xl bg-canvas p-3">
              <Weight className="mx-auto h-4 w-4 text-teal" />
              <p className="mt-1.5 text-sm font-extrabold text-ink">{PATIENT.weight} kg</p>
              <p className="text-[11px] text-mute">Berat</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-edge bg-card p-6">
          <p className="flex items-center gap-1.5 text-sm font-extrabold text-ink">
            <ShieldAlert className="h-4 w-4 text-coral" />
            Alergi
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {allergies.length === 0 && (
              <p className="text-sm text-mute">Belum ada catatan alergi.</p>
            )}
            {allergies.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1.5 text-xs font-bold text-coral"
              >
                {a}
                <button
                  onClick={() => onRemoveAllergy(a)}
                  className="rounded-full p-0.5 transition-colors hover:bg-coral hover:text-white"
                  aria-label={`Hapus alergi ${a}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAddAllergy(newAllergy);
              setNewAllergy("");
            }}
            className="mt-4 flex gap-2"
          >
            <input
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Tambah alergi…"
              className="flex-1 rounded-full border border-edge bg-card px-4 py-2 text-sm text-ink outline-none placeholder:text-mute/70 focus:border-teal"
            />
            <button
              type="submit"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-teal-deep"
              aria-label="Tambah alergi"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Stat ringkas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-edge bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-soft text-teal-deep">
            <Stethoscope className="h-5 w-5" />
          </div>
          <p className="mt-4 text-2xl font-extrabold text-ink">{visitCount}</p>
          <p className="mt-0.5 text-sm text-mute">Total kunjungan</p>
        </div>
        <div className="rounded-2xl border border-edge bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-soft text-teal-deep">
            <FileHeart className="h-5 w-5" />
          </div>
          <p className="mt-4 text-2xl font-extrabold text-ink">{doctorsSeen}</p>
          <p className="mt-0.5 text-sm text-mute">Dokter berbeda</p>
        </div>
        <div className="rounded-2xl border border-edge bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-soft text-teal-deep">
            <Pill className="h-5 w-5" />
          </div>
          <p className="mt-4 text-2xl font-extrabold text-ink">{medCount}</p>
          <p className="mt-0.5 text-sm text-mute">Obat diresepkan</p>
        </div>
      </div>

      {/* Riwayat kunjungan */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-ink">Riwayat Kunjungan</h2>
        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-edge bg-card p-10 text-center text-sm text-mute">
            Belum ada riwayat kunjungan.
          </div>
        ) : (
          records.map((r, i) => <RecordCard key={r.id} rec={r} delay={i * 0.05} />)
        )}
      </div>

      <p className="flex items-start justify-center gap-1.5 rounded-2xl bg-coral-soft p-4 text-center text-xs font-semibold text-coral">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        Demo simulasi — bukan layanan medis nyata. Seluruh diagnosis, obat, dan
        dosis bersifat fiktif dan tidak boleh dipraktikkan.
      </p>
    </div>
  );
}
