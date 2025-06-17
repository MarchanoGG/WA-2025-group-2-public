import { useState } from 'react'
import type { User, Role } from '../userAdmin'

type Props = {
	user: User
	onClose: () => void
	onUpdate: (u: User, newPwd?: string) => void
	onDelete: (id: number) => void
}

export default function AdminUserPopup({
	user,
	onClose,
	onUpdate,
	onDelete,
}: Props) {
	const [form, setForm] = useState<User>({ ...user })
	const [password, setPassword] = useState('')

	const handleChange = (field: keyof User, value: string) =>
		setForm(prev => ({ ...prev, [field]: value }))

	const toggleRole = (role: Role) =>
		setForm(prev => ({
			...prev,
			roles: prev.roles.includes(role)
				? prev.roles.filter(r => r !== role)
				: [...prev.roles, role],
		}))

	const handleSubmit = () => {
		onUpdate(form, password || undefined)
		onClose()
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="absolute inset-0 bg-black/60" onClick={onClose} />

			<div className="relative bg-white rounded-lg p-6 w-[90%] max-w-md shadow-md border">
				<h2 className="text-lg font-semibold mb-4">Gebruiker aanpassen</h2>

				<div className="space-y-3 text-sm">
					<input
						className="w-full border px-3 py-2 rounded"
						placeholder="Voornaam"
						value={form.firstName}
						onChange={e => handleChange('firstName', e.target.value)}
					/>
					<input
						className="w-full border px-3 py-2 rounded"
						placeholder="Achternaam"
						value={form.lastName}
						onChange={e => handleChange('lastName', e.target.value)}
					/>
					<input
						className="w-full border px-3 py-2 rounded"
						placeholder="Emailadres"
						value={form.email}
						onChange={e => handleChange('email', e.target.value)}
					/>
					<input
						className="w-full border px-3 py-2 rounded"
						placeholder="Initialen"
						value={form.initials}
						onChange={e => handleChange('initials', e.target.value)}
					/>

					<fieldset className="space-y-1">
						<legend className="text-sm font-medium mb-1">Rol(len)</legend>
						{['Mentor', 'Decaan', 'Admin'].map(r => (
							<label key={r} className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={form.roles.includes(r as Role)}
									onChange={() => toggleRole(r as Role)}
								/>
								<span>{r}</span>
							</label>
						))}
					</fieldset>

					<input
						type="password"
						className="w-full border px-3 py-2 rounded"
						placeholder="Nieuw wachtwoord (optioneel)"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>

				<div className="flex justify-between mt-6">
					<button
						onClick={onClose}
						className="border px-4 py-2 rounded text-sm text-gray-700"
					>
						Terug
					</button>

					<div className="flex gap-2">
						<button
							onClick={handleSubmit}
							className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
						>
							Opslaan
						</button>
						<button
							onClick={() => onDelete(form.id)}
							className="bg-red-500 text-white px-4 py-2 rounded text-sm"
						>
							Verwijderen
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
