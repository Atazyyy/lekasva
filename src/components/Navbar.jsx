import { CalendarDays, FileHeart, HeartPulse, MessageCircle, Stethoscope } from "lucide-react";
import { WA_LINK } from "./Footer";

const NAV = [
  { id: "dokter", label: "Cari Dokter", short: "Dokter", icon: Stethoscope },
  { id: "janji", label: "Janji Saya", short: "Janji", icon: CalendarDays },
  { id: "konsultasi", label: "Ruang Konsultasi", short: "Konsultasi", icon: MessageCircle },
  { id: "rekam", label: "Rekam Medis", short: "Rekam Medis", icon: FileHeart },
];

export default function Navbar({ view, onNavigate, upcomingCount }) {
  return (
    <>
      {/* Bar atas */}
      <header className="sticky top-0 z-30 border-b border-edge bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <button
            onClick={() => onNavigate("dokter")}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-ink">
              Lekasva<span className="text-coral">.</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 rounded-full bg-canvas p-1 md:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => onNavigate(n.id)}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    view === n.id
                      ? "bg-teal text-white shadow-sm"
                      : "text-mute hover:text-teal"
                  }`}
                >
                  {n.label}
                  {n.id === "janji" && upcomingCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                      {upcomingCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full bg-teal-soft px-4 py-2 text-sm font-bold text-teal-deep transition-colors hover:bg-teal hover:text-white lg:inline-flex"
            >
              <MessageCircle className="h-4 w-4" />
              62812-3456-7890
            </a>
          </div>
        </div>
      </header>

      {/* Tab bawah mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-edge bg-card/95 backdrop-blur md:hidden">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => onNavigate(n.id)}
            className={`relative flex-1 py-2.5 text-[11px] font-bold ${
              view === n.id ? "text-teal" : "text-mute"
            }`}
          >
            <n.icon className="mx-auto h-5 w-5" />
            <span className="mt-0.5 block">{n.short}</span>
            {n.id === "janji" && upcomingCount > 0 && (
              <span className="absolute top-1.5 right-1/4 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                {upcomingCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </>
  );
}
