export const rupiah = (n) => `Rp${n.toLocaleString("id-ID")}`;

export const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const fmtDateTime = (ts) => `${fmtDate(ts)}, ${fmtTime(ts)}`;

// ISO date (yyyy-mm-dd) → "Senin, 3 November 2026"
export const fmtIsoDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ISO date → label pendek "Sen, 3 Nov"
export const fmtIsoShort = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export const fullDate = () =>
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const dayName = (idx) =>
  new Date(2026, 9, 4 + idx).toLocaleDateString("id-ID", { weekday: "long" });

// Sapaan sesuai jam: pagi / siang / sore / malam
export const greetingWord = () => {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return "Selamat pagi";
  if (h >= 11 && h < 15) return "Selamat siang";
  if (h >= 15 && h < 18.5) return "Selamat sore";
  return "Selamat malam";
};
