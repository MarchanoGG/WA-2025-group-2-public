import { useState, useEffect } from "react"
import { getUsers } from '../api/users'
import type { User } from '../userAdmin'
import type { ClassWithUsers } from "../api/classes"

type Props = {
  cls: ClassWithUsers
  onClose: () => void
  onUpdate: (data: {
    id: number
    className: string
    education: string
    users: number[]
  }) => void
  onDelete: (id: number) => void
}

export default function ClassEditor({ cls, onClose, onUpdate, onDelete }: Props) {
  const [form, setForm] = useState({
    id: cls.id,
    className: cls.className,
    education: cls.education,
    users: cls.users.map(u => u.userId),
  })
  const [allUsers, setAllUsers] = useState<User[]>([])

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
    setForm(prev => ({
      ...prev,
      users: prev.users.includes(id)
        ? prev.users.filter(u => u !== id)
        : [...prev.users, id],
    }))
  }

  const handleSubmit = () => {
    onUpdate(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full shadow-md z-50">
        <h3 className="text-lg font-semibold mb-4">Klas bewerken</h3>
        <div className="space-y-3 text-sm">
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.className}
            onChange={e => setForm(f => ({ ...f, className: e.target.value }))}
          />
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.education}
            onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
          >
            <option value="">Onderwijs</option>
            <option value="VMBO">VMBO</option>
            <option value="Havo">Havo</option>
            <option value="VWO">VWO</option>
          </select>
          <fieldset className="space-y-1">
            <legend className="font-medium mb-1">Gebruikers</legend>
            <div className="max-h-32 overflow-auto border rounded p-2">
              {allUsers.map(u => (
                <label key={u.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.users.includes(u.id)}
                    onChange={() => toggleUser(u.id)}
                  />
                  <span>{u.firstName} {u.lastName} ({u.initials})</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Terug
          </button>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
              Opslaan
            </button>
            <button onClick={() => onDelete(cls.id)} className="bg-red-500 text-white px-4 py-2 rounded">
              Verwijderen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
