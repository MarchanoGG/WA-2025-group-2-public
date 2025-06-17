// src/pages/Confirm.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { resetBooking } from "../store/parentBookingSlice";
import { format } from "date-fns";
import Button from "../components/Button";
import { api } from "../api/client";

export default function Confirm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const booking = useSelector((s: RootState) => s.parentBooking);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "parent") {
      navigate("/Parents/Login", { replace: true });
    }
  }, [navigate]);

  if (!booking.appointmentId) return null;

  const formattedDate = booking.startTime ? format(new Date(booking.startTime), "d MMMM yyyy") : "Onbekend";

  const timeRange = booking.startTime && booking.endTime ? `${format(new Date(booking.startTime), "HH:mm")} – ${format(new Date(booking.endTime), "HH:mm")}` : "Onbekend";

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      await api.post(`/parent-api/bookappointments/${booking.appointmentId}`, {
        code: booking.parentCode,
        studentNumber: booking.studentNumber,
        studentName: booking.studentName,
        parentName: booking.parentName,
        phoneNumber: booking.phoneNumber,
        email: booking.email,
        level: booking.level,
        class: booking.classId
      });

      sessionStorage.setItem("appointmentDate", formattedDate);
      sessionStorage.setItem("appointmentTime", timeRange);
      sessionStorage.setItem("parentCode", booking.parentCode ?? "");

      navigate("/Parents/Succes");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.status === 409 ? "Dit tijdslot is net geboekt door iemand anders." : "Er ging iets mis bij het opslaan. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-24">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-xl font-bold mb-2">Afspraak bevestigen</h2>

        {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

        <p className="mb-4">
          Beste ouders/verzorgers van <strong>{booking.studentName}</strong>, u staat op het punt een afspraak te maken bij de mentor/dekaan van klas&nbsp;
          <strong>{booking.classId}</strong>. Controleer de gegevens en klik op
          <em> Bevestig</em> als alles klopt. U ontvangt een bevestiging per mail.
        </p>

        <div className="mb-4 text-sm leading-relaxed">
          <p>
            <strong>Leerlingnummer:</strong> {booking.studentNumber}
          </p>
          <p>
            <strong>Naam kind:</strong> {booking.studentName}
          </p>
          <p>
            <strong>Telefoonnummer:</strong> {booking.phoneNumber}
          </p>
          <p>
            <strong>E-mailadres:</strong> {booking.email}
          </p>
        </div>

        <div className="mb-6 text-sm">
          <p>
            <strong>Datum afspraak:</strong> {formattedDate}
          </p>
          <p>
            <strong>Tijd:</strong> {timeRange}
          </p>
        </div>

        <div className="flex gap-4 justify-end">
          <Button text="Terug" action={() => navigate(-1)} classes="bg-white text-black border" disabled={loading} />
          <Button text={loading ? "Bezig…" : "Bevestig"} action={handleConfirm} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
