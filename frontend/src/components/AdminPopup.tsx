import { useState } from "react"

type User = {
  id: number
  klas: string
  mentor: string
  decaan: string
  education?: string
}

type Props = {
  user: User
  onClose: () => void
  onDelete: (id: number) => void
  onUpdate: (updated: User) => void
}

export default function AdminPopup({ user, onClose, onDelete, onUpdate }: Props) {
  const [form, setForm] = useState<User>({ ...user })

  const handleChange = (field: keyof User, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = () => {
    onUpdate(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60 z-40" />

      <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-md border z-50">
        <h2 className="text-lg font-semibold mb-4">Klas aanpassen</h2>

        <div className="space-y-3 text-sm">
          <input
            placeholder="Klasnaam"
            className="w-full border rounded px-3 py-2"
            value={form.klas}
            onChange={(e) => handleChange("klas", e.target.value)}
          />
          <input
            placeholder="Mentor"
            className="w-full border rounded px-3 py-2"
            value={form.mentor}
            onChange={(e) => handleChange("mentor", e.target.value)}
          />
          <input
            placeholder="Decaan"
            className="w-full border rounded px-3 py-2"
            value={form.decaan}
            onChange={(e) => handleChange("decaan", e.target.value)}
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={form.education || ""}
            onChange={(e) => handleChange("education", e.target.value)}
          >
            <option value="">Kies onderwijs</option>
            <option value="VMBO">VMBO</option>
            <option value="Havo">Havo</option>
            <option value="VWO">VWO</option>
            <option value="Praktijk">Praktijkonderwijs</option>
          </select>
        </div>

        <div className="flex justify-between items-center gap-2 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded text-sm">
            Terug
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Opslaan
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  )
}
