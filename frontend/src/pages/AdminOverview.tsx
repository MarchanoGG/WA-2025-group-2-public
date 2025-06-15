import { useState } from "react";
import OverviewTable from "../components/OverviewTable";
import OverviewSearch from "../components/OverviewSearch";
import AdminOverviewPopup from "../components/AdminOverviewPopup";
import Toast from "../components/Toast";
import { dummyAdminAppointments } from "../dummyAdminOverview";
import type { Appointment } from "../types/interfaces";

export default function AdminOverview() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState(dummyAdminAppointments);
  const [toast, setToast] = useState("");

  const filtered = appointments.filter((a) =>
    a.studentName?.toLowerCase().includes(search.toLowerCase())
  );

  const pageSize = 5;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPageData = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleDelete = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setSelected(null);
    setToast("Afspraak is verwijderd.");
  };

  const handleSave = (updatedItem: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updatedItem.id ? updatedItem : a))
    );
    setSelected(null);
    setToast("Afspraak is opgeslagen.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-center mb-4">
        Admin Overzicht Afspraken
      </h1>
      <div className="bg-white rounded-md p-4 shadow-sm">
        <OverviewSearch value={search} onChange={setSearch} />
        <OverviewTable
          data={currentPageData}
          onSelect={setSelected}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
      {selected && (
        <AdminOverviewPopup
          item={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
