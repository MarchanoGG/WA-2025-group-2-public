import { useEffect, useState } from 'react'
import AdminUsersTable from '../components/AdminUsersTable'
import CreateUserForm from '../components/CreateUserForm'
import AdminUserPopup from '../components/AdminUserPopup'
import Toast from '../components/Toast'
import {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
} from '../api/users'
import type { User, Role } from '../userAdmin'
import { ROLE_LABELS } from '../components/CreateUserForm'

export default function AdminUsers() {
	const [users, setUsers] = useState<User[]>([])
	const [search, setSearch] = useState('')
	const [selectedRole, setSelectedRole] = useState<User['roles'][number] | ''>(
		'',
	)
	const [page, setPage] = useState(1)
	const [toast, setToast] = useState('')
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		; (async () => {
			try {
				const data = await getUsers()
				setUsers(data)
			} catch (err) {
				console.error(err)
				setError('Kon gebruikers niet laden.')
			} finally {
				setLoading(false)
			}
		})()
	}, [])

	const pageSize = 5
	const filtered = users.filter(
		u =>
			(`${u.firstName} ${u.lastName} ${u.email}`
				.toLowerCase()
				.includes(search.toLowerCase())) &&
			(selectedRole === '' || u.roles.includes(selectedRole)),
	)
	const totalPages = Math.ceil(filtered.length / pageSize)
	const currentPageData = filtered.slice((page - 1) * pageSize, page * pageSize)

	const handleAdd = async (u: {
		email: string
		password: string
		firstName: string
		lastName: string
		initials: string
		roles: number[]
	}) => {
		try {
			const roleNames: Role[] = u.roles
				.map(id => ROLE_LABELS.find(r => r.id === id)?.label as Role)
				.filter(Boolean)

			const newUser = await createUser({
				email: u.email,
				password: u.password,
				firstName: u.firstName,
				lastName: u.lastName,
				initials: u.initials,
				roles: roleNames,
			})

			setUsers(prev => [...prev, newUser])
			setToast('Nieuwe gebruiker toegevoegd')
		} catch (err) {
			console.error(err)
			setToast('Toevoegen mislukt')
		}
	}

	const handleUpdate = async (updated: User, pwd?: string) => {
		try {
			const saved = await updateUser({ ...updated, email: updated.email, password: pwd })
			setUsers(prev => prev.map(u => (u.id === saved.id ? saved : u)))
			setToast('Gebruiker bijgewerkt')
			window.location.reload()
		} catch (err) {
			console.error(err)
			setToast('Bijwerken mislukt')
			window.location.reload()
		}
	}

	const handleDelete = async (id: number) => {
		try {
			await deleteUser(id)
			setUsers(prev => prev.filter(u => u.id !== id))
			setToast('Gebruiker verwijderd')
			window.location.reload()
		} catch (err) {
			console.error(err)
			setToast('Verwijderen mislukt')
		}
	}

	return (
		<div className="max-w-6xl mx-auto px-6 py-8">
			<h1 className="text-xl font-semibold text-center mb-4">
				Gebruikers overzicht
			</h1>

			<div className="bg-white rounded-md p-4 shadow-sm">
				{/* filters */}
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<input
						placeholder="Zoeken op naam / email…"
						className="border rounded px-3 py-2 text-sm w-full md:w-60"
						value={search}
						onChange={e => {
							setSearch(e.target.value)
							setPage(1)
						}}
					/>

					<select
						className="border rounded px-3 py-2 text-sm w-full md:w-60 md:ml-auto"
						value={selectedRole}
						onChange={e => {
							setSelectedRole(e.target.value as User['roles'][number])
							setPage(1)
						}}
					>
						<option value="">Alle rollen</option>
						{[...new Set(users.flatMap(u => u.roles))].map(role => (
							<option key={role} value={role}>
								{role}
							</option>
						))}
					</select>
				</div>

				{loading ? (
					<p className="text-center text-sm text-gray-500">Laden…</p>
				) : error ? (
					<p className="text-center text-sm text-red-600">{error}</p>
				) : (
					<div className="flex flex-col md:flex-row gap-10">
						<div className="flex-1">
							<AdminUsersTable
								data={currentPageData}
								page={page}
								totalPages={totalPages}
								setPage={setPage}
								onSelect={u => setSelectedUser(u)}
							/>
						</div>

						<CreateUserForm users={users} onAdd={handleAdd} />
					</div>
				)}
			</div>

			{selectedUser && (
				<AdminUserPopup
					user={selectedUser}
					onClose={() => setSelectedUser(null)}
					onUpdate={(u, pwd) => handleUpdate(u, pwd)}
					onDelete={id => handleDelete(id)}
				/>
			)}

			{toast && <Toast message={toast} onClose={() => setToast('')} />}
		</div>
	)
}
