import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  MessageCircle,
  Pill,
  Send,
  ShieldCheck,
} from "lucide-react";
import { CHAT_CHIPS, CHAT_FALLBACK_REPLY, PATIENT, doctorById } from "../data/seed";
import { fmtIsoDate, fmtTime, greetingWord } from "../utils/format";
import { loadChat, saveChat } from "../hooks/useClinic";
import DoctorAvatar from "./DoctorAvatar";

// Fase mesin chat: greet → ask → patient → probe → wait → ack → advice → prescribe → end → done
const STEPS = {
  greet: { delay: 900, next: "ask" },
  ask: { delay: 1600, next: "patient" },
  patient: { delay: 1200, next: "probe" },
  probe: { delay: 1600, next: "wait" },
  ack: { delay: 1400, next: "advice" },
  advice: { delay: 1500, next: "prescribe" },
  prescribe: { delay: 1300, next: "end" },
};

const TYPING_PHASES = new Set(["greet", "ask", "patient", "probe", "ack", "advice", "prescribe"]);

function buildMessage(phase, appt, choice) {
  const doctor = doctorById(appt.doctorId);
  const fullName = `${doctor.name}${doctor.title ? `, ${doctor.title}` : ""}`;
  const firstName = PATIENT.name.split(" ")[0];
  switch (phase) {
    case "greet":
      return `${greetingWord()}, ${firstName}. Saya ${fullName} — ada yang bisa saya bantu hari ini?`;
    case "ask":
      return "Boleh ceritakan keluhan yang Anda rasakan dengan lebih detail?";
    case "patient":
      return appt.complaint;
    case "probe":
      return doctor.probe;
    case "ack":
      return choice || CHAT_FALLBACK_REPLY;
    case "advice":
      return doctor.advice;
    default:
      return "";
  }
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2">
      <div className="rounded-2xl rounded-bl-md border border-edge bg-card px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-mute/60" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-mute/60" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-mute/60" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function ResepCard({ doctor }) {
  return (
    <div className="rounded-2xl border border-teal/30 bg-teal-soft/60 p-4">
      <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide text-teal-deep uppercase">
        <Pill className="h-4 w-4" />
        Resep Digital (simulasi)
      </p>
      {doctor.meds.length > 0 ? (
        <ul className="mt-3 space-y-2.5">
          {doctor.meds.map((m) => (
            <li key={m.name} className="rounded-xl bg-card p-3">
              <p className="text-sm font-bold text-ink">{m.name}</p>
              <p className="text-xs text-mute">
                {m.dose} — {m.rule}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2.5 rounded-xl bg-card p-3 text-sm text-mute">
          {doctor.medNote}
        </p>
      )}
      <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-mute">
        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-coral" />
        Demo simulasi — bukan resep nyata. Jangan dikonsumsi tanpa anjuran
        dokter sesungguhnya.
      </p>
    </div>
  );
}

export default function Consultation({
  list,
  initialApptId,
  onComplete,
  onGoBook,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [chat, setChat] = useState(null); // { phase, choice, messages }
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  const sorted = useMemo(() => {
    const order = { mendatang: 0, selesai: 1, batal: 2 };
    return [...list].sort(
      (a, b) => order[a.status] - order[b.status] || b.createdAt - a.createdAt
    );
  }, [list]);

  const appt = list.find((a) => a.id === selectedId) || null;
  const doctor = appt ? doctorById(appt.doctorId) : null;

  // Pilih janji awal
  useEffect(() => {
    if (initialApptId) {
      setSelectedId(initialApptId);
    } else if (!selectedId && sorted.length > 0) {
      setSelectedId(sorted[0].id);
    }
  }, [initialApptId, sorted, selectedId]);

  // Muat / inisialisasi chat saat janji berubah
  useEffect(() => {
    if (!appt) {
      setChat(null);
      return;
    }
    const saved = loadChat(appt.id);
    setChat(
      saved && Array.isArray(saved.messages)
        ? saved
        : { phase: "greet", choice: null, messages: [] }
    );
    setDraft("");
  }, [appt?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mesin fase — jadwalkan pesan berikutnya
  useEffect(() => {
    if (!chat || !appt) return;
    const step = STEPS[chat.phase];
    if (!step) return;

    const key = `m-${chat.phase}`;
    if (chat.messages.some((m) => m.key === key)) {
      // Sudah tersimpan (mis. remount) — langsung maju fase
      setChat((c) => (c && c.phase === chat.phase ? { ...c, phase: step.next } : c));
      return;
    }
    const t = setTimeout(() => {
      setChat((c) => {
        if (!c || c.phase !== chat.phase) return c;
        if (c.messages.some((m) => m.key === key)) return c;
        const isResep = chat.phase === "prescribe";
        return {
          ...c,
          messages: [
            ...c.messages,
            {
              key,
              from: chat.phase === "patient" ? "user" : "doc",
              type: isResep ? "resep" : "text",
              text: isResep ? "" : buildMessage(chat.phase, appt, c.choice),
              at: Date.now(),
            },
          ],
          phase: step.next,
        };
      });
    }, step.delay);
    return () => clearTimeout(t);
  }, [chat, appt]);

  // Simpan chat setiap berubah
  useEffect(() => {
    if (chat && appt) saveChat(appt.id, chat);
  }, [chat, appt]);

  // Gulir ke bawah saat pesan baru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat?.messages.length, chat?.phase]);

  const sendUser = (text, reply) => {
    if (!chat || chat.phase !== "wait" || !text.trim()) return;
    setChat((c) => ({
      ...c,
      choice: reply || CHAT_FALLBACK_REPLY,
      messages: [
        ...c.messages,
        { key: `u-${Date.now()}`, from: "user", type: "text", text: text.trim(), at: Date.now() },
      ],
      phase: "ack",
    }));
    setDraft("");
  };

  const finishConsultation = () => {
    if (!appt || !doctor) return;
    onComplete(appt.id, {
      diagnosis: doctor.diagnosis,
      meds: doctor.meds,
      fee: doctor.fee,
    });
    setChat((c) => (c ? { ...c, phase: "done" } : c));
  };

  /* ---------- Daftar janji (panel kiri) ---------- */
  const apptList = (
    <div className="space-y-2">
      {sorted.length === 0 && (
        <div className="rounded-2xl border border-dashed border-edge bg-card p-6 text-center text-sm text-mute">
          Belum ada janji untuk dibuka.
        </div>
      )}
      {sorted.map((a) => {
        const d = doctorById(a.doctorId);
        const active = a.id === selectedId;
        return (
          <button
            key={a.id}
            onClick={() => setSelectedId(a.id)}
            className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
              active
                ? "border-teal bg-teal-soft/60"
                : "border-edge bg-card hover:border-teal"
            }`}
          >
            <DoctorAvatar tone={d.tone} initial={d.initial} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">
                {d.name}
                {d.title ? `, ${d.title}` : ""}
              </p>
              <p className="truncate text-xs text-mute">
                {fmtIsoDate(a.date)} · {a.slot}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                a.status === "mendatang"
                  ? "bg-teal text-white"
                  : a.status === "selesai"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
              }`}
            >
              {a.status === "mendatang"
                ? "Aktif"
                : a.status === "selesai"
                  ? "Selesai"
                  : "Batal"}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Ruang Konsultasi
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-mute">
          Chat simulasi dengan dokter: sapaan → tanya gejala → saran + resep digital.
          <span className="inline-flex items-center gap-1 rounded-full bg-coral-soft px-2.5 py-1 text-[11px] font-bold text-coral">
            <AlertTriangle className="h-3 w-3" />
            Simulasi — bukan layanan medis nyata
          </span>
        </p>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-edge bg-card p-12 text-center">
          <MessageCircle className="h-10 w-10 text-mute/60" />
          <p className="font-bold text-ink">Belum ada janji aktif</p>
          <p className="max-w-sm text-sm text-mute">
            Buat janji terlebih dahulu untuk membuka ruang konsultasi chat.
          </p>
          <button
            onClick={onGoBook}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-deep"
          >
            <CalendarPlus className="h-4 w-4" />
            Cari Dokter &amp; Buat Janji
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
          {/* Panel kiri */}
          <div className="order-2 lg:order-1">{apptList}</div>

          {/* Panel chat */}
          <div className="order-1 flex min-h-[520px] flex-col rounded-2xl border border-edge bg-card lg:order-2">
            {appt && doctor && chat ? (
              <>
                {/* Header chat */}
                <div className="flex items-center gap-3 border-b border-edge px-5 py-4">
                  <DoctorAvatar tone={doctor.tone} initial={doctor.initial} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">
                      {doctor.name}
                      {doctor.title ? `, ${doctor.title}` : ""}
                    </p>
                    <p className="truncate text-xs text-mute">
                      {doctor.specialty} · {appt.id}
                    </p>
                  </div>
                  <span
                    className={`hidden rounded-full px-3 py-1.5 text-xs font-bold sm:inline-flex ${
                      appt.status === "mendatang"
                        ? "bg-teal-soft text-teal-deep"
                        : appt.status === "selesai"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {appt.status === "mendatang"
                      ? "Sesi aktif"
                      : appt.status === "selesai"
                        ? "Selesai"
                        : "Dibatalkan"}
                  </span>
                </div>

                {/* Pesan */}
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                  <p className="mx-auto w-fit rounded-full bg-canvas px-3.5 py-1.5 text-[11px] font-semibold text-mute">
                    {fmtIsoDate(appt.date)} · Konsultasi chat (simulasi)
                  </p>
                  <AnimatePresence initial={false}>
                    {chat.messages.map((m) => (
                      <motion.div
                        key={m.key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {m.type === "resep" ? (
                          <div className="w-full max-w-md">
                            <ResepCard doctor={doctor} />
                            <p className="mt-1 text-[10px] text-mute">{fmtTime(m.at)}</p>
                          </div>
                        ) : (
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] ${
                              m.from === "user" ? "text-right" : ""
                            }`}
                          >
                            <div
                              className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                m.from === "user"
                                  ? "rounded-br-md bg-teal text-white"
                                  : "rounded-bl-md border border-edge bg-card text-ink"
                              }`}
                            >
                              {m.text}
                            </div>
                            <p className="mt-1 text-[10px] text-mute">{fmtTime(m.at)}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {TYPING_PHASES.has(chat.phase) && (
                    <TypingBubble />
                  )}
                  {chat.phase === "done" && (
                    <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      Konsultasi selesai — hasilnya tersimpan di Rekam Medis.
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input / aksi */}
                <div className="border-t border-edge px-5 py-4">
                  {appt.status === "mendatang" && chat.phase === "wait" && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {CHAT_CHIPS.map((c) => (
                        <button
                          key={c.label}
                          onClick={() => sendUser(c.label, c.reply)}
                          className="rounded-full bg-canvas px-3.5 py-2 text-xs font-bold text-teal-deep transition-colors hover:bg-teal-soft"
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {appt.status === "mendatang" && chat.phase === "wait" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendUser(draft, null);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Tulis jawaban Anda…"
                        className="flex-1 rounded-full border border-edge bg-card px-4 py-2.5 text-sm text-ink outline-none placeholder:text-mute/70 focus:border-teal"
                      />
                      <button
                        type="submit"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-teal-deep"
                        aria-label="Kirim"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                  {appt.status === "mendatang" && chat.phase === "end" && (
                    <button
                      onClick={finishConsultation}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-coral/90"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Akhiri Konsultasi &amp; Simpan ke Rekam Medis
                    </button>
                  )}
                  {(appt.status !== "mendatang" ||
                    chat.phase === "done") && (
                    <p className="text-center text-xs text-mute">
                      {appt.status === "batal"
                        ? "Janji ini dibatalkan — transkrip hanya bisa dibaca."
                        : "Sesi ini sudah selesai — transkrip tersimpan di rekam medis."}
                    </p>
                  )}
                  {appt.status === "mendatang" &&
                    !["wait", "end", "done"].includes(chat.phase) && (
                      <p className="text-center text-xs text-mute">
                        Dokter sedang menulis…
                      </p>
                    )}
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center text-sm text-mute">
                <MessageCircle className="h-9 w-9 text-mute/50" />
                Pilih janji di panel kiri untuk membuka ruang konsultasi.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
