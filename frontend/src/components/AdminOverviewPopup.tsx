type Props = {
  item: {
    id: number;
    studentName: string | null;
    parentName: string | null;
    phoneNumber: string | null;
    email: string | null;
    startTime: string;
    endTime: string;
  };
  onClose: () => void;
  onDelete: (id: number) => void;
};

export default function AdminOverviewPopup({
  item,
  onClose,
  onDelete,
}: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-md border z-50 text-sm">
        <h2 className="text-lg font-semibold mb-4">
          Afspraakdetails
        </h2>

        <dl className="space-y-1">
          <dt className="font-medium">Leerling</dt>
          <dd>{item.studentName ?? '—'}</dd>

          <dt className="font-medium">Ouder</dt>
          <dd>{item.parentName ?? '—'}</dd>

          <dt className="font-medium">Telefoon</dt>
          <dd>{item.phoneNumber ?? '—'}</dd>

          <dt className="font-medium">E-mail</dt>
          <dd>{item.email ?? '—'}</dd>

          <dt className="font-medium">Tijdslot</dt>
          <dd>
            {new Date(item.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {' — '}
            {new Date(item.endTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </dd>
        </dl>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded text-sm"
          >
            Terug
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
          >
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}
