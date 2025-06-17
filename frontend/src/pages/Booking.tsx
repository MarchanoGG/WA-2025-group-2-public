import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { nl } from "date-fns/locale";
import { format, isSameDay, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { setField } from "../store/parentBookingSlice";
import { api } from "../api/client";
import Button from "../components/Button";
import TimeSlot from "../components/TimeSlot";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: number;
  startTime: string;
  endTime: string;
}

export default function Booking() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const booking = useSelector((s: RootState) => s.parentBooking);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "parent" || !booking.parentCode || !booking.userId) {
      navigate("/Parents/Login", { replace: true });
      return;
    }
  }, [booking.parentCode, booking.userId, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post(`/parent-api/appointments/${booking.userId}`, {
          code: booking.parentCode
        });
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setError("Kon beschikbare afspraken niet laden.");
      } finally {
        setLoading(false);
      }
    })();
  }, [booking.userId, booking.parentCode]);

  const availableDates = useMemo(() => {
    const uniq = new Set(appointments.map(a => format(parseISO(a.startTime), "yyyy-MM-dd")));
    return [...uniq].map(d => new Date(d));
  }, [appointments]);

  const timeOptions = useMemo(() => {
    return appointments
      .filter(a => isSameDay(parseISO(a.startTime), selectedDate))
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map(a => ({
        label: `${format(parseISO(a.startTime), "HH:mm")} – ${format(parseISO(a.endTime), "HH:mm")}`,
        ...a
      }));
  }, [appointments, selectedDate]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime("");
    dispatch(setField({ field: "appointmentId", value: null }));
    dispatch(setField({ field: "startTime", value: null }));
    dispatch(setField({ field: "endTime", value: null }));
  };

  const handleTimeClick = (slot: any) => {
    setSelectedTime(slot.label);
    dispatch(setField({ field: "appointmentId", value: slot.id }));
    dispatch(setField({ field: "startTime", value: slot.startTime }));
    dispatch(setField({ field: "endTime", value: slot.endTime }));
  };

  const handleConfirm = () => {
    if (!booking.appointmentId) return alert("Kies eerst een tijdslot.");
    navigate("/Parents/Confirm");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
        <div className="bg-white p-6 rounded shadow text-center w-full md:w-auto">
          <h2 className="text-lg font-bold mb-4">Datum</h2>
          {loading ? <p>Laden…</p> : error ? <p className="text-red-600">{error}</p> : <DatePicker selected={selectedDate} onChange={handleDateChange} inline locale={nl} dateFormat="dd-MM-yyyy" includeDates={availableDates} minDate={new Date()} highlightDates={[{ "react-datepicker__day--has-availability": availableDates }]} />}
        </div>

        <div className="bg-white p-6 rounded shadow text-center w-full md:w-auto">
          <h2 className="text-lg font-bold mb-4">Tijd</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {timeOptions.map(slot => (
              <TimeSlot key={slot.id} time={slot.label} selected={selectedTime === slot.label} onClick={() => handleTimeClick(slot)} />
            ))}
            {timeOptions.length === 0 && !loading && <p className="col-span-full text-sm text-gray-500">Geen timeslots beschikbaar op deze dag.</p>}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Button text="Bevestigen" action={handleConfirm} />
      </div>
    </div>
  );
}
