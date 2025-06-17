import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Succes() {
  const navigate = useNavigate();

  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "parent") {
      navigate("/Parents/Login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const storedDate = sessionStorage.getItem("appointmentDate");
    const storedTime = sessionStorage.getItem("appointmentTime");
    const storedCode = sessionStorage.getItem("parentCode");

    const allValid = storedDate?.trim() && storedTime?.trim() && storedCode?.trim();

    if (!allValid) {
      console.warn("Geen geldige sessie, terug naar login");
      navigate("/Parents/Login", { replace: true });
    } else {
      setDate(storedDate!);
      setTime(storedTime!);
    }

    setLoading(false);
  }, [navigate]);

  if (loading || !date || !time) return null;

  return (
    <div className="flex justify-center pt-24">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg text-center">
        <h2 className="text-xl font-bold mb-4">Afspraak succesvol gepland!</h2>
        <p className="mb-4">
          Bedankt voor het maken van een afspraak op <strong>{date}</strong> om <strong>{time}</strong>.<br />U ontvangt binnenkort een bevestiging per e-mail.
        </p>
      </div>
    </div>
  );
}
