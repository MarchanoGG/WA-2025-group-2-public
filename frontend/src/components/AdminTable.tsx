type User = {
  id: number
  klas: string
  mentor: string
  decaan: string
  education?: string
}

type Props = {
  data: User[]
  page: number
  totalPages: number
  setPage: (page: number) => void
  onSelect: (user: User) => void
}

export default function AdminTable({
  data,
  page,
  totalPages,
  setPage,
  onSelect,
}: Props) {
  return (
    <div>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[500px] text-sm table-auto border-collapse">
        <thead>
          <tr className="text-gray-500 text-left border-b border-gray-200">
            <th className="p-3">Klas</th>
            <th className="p-3">Mentor</th>
            <th className="p-3">Decaan</th>
            <th className="p-3">Niveau</th>
            <th className="p-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="p-3">{user.klas}</td>
              <td className="p-3">{user.mentor}</td>
              <td className="p-3">{user.decaan}</td>
              <td className="p-3">{user.education || "-"}</td>
              <td className="p-3">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => onSelect(user)}
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
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    pageNum === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
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
