import { useState } from "react"
import usersDummy from "../classDummy"
import AdminTable from "../components/AdminTable"
import AdminPopup from "../components/AdminPopup"
import Toast from "../components/Toast"
import CreateClassForm from "../components/CreateClassForm"


type User = {
  id: number
  klas: string
  mentor: string
  decaan: string
  education?: string
}

export default function AdminClasses() {
  const [users, setUsers] = useState<User[]>(usersDummy)
  const [search, setSearch] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<User | null>(null)
  const [toastMsg, setToastMsg] = useState("")

  const filtered = users.filter(
    (u) =>
      (u.klas.toLowerCase().includes(search.toLowerCase()) ||
        u.mentor.toLowerCase().includes(search.toLowerCase()) ||
        u.decaan.toLowerCase().includes(search.toLowerCase())) &&
      (selectedClass === "" || u.klas === selectedClass)
  )

  const pageSize = 5
  const totalPages = Math.ceil(filtered.length / pageSize)
  const currentPageData = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleUpdate = (updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    setToastMsg("Klas is aangepast")
  }

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    setToastMsg("Klas is verwijderd")
  }

  return (
  <div className="max-w-6xl mx-auto px-6 py-8 relative">

      <h1 className="text-xl font-semibold text-center mb-4">Klassen overzicht</h1>
      
      <div className="bg-white rounded-md p-4 shadow-sm">
  {/* Filters bovenaan */}
  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">

  <input
    placeholder="Zoeken op klas, mentor, decaan..."
    className="border rounded px-3 py-2 text-sm w-full md:w-60"
    value={search}
    onChange={(e) => {
      setSearch(e.target.value)
      setPage(1)
    }}
  />

  <select
    className="border rounded px-3 py-2 text-sm w-full md:w-60"
    value={selectedClass}
    onChange={(e) => {
      setSelectedClass(e.target.value)
      setPage(1)
    }}
  >
    <option value="">Alle klassen</option>
    {[...new Set(users.map((u) => u.klas))].map((klas) => (
      <option key={klas} value={klas}>
        {klas}
      </option>
    ))}
  </select>
</div>


  {/* Tabel + Form naast elkaar */}
<div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 mt-6 md:mt-8">
    {/* Linkerzijde: tabel */}
    <div className="flex-1">
      <AdminTable
        data={currentPageData}
        onSelect={setSelected}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>

    {/* Rechterzijde: formulier */}
    <CreateClassForm
      onAdd={(newItem) => {
        const newId = Math.max(...users.map((u) => u.id)) + 1
        setUsers([...users, { id: newId, ...newItem }])
        setToastMsg("Nieuwe klas toegevoegd")
      }}
    />
  </div>

  {/* Popup */}
  {selected && (
    <AdminPopup
      user={selected}
      onClose={() => setSelected(null)}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
    />
  )}
</div>


     
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </div>
  )
}
