import { useEffect, useState } from 'react';
import OverviewTable from '../components/OverviewTable';
import OverviewSearch from '../components/OverviewSearch';
import AdminOverviewPopup from '../components/AdminOverviewPopup';
import Toast from '../components/Toast';

import {
  getAppointments,
  deleteAppointment,
  type Appointment,
} from '../api/appointments';

export default function AdminOverview() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setError('Kon afspraken niet ophalen.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pageSize = 15;

  const filtered = appointments
    .filter(a => a.studentName && a.studentName.trim() !== '')
    .filter(a =>
      a.studentName!.toLowerCase().includes(search.toLowerCase()),
    );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPageData = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handleSelect = (item: Appointment) => setSelected(item);

  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
      setToast('Afspraak is verwijderd.');
    } catch (err) {
      console.error(err);
      setToast('Verwijderen mislukt.');
    } finally {
      setSelected(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-center mb-4">
        Admin Overzicht Afspraken
      </h1>

      <div className="bg-white rounded-md p-4 shadow-sm">
        <OverviewSearch value={search} onChange={setSearch} />

        {loading ? (
          <p className="text-center text-sm text-gray-500">Laden…</p>
        ) : error ? (
          <p className="text-center text-sm text-red-600">{error}</p>
        ) : (
          <OverviewTable
            data={currentPageData}
            onSelect={handleSelect}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )}
      </div>

      {selected && (
        <AdminOverviewPopup
          item={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
