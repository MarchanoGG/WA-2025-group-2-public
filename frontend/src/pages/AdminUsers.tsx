import { useState } from "react"
import { dummyUsers, User } from "../userAdmin"
import AdminUsersTable from "../components/AdminUsersTable"
import CreateUserForm from "../components/CreateUserForm"
import AdminUserPopup from "../components/AdminUserPopup"
import Toast from "../components/Toast"

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(dummyUsers)
  const [search, setSearch] = useState("")
  const [selectedRole, setSelectedRole] = useState<User["roles"][number] | "">("")
  const [page, setPage] = useState(1)
  const [toastMsg, setToastMsg] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const pageSize = 5

  const filtered = users.filter(
    (u) =>
      (u.firstName.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (selectedRole === "" || u.roles.includes(selectedRole))
  )

  const totalPages = Math.ceil(filtered.length / pageSize)
  const currentPageData = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleAdd = (newUser: Omit<User, "id"> & { password: string }) => {
    const newId = Math.max(...users.map((u) => u.id)) + 1
    const userToAdd: User = {
      id: newId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      initials: newUser.initials,
      roles: newUser.roles as User["roles"],
    }

    setUsers([...users, userToAdd])
    setToastMsg("Nieuwe gebruiker toegevoegd")
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold text-center mb-4">Gebruikers overzicht</h1>

      <div className="bg-white rounded-md p-4 shadow-sm">
        {/* filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
  <input
    placeholder="Zoeken op naam, email..."
    className="border rounded px-3 py-2 text-sm w-full md:w-60"
    value={search}
    onChange={(e) => {
      setSearch(e.target.value)
      setPage(1)
    }}
  />
  <select
    className="border rounded px-3 py-2 text-sm w-full md:w-60 md:ml-auto"
    value={selectedRole}
    onChange={(e) => {
      setSelectedRole(e.target.value as User["roles"][number])
      setPage(1)
    }}
  >
    <option value="">Alle rollen</option>
    {[...new Set(users.flatMap((u) => u.roles))].map((role) => (
      <option key={role} value={role}>
        {role}
      </option>
    ))}
  </select>
</div>


        {/* tabel + formulier */}
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1">
            <AdminUsersTable
              data={currentPageData}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              onSelect={(user) => setSelectedUser(user)} // FIX
            />
          </div>

          <CreateUserForm
            onAdd={(newUser) =>
              handleAdd({
                ...newUser,
                roles: newUser.roles as User["roles"],
              })
            }
              users={users}
          />
        </div>
      </div>

      {/* popup als gebruiker geselecteerd is */}
      {selectedUser && (
        <AdminUserPopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={(updatedUser) => {
            setUsers((prev) =>
              prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            )
            setToastMsg("Gebruiker bijgewerkt")
            setSelectedUser(null)
          }}
          onDelete={(id) => {
            setUsers((prev) => prev.filter((u) => u.id !== id))
            setToastMsg("Gebruiker verwijderd")
            setSelectedUser(null)
          }}
        />
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </div>
  )
}
