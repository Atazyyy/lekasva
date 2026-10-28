// Avatar inisial berwarna — tanpa foto orang.
const TONES = {
  teal: "bg-teal-soft text-teal-deep",
  sky: "bg-sky-100 text-sky-700",
  rose: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
  emerald: "bg-emerald-100 text-emerald-700",
  orange: "bg-orange-100 text-orange-700",
  cyan: "bg-cyan-100 text-cyan-700",
};

export default function DoctorAvatar({ tone = "teal", initial, size = "md" }) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
  };
  return (
    <div
      className={`flex shrink-0 select-none items-center justify-center rounded-2xl font-extrabold ${
        TONES[tone] || TONES.teal
      } ${sizes[size] || sizes.md}`}
    >
      {initial}
    </div>
  );
}
