
import { useState } from "react"

type Props = {
  onAdd: (newClass: {
    klas: string
    mentor: string
    decaan: string
    education: string
  }) => void
}

export default function CreateClassForm({ onAdd }: Props) {
  const [klas, setKlas] = useState("")
  const [mentor, setMentor] = useState("")
  const [decaan, setDecaan] = useState("")
  const [education, setEducation] = useState("")

  const reset = () => {
    setKlas("")
    setMentor("")
    setDecaan("")
    setEducation("")
  }

  const handleSubmit = () => {
    if (!klas || !mentor || !decaan || !education) return
    onAdd({ klas, mentor, decaan, education })
    reset()
  }

  return (
   <div className="bg-white p-6 rounded-lg shadow border w-full md:max-w-sm mx-auto md:ml-auto">


      <h2 className="text-md font-semibold mb-1">Nieuwe klas aanmaken</h2>
      <p className="text-sm text-gray-500 mb-4">
        Nieuwe klassen worden direct gekoppeld aan de bijbehorende werknemer
      </p>

      <div className="space-y-3 text-sm">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Klasnaam"
          value={klas}
          onChange={(e) => setKlas(e.target.value)}
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={mentor}
          onChange={(e) => setMentor(e.target.value)}
        >
          <option value="">Selecteer Mentor</option>
          <option value="Marciano">Marciano</option>
          <option value="Jaap">Jaap</option>
          <option value="Irshad">Irshad</option>
        </select>

        <select
          className="w-full border px-3 py-2 rounded"
          value={decaan}
          onChange={(e) => setDecaan(e.target.value)}
        >
          <option value="">Selecteer Decaan</option>
          <option value="Henk Piet">Henk Piet</option>
          <option value="Frans Jaap">Frans Jaap</option>
        </select>

        <select
          className="w-full border px-3 py-2 rounded"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        >
          <option value="">Onderwijssoort</option>
          <option value="VMBO">VMBO</option>
          <option value="Havo">Havo</option>
          <option value="VWO">VWO</option>
        </select>

        <div className="flex justify-between pt-2">
          <button
            onClick={reset}
            className="border px-4 py-2 rounded text-sm text-gray-700"
          >
            Reset
          </button>
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
