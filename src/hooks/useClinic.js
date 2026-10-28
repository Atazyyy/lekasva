import { useEffect, useState } from "react";
import {
  SEED_APPOINTMENTS,
  SEED_RECORDS,
} from "../data/seed";

function loadKeyed(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    /* abaikan — fallback ke seed */
  }
  return fallback;
}

function usePersisted(key, seed) {
  const [value, setValue] = useState(() => loadKeyed(key, seed));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage penuh / private mode — biarkan */
    }
  }, [key, value]);
  return [value, setValue];
}

// ---------- Janji ----------
const APPT_KEY = "lekasva-appointments-v1";

export function useAppointments() {
  const [appointments, setAppointments] = usePersisted(APPT_KEY, null);

  // Seed saat pertama kali
  useEffect(() => {
    if (!Array.isArray(appointments)) {
      setAppointments(SEED_APPOINTMENTS);
    }
  }, [appointments, setAppointments]);

  const list = Array.isArray(appointments) ? appointments : [];

  const add = (appt) => setAppointments((prev) => [appt, ...(Array.isArray(prev) ? prev : [])]);

  const cancel = (id) =>
    setAppointments((prev) =>
      (Array.isArray(prev) ? prev : []).map((a) =>
        a.id === id ? { ...a, status: "batal" } : a
      )
    );

  const complete = (id, { diagnosis, meds, fee }) =>
    setAppointments((prev) =>
      (Array.isArray(prev) ? prev : []).map((a) =>
        a.id === id ? { ...a, status: "selesai", diagnosis, meds, fee } : a
      )
    );

  const upcoming = list.filter((a) => a.status === "mendatang");
  const byId = (id) => list.find((a) => a.id === id) || null;

  return { list, upcoming, byId, add, cancel, complete };
}

// ---------- Rekam medis ----------
const RECORD_KEY = "lekasva-records-v1";

export function useRecords() {
  const [records, setRecords] = usePersisted(RECORD_KEY, null);

  useEffect(() => {
    if (!Array.isArray(records)) {
      setRecords(SEED_RECORDS);
    }
  }, [records, setRecords]);

  const list = Array.isArray(records) ? records : [];

  const add = (rec) => setRecords((prev) => [rec, ...(Array.isArray(prev) ? prev : [])]);

  return { list, add };
}

// ---------- Alergi pasien ----------
const ALLERGY_KEY = "lekasva-allergies-v1";

export function useAllergies() {
  const [allergies, setAllergies] = usePersisted(ALLERGY_KEY, null);

  useEffect(() => {
    if (!Array.isArray(allergies)) {
      setAllergies(["Debu", "Seafood"]);
    }
  }, [allergies, setAllergies]);

  const list = Array.isArray(allergies) ? allergies : [];

  const add = (name) => {
    const clean = name.trim();
    if (!clean || list.some((a) => a.toLowerCase() === clean.toLowerCase())) return;
    setAllergies([...list, clean]);
  };

  const remove = (name) => setAllergies(list.filter((a) => a !== name));

  return { list, add, remove };
}

// ---------- Chat konsultasi (persist per janji) ----------
const CHAT_KEY = "lekasva-chat-v1";

export function loadChat(apptId) {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    if (all && typeof all === "object" && all[apptId]) return all[apptId];
  } catch {
    /* abaikan */
  }
  return null;
}

export function saveChat(apptId, state) {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[apptId] = state;
    localStorage.setItem(CHAT_KEY, JSON.stringify(all));
  } catch {
    /* abaikan */
  }
}
