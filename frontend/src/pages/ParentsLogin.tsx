import { useState } from "react";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useDispatch } from "react-redux";
import {  setField } from "../store/parentBookingSlice";

export default function ParentsLogin() {
  const [code, setCode] = useState("");
  const [errorMessage, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const clean = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    if (clean.length !== 16) {
      setError("Ongeldige code. Zorg ervoor dat de code 16 karakters lang is.");
      return;
    }

    try {
      await api.post("/parent-api/classes", { code: clean });

      dispatch(setField({ field: "parentCode", value: clean }));
      sessionStorage.setItem("parentCode", clean);
      sessionStorage.setItem("userRole", "parent");
      setError("");
      navigate("/Parents/Appointment");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.status === 403 || err?.response?.status === 404 ? "Deze code bestaat niet of is ongeldig." : "Er ging iets mis bij het controleren van de code.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold mb-4">Login als Ouder</h1>
      <p className="text-center mb-6 text-gray-500">Vul hier de unieke 16-karakterige code in om een afspraak te maken.</p>

      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <TextInput value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="XXXX-XXXX-XXXX-XXXX" name="parentCode" classes="mb-6" />

      <Button text="Verder" action={handleLogin} classes="w-full" />
    </div>
  );
}

