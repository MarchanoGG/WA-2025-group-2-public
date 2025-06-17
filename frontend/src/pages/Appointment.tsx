import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { setField, Field } from "../store/parentBookingSlice";
import { api } from "../api/client";

import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import Button from "../components/Button";

interface Role {
  name: "mentor" | "dean" | "teamleader";
}
interface ApiUser {
  id: number;
  initials: string;
  roles: { role: Role }[];
}
interface ApiClass {
  id: number;
  className: string;
  education: "vmbo" | "havo" | "vwo";
  users: { user: ApiUser }[];
}

export default function Appointment() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const booking = useSelector((s: RootState) => s.parentBooking);
  const code = booking.parentCode;

  const [rawClasses, setRawClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "parent") {
      navigate("/Parents/Login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post("/parent-api/classes", { code });
        setRawClasses(data);
      } catch (err) {
        console.error(err);
        setError("Kon klassen niet laden.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const levels = useMemo(() => {
    const set = new Set(rawClasses.map(c => c.education));
    return [...set].sort().map(l => ({ value: l, label: l.toUpperCase() }));
  }, [rawClasses]);

  const classesForLevel = useMemo(() => {
    if (!booking.level) return [];
    return rawClasses
      .filter(c => c.education === booking.level)
      .sort((a, b) => a.className.localeCompare(b.className))
      .map(c => ({ value: String(c.id), label: c.className }));
  }, [rawClasses, booking.level]);

  const mentorsForLevel = useMemo(() => {
    if (!booking.level) return [];

    const map = new Map<number, string>();

    rawClasses
      .filter(c => c.education === booking.level)
      .forEach(c => {
        c.users.forEach(({ user }) => {
          const role = user.roles[0]?.role?.name ?? "";
          const label = `${role.charAt(0).toUpperCase() + role.slice(1)} - ${user.initials}`;
          map.set(user.id, label);
        });
      });

    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([id, label]) => ({ value: id, label }));
  }, [rawClasses, booking.level]);

  /* ----- helpers ----- */
  const update = <K extends Field>(field: K, value: any) => dispatch(setField({ field, value }));

  const handleNext = () => {
    const required: Field[] = ["studentNumber", "studentName", "parentName", "phoneNumber", "email", "level", "classId", "userId"];
    if (required.some(k => !booking[k])) {
      setError("Vul alle velden in voordat je verder gaat.");
      return;
    }
    setError("");
    navigate("/Parents/Booking");
  };

  const fillDummy = () => {
    update("studentNumber", "123456");
    update("studentName", "Jan de Jong");
    update("parentName", "Piet de Jong");
    update("phoneNumber", "0612345678");
    update("email", "ouder@example.com");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold mb-4 underline">Aanmelden</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Laden…</p>}

      {!loading && (
        <>
          <TextInput placeholder="Leerlingnummer" value={booking.studentNumber ?? ""} onChange={e => update("studentNumber", e.target.value)} classes="mb-4" />
          <TextInput placeholder="Naam kind" value={booking.studentName ?? ""} onChange={e => update("studentName", e.target.value)} classes="mb-4" />
          <TextInput placeholder="Naam ouder" value={booking.parentName ?? ""} onChange={e => update("parentName", e.target.value)} classes="mb-4" />
          <TextInput placeholder="Telefoonnummer" value={booking.phoneNumber ?? ""} onChange={e => update("phoneNumber", e.target.value)} classes="mb-4" />
          <TextInput placeholder="E-mailadres" value={booking.email ?? ""} onChange={e => update("email", e.target.value)} classes="mb-4" />

          <SelectInput placeholder="Niveau" value={booking.level ?? ""} onChange={e => update("level", e.target.value)} options={levels} classes="mb-4" />

          <SelectInput placeholder="Klas" value={booking.classId ?? ""} onChange={e => update("classId", e.target.value)} options={classesForLevel} disabled={!booking.level} classes="mb-4" />

          <SelectInput placeholder="Mentor/Dekaan/Teamleider" value={booking.userId ?? ""} onChange={e => update("userId", Number(e.target.value))} options={mentorsForLevel} disabled={!booking.level} classes="mb-6" />

          <Button text="Verder" action={handleNext} classes="w-full" />

          <Button text="Dummy invullen" action={fillDummy} classes="w-full mt-2 bg-gray-200 text-gray-700 hover:bg-gray-300" />
        </>
      )}
    </div>
  );
}
