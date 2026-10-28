import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MessageCircle,
  UserRound,
  X,
} from "lucide-react";
import { isSlotFull, practiceDates } from "../data/seed";
import { fmtIsoDate, fmtIsoShort, rupiah } from "../utils/format";
import { WA_LINK } from "./Footer";
import DoctorAvatar from "./DoctorAvatar";

const QUICK_COMPLAINTS = [
  "Demam dan sakit kepala",
  "Flu, batuk, dan pilek",
  "Nyeri perut / maag kambuh",
  "Gatal dan ruam pada kulit",
  "Sulit tidur dan cemas berlebih",
  "Nyeri punggung / sendi",
  "Kontrol rutin",
];

const STEPS = ["Jadwal", "Keluhan", "Konfirmasi"];

export default function BookingModal({ doctor, onClose, onBooked, onGoConsult }) {
  const [step, setStep] = useState(0);
  const dates = practiceDates(doctor);
  const [date, setDate] = useState(dates[0]?.iso || null);
  const [slot, setSlot] = useState(null);
  const [complaint, setComplaint] = useState("");
  const [result, setResult] = useState(null);

  // Tutup modal dengan tombol Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canNext = step === 0 ? Boolean(date && slot) : complaint.trim().length >= 10;

  const confirm = () => {
    const appt = {
      id: `LKV-${Math.floor(10000 + Math.random() * 90000)}`,
      doctorId: doctor.id,
      date,
      slot,
      complaint: complaint.trim(),
      status: "mendatang",
      createdAt: Date.now(),
    };
    onBooked(appt);
    setResult(appt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-edge bg-card p-6 sm:rounded-3xl md:p-8"
      >
        {result ? (
          /* ---------- Sukses ---------- */
          <div className="py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-soft">
              <CheckCircle2 className="h-9 w-9 text-teal" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-ink">Janji berhasil dibuat</h3>
            <p className="mt-1 text-sm text-mute">
              Simpan kode janji Anda sebagai referensi.
            </p>
            <div className="mx-auto mt-4 w-fit rounded-2xl bg-canvas px-6 py-3 font-mono text-xl font-extrabold tracking-wider text-teal-deep">
              {result.id}
            </div>
            <div className="mx-auto mt-4 max-w-sm space-y-1.5 rounded-2xl border border-edge p-4 text-left text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-mute">Dokter</span>
                <span className="text-right font-bold text-ink">
                  {doctor.name}
                  {doctor.title ? `, ${doctor.title}` : ""}
                </span>
              </p>
              <p className="flex justify-between gap-3">
                <span className="text-mute">Jadwal</span>
                <span className="text-right font-bold text-ink">
                  {fmtIsoDate(result.date)} · {result.slot}
                </span>
              </p>
              <p className="flex justify-between gap-3">
                <span className="text-mute">Keluhan</span>
                <span className="max-w-[60%] text-right font-bold text-ink">
                  {result.complaint}
                </span>
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={() => onGoConsult(result.id)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-deep"
              >
                <MessageCircle className="h-4 w-4" />
                Buka Ruang Konsultasi
              </button>
              <button
                onClick={onClose}
                className="rounded-full border border-edge px-6 py-3 text-sm font-bold text-mute transition-colors hover:border-teal hover:text-teal"
              >
                Lihat Janji Saya
              </button>
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-mute">
              <AlertTriangle className="h-3.5 w-3.5 text-coral" />
              Demo simulasi — bukan layanan medis nyata.
            </p>
          </div>
        ) : (
          /* ---------- Wizard ---------- */
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <DoctorAvatar tone={doctor.tone} initial={doctor.initial} />
                <div>
                  <h3 className="font-bold text-ink">
                    {doctor.name}
                    {doctor.title ? `, ${doctor.title}` : ""}
                  </h3>
                  <p className="text-xs font-semibold text-teal">
                    {doctor.specialty} · {rupiah(doctor.fee)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-mute transition-colors hover:bg-canvas hover:text-ink"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stepper */}
            <div className="mt-5 flex items-center gap-2">
              {STEPS.map((label, i) => (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                      i <= step ? "bg-teal text-white" : "bg-canvas text-mute"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`hidden text-xs font-bold sm:block ${
                      i <= step ? "text-ink" : "text-mute"
                    }`}
                  >
                    {label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 rounded ${i < step ? "bg-teal" : "bg-edge"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Langkah 1 — jadwal */}
            {step === 0 && (
              <div className="mt-6 space-y-5">
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                    <CalendarDays className="h-4 w-4 text-teal" />
                    Pilih tanggal (7 hari ke depan)
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {dates.map((d) => (
                      <button
                        key={d.iso}
                        onClick={() => setDate(d.iso)}
                        className={`rounded-xl border px-3.5 py-2 text-sm font-bold transition-colors ${
                          date === d.iso
                            ? "border-teal bg-teal text-white"
                            : "border-edge bg-card text-mute hover:border-teal hover:text-teal"
                        }`}
                      >
                        {fmtIsoShort(d.iso)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                    <Clock className="h-4 w-4 text-teal" />
                    Pilih jam praktik ({doctor.time})
                  </p>
                  <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {doctor.slots.map((s, idx) => {
                      const full = isSlotFull(doctor, idx);
                      return (
                        <button
                          key={s}
                          disabled={full}
                          onClick={() => setSlot(s)}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${
                            full
                              ? "cursor-not-allowed border-edge bg-canvas text-mute/50 line-through"
                              : slot === s
                                ? "border-teal bg-teal text-white"
                                : "border-edge bg-card text-ink hover:border-teal hover:text-teal"
                          }`}
                        >
                          {s}
                          {full && (
                            <span className="block text-[10px] font-semibold not-italic">
                              Penuh
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Langkah 2 — keluhan */}
            {step === 1 && (
              <div className="mt-6 space-y-4">
                <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  <FileText className="h-4 w-4 text-teal" />
                  Ceritakan keluhan Anda
                </p>
                <textarea
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  rows={4}
                  placeholder="Contoh: Demam sejak dua hari, disertai sakit kepala dan badan terasa lemas…"
                  className="w-full resize-none rounded-2xl border border-edge bg-card p-4 text-sm text-ink outline-none placeholder:text-mute/70 focus:border-teal"
                />
                <div className="flex flex-wrap gap-2">
                  {QUICK_COMPLAINTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setComplaint(c)}
                      className="rounded-full bg-canvas px-3.5 py-2 text-xs font-bold text-teal-deep transition-colors hover:bg-teal-soft"
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-mute">
                  Minimal 10 karakter. Keluhan ini akan langsung dibacakan dokter
                  saat konsultasi dimulai.
                </p>
              </div>
            )}

            {/* Langkah 3 — konfirmasi */}
            {step === 2 && (
              <div className="mt-6 space-y-3">
                <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  <UserRound className="h-4 w-4 text-teal" />
                  Periksa kembali janji Anda
                </p>
                <div className="space-y-2.5 rounded-2xl border border-edge p-5 text-sm">
                  <p className="flex justify-between gap-3">
                    <span className="text-mute">Dokter</span>
                    <span className="text-right font-bold text-ink">
                      {doctor.name}
                      {doctor.title ? `, ${doctor.title}` : ""} · {doctor.specialty}
                    </span>
                  </p>
                  <p className="flex justify-between gap-3">
                    <span className="text-mute">Tanggal &amp; jam</span>
                    <span className="text-right font-bold text-ink">
                      {date ? fmtIsoDate(date) : "—"} · {slot}
                    </span>
                  </p>
                  <p className="flex justify-between gap-3">
                    <span className="text-mute">Keluhan</span>
                    <span className="max-w-[60%] text-right font-bold text-ink">
                      {complaint}
                    </span>
                  </p>
                  <p className="flex justify-between gap-3 border-t border-edge pt-2.5">
                    <span className="text-mute">Biaya konsultasi</span>
                    <span className="text-right font-extrabold text-teal-deep">
                      {rupiah(doctor.fee)}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-mute">
                  Pembayaran disimulasikan — tidak ada transaksi nyata pada demo
                  ini.
                </p>
              </div>
            )}

            {/* Navigasi */}
            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
                className="inline-flex items-center gap-1.5 rounded-full border border-edge px-5 py-2.5 text-sm font-bold text-mute transition-colors hover:border-teal hover:text-teal"
              >
                <ArrowLeft className="h-4 w-4" />
                {step === 0 ? "Batal" : "Kembali"}
              </button>
              {step < 2 ? (
                <button
                  disabled={!canNext}
                  onClick={() => setStep(step + 1)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-white transition-colors enabled:hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Lanjut
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={confirm}
                  className="inline-flex items-center gap-1.5 rounded-full bg-coral px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-coral/90"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Konfirmasi Janji
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
