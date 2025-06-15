import { useState } from "react"
import { User } from "../userAdmin"

type Props = {
  onAdd: (newUser: {
    firstName: string
    lastName: string
    email: string
    initials: string
    roles: string[]
    password: string
  }) => void
  users: User[]
}

export default function CreateUserForm({ onAdd, users }: Props) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [initials, setInitials] = useState("")
  const [roles, setRoles] = useState<string[]>([])
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const toggleRole = (role: string) => {
    setRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    )
  }

  const reset = () => {
    setFirstName("")
    setLastName("")
    setEmail("")
    setInitials("")
    setRoles([])
    setPassword("")
    setError("")
  }

  const isValidName = (name: string) => /^[A-Za-zÀ-ÿ\s'-]+$/.test(name)
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPassword = (pwd: string) =>
    pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd)

  const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())

  const handleSubmit = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !initials ||
      roles.length === 0 ||
      !password
    ) {
      setError("Vul alle velden in.")
      return
    }

    if (!isValidName(firstName) || !isValidName(lastName)) {
      setError("Voornaam en achternaam mogen alleen letters bevatten.")
      return
    }

    if (!isValidEmail(email)) {
      setError("Voer een geldig e-mailadres in.")
      return
    }

    if (emailExists) {
      setError("Dit e-mailadres is al in gebruik.")
      return
    }

    if (!isValidPassword(password)) {
      setError("Wachtwoord moet minstens 8 tekens bevatten, met een hoofdletter en een cijfer.")
      return
    }

    onAdd({
      firstName,
      lastName,
      email,
      initials,
      roles,
      password,
    })

    reset()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border w-full md:max-w-sm mx-auto md:ml-auto md:mr-0">
      <h2 className="text-lg font-semibold mb-2">Nieuwe gebruiker aanmaken</h2>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <div className="space-y-3 text-sm">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Voornaam"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Achternaam"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Emailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Initialen"
          value={initials}
          onChange={(e) => setInitials(e.target.value)}
        />

        <fieldset className="space-y-1">
          <legend className="text-sm font-medium mb-1">Rollen</legend>
          {["Mentor", "Decaan", "Teamleider"].map((role) => (
            <label key={role} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={role}
                checked={roles.includes(role)}
                onChange={() => toggleRole(role)}
              />
              <span>{role}</span>
            </label>
          ))}
        </fieldset>

        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
