import { motion } from "framer-motion";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  FileHeart,
  MessageCircle,
  XCircle,
} from "lucide-react";
import { doctorById } from "../data/seed";
import { fmtIsoDate, rupiah } from "../utils/format";
import DoctorAvatar from "./DoctorAvatar";

const STATUS_BADGE = {
  mendatang: "bg-teal-soft text-teal-deep",
  selesai: "bg-emerald-50 text-emerald-700",
  batal: "bg-rose-50 text-rose-700",
};

const STATUS_LABEL = {
  mendatang: "Mendatang",
  selesai: "Selesai",
  batal: "Dibatalkan",
};

function AppointmentCard({ appt, onConsult, onCancel, onRecords, delay }) {
  const doctor = doctorById(appt.doctorId);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-2xl border border-edge bg-card p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <DoctorAvatar tone={doctor.tone} initial={doctor.initial} />
          <div>
            <h3 className="font-bold text-ink">
              {doctor.name}
              {doctor.title ? `, ${doctor.title}` : ""}
            </h3>
            <p className="text-xs font-semibold text-teal">{doctor.specialty}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${STATUS_BADGE[appt.status]}`}
        >
          {STATUS_LABEL[appt.status]}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <p className="flex items-center gap-2 text-mute">
          <CalendarDays className="h-4 w-4 shrink-0 text-teal" />
          <span className="font-semibold text-ink">{fmtIsoDate(appt.date)}</span>
          <span>· {appt.slot}</span>
        </p>
        <p className="font-mono text-xs font-bold tracking-wider text-mute">
          {appt.id}
        </p>
      </div>

      <p className="mt-3 rounded-xl bg-canvas px-3.5 py-2.5 text-sm text-mute">
        <span className="font-bold text-ink">Keluhan: </span>
        {appt.complaint}
      </p>

      {appt.status === "mendatang" && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-edge pt-4">
          <button
            onClick={() => onConsult(appt.id)}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-deep"
          >
            <MessageCircle className="h-4 w-4" />
            Masuk Ruang Konsultasi
          </button>
          <button
            onClick={() => onCancel(appt.id)}
            className="inline-flex items-center gap-1.5 rounded-full border border-edge px-4 py-2.5 text-sm font-bold text-mute transition-colors hover:border-coral hover:text-coral"
          >
            <XCircle className="h-4 w-4" />
            Batalkan
          </button>
        </div>
      )}

      {appt.status === "selesai" && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-edge pt-4">
          <p className="text-sm text-mute">
            Diagnosis: <span className="font-bold text-ink">{appt.diagnosis}</span>
            {appt.fee ? (
              <span> · {rupiah(appt.fee)}</span>
            ) : null}
          </p>
          <button
            onClick={onRecords}
            className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-4 py-2.5 text-sm font-bold text-teal-deep transition-colors hover:bg-teal-soft"
          >
            <FileHeart className="h-4 w-4" />
            Lihat Rekam Medis
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function Appointments({
  list,
  onConsult,
  onCancel,
  onRecords,
  onBook,
}) {
  const sorted = [...list].sort((a, b) => {
    const order = { mendatang: 0, selesai: 1, batal: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Janji Saya
          </h1>
          <p className="mt-1 text-sm text-mute">
            Kelola jadwal konsultasi yang mendatang maupun yang sudah selesai.
          </p>
        </div>
        <button
          onClick={onBook}
          className="inline-flex items-center gap-1.5 rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-deep"
        >
          <CalendarPlus className="h-4 w-4" />
          Buat Janji Baru
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-edge bg-card p-12 text-center">
          <ClipboardList className="h-10 w-10 text-mute/60" />
          <p className="font-bold text-ink">Belum ada janji</p>
          <p className="max-w-sm text-sm text-mute">
            Buat janji dengan salah satu dokter untuk mencoba ruang konsultasi
            dan rekam medis digital.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((a, i) => (
            <AppointmentCard
              key={a.id}
              appt={a}
              onConsult={onConsult}
              onCancel={onCancel}
              onRecords={onRecords}
              delay={i * 0.04}
            />
          ))}
        </div>
      )}

      <p className="flex items-center justify-center gap-1.5 text-xs text-mute">
        <CheckCircle2 className="h-3.5 w-3.5 text-teal" />
        Data tersimpan lokal di perangkat Anda — demo simulasi, bukan layanan
        medis nyata.
      </p>
    </div>
  );
}
