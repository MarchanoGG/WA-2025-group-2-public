import { User } from "../userAdmin" 
type Props = {
  data: User[]
  page: number
  totalPages: number
  setPage: (page: number) => void
  onSelect: (user: User) => void
}

export default function AdminUsersTable({
  data,
  page,
  totalPages,
  setPage,
  onSelect,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto border-collapse min-w-[600px]">
          <thead>
            <tr className="text-gray-500 text-left border-b border-gray-200">
              <th className="p-3">Voornaam</th>
              <th className="p-3">Achternaam</th>
              <th className="p-3">Email</th>
              <th className="p-3">Initialen</th>
              <th className="p-3">Rollen</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3">{user.firstName}</td>
                <td className="p-3">{user.lastName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.initials}</td>
                <td className="p-3">{user.roles.join(", ")}</td>
                <td className="p-3">
                  <button
                    onClick={() => onSelect(user)}
                    className="text-blue-600 hover:underline"
                  >
                    Bekijk →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Vorige
          </button>
          <div className="flex gap-2 justify-center flex-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-md border text-sm ${
                  i + 1 === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Volgende
          </button>
        </div>
      )}
    </div>
  )
}
