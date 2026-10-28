import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Doctors from "./components/Doctors";
import BookingModal from "./components/BookingModal";
import Appointments from "./components/Appointments";
import Consultation from "./components/Consultation";
import Records from "./components/Records";
import { useAppointments, useRecords, useAllergies } from "./hooks/useClinic";

export default function App() {
  const [view, setView] = useState("dokter");
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [initialApptId, setInitialApptId] = useState(null);

  const { list, upcoming, add, cancel, complete } = useAppointments();
  const records = useRecords();
  const allergies = useAllergies();

  const navigate = (v) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  const goConsult = (apptId) => {
    setInitialApptId(apptId);
    setBookingDoctor(null);
    navigate("konsultasi");
  };

  const completeAndSave = (apptId, { diagnosis, meds, fee }) => {
    const appt = list.find((a) => a.id === apptId);
    if (!appt) return;
    complete(apptId, { diagnosis, meds, fee });
    records.add({
      id: `RM-${Math.floor(1000 + Math.random() * 9000)}`,
      apptId,
      doctorId: appt.doctorId,
      dateTs: Date.now(),
      complaint: appt.complaint,
      diagnosis,
      meds,
      fee,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
      <Navbar view={view} onNavigate={navigate} upcomingCount={upcoming.length} />

      {/* Banner disclaimer wajib */}
      <div className="border-b border-edge bg-coral-soft">
        <p className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-2.5 text-xs font-semibold text-coral md:px-8">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Demo simulasi — bukan layanan medis nyata. Seluruh dokter, pasien,
          obrolan, diagnosis &amp; resep bersifat fiktif dan tidak untuk
          keperluan diagnosis maupun pengobatan.
        </p>
      </div>

      <main className="flex-1 pb-20 md:pb-16">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {view === "dokter" && (
            <Doctors
              onBook={(doctor) => setBookingDoctor(doctor)}
            />
          )}
          {view === "janji" && (
            <Appointments
              list={list}
              onConsult={goConsult}
              onCancel={cancel}
              onRecords={() => navigate("rekam")}
              onBook={() => navigate("dokter")}
            />
          )}
          {view === "konsultasi" && (
            <Consultation
              list={list}
              initialApptId={initialApptId}
              onComplete={completeAndSave}
              onGoBook={() => navigate("dokter")}
            />
          )}
          {view === "rekam" && (
            <Records
              records={records.list}
              allergies={allergies.list}
              onAddAllergy={allergies.add}
              onRemoveAllergy={allergies.remove}
            />
          )}
        </div>
      </main>

      <Footer />

      {bookingDoctor && (
        <BookingModal
          key={bookingDoctor.id}
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          onBooked={add}
          onGoConsult={goConsult}
        />
      )}
    </div>
  );
}
