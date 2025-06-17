import { useState, useEffect } from "react"
import { getUsers } from '../api/users'
import type { User } from '../userAdmin'

type Props = {
  onAdd: (data: {
    className: string
    education: string
    users: number[]
  }) => void
}

export default function CreateClassForm({ onAdd }: Props) {
  const [className, setClassName] = useState("")
  const [education, setEducation] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const users = await getUsers()
        setAllUsers(users)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  const toggleUser = (id: number) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    if (!className || !education) {
      setError("Vul klasnaam en onderwijs in.")
      return
    }
    onAdd({ className, education, users: selectedUsers })
    setClassName("")
    setEducation("")
    setSelectedUsers([])
    setError("")
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border w-full md:max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-2">Nieuwe klas aanmaken</h2>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <div className="space-y-3">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Klasnaam"
          value={className}
          onChange={e => setClassName(e.target.value)}
        />
        <select
          className="w-full border px-3 py-2 rounded"
          value={education}
          onChange={e => setEducation(e.target.value)}
        >
          <option value="">Onderwijssoort</option>
          <option value="VMBO">VMBO</option>
          <option value="Havo">Havo</option>
          <option value="VWO">VWO</option>
        </select>
        <fieldset className="space-y-1">
          <legend className="text-sm font-medium mb-1">Selecteer gebruikers</legend>
          <div className="max-h-32 overflow-auto border rounded p-2">
            {allUsers.map(u => (
              <label key={u.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(u.id)}
                  onChange={() => toggleUser(u.id)}
                />
                <span>{u.firstName} {u.lastName} ({u.initials})</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Toevoegen
          </button>
        </div>
      </div>
    </div>
  )
}
