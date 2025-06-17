import { useEffect, useState } from 'react'
import {
	getClasses,
	createClass,
	updateClass,
	deleteClass,
	ClassWithUsers,
} from '../api/classes'
import AdminClassesTable from '../components/AdminClassesTable.tsx'
import CreateClassForm from '../components/CreateClassForm'
import ClassEditor from '../components/ClassEditor.tsx'
import Toast from '../components/Toast'

export default function AdminClasses() {
	const [classes, setClasses] = useState<ClassWithUsers[]>([])
	const [search, setSearch] = useState('')
	const [filterKlas, setFilterKlas] = useState('')
	const [page, setPage] = useState(1)
	const [selected, setSelected] = useState<ClassWithUsers | null>(null)
	const [toast, setToast] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const pageSize = 15

	useEffect(() => {
		; (async () => {
			try {
				const data = await getClasses()
				setClasses(data)
			} catch (err) {
				console.error(err)
				setError('Klassen konden niet geladen worden.')
			} finally {
				setLoading(false)
			}
		})()
	}, [])

	const filtered = classes
		.filter(c =>
			(c.className.toLowerCase().includes(search.toLowerCase()) ||
				c.users.some(u =>
					`${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
				)) &&
			(filterKlas === '' || c.className === filterKlas)
		)

	const totalPages = Math.ceil(filtered.length / pageSize)
	const currentPage = filtered.slice((page - 1) * pageSize, page * pageSize)

	const handleAdd = async (data: {
		className: string
		education: string
		users: number[]
	}) => {
		try {
			const created = await createClass(data)
			setClasses(prev => [created, ...prev])
			setToast('Klas toegevoegd')
		} catch {
			setToast('Toevoegen mislukt')
		}
	}

	const handleUpdate = async (data: {
		id: number
		className: string
		education: string
		users: number[]
	}) => {
		try {
			const updated = await updateClass(data)
			setClasses(prev =>
				prev.map(c => (c.id === updated.id ? updated : c))
			)
			setToast('Klas bijgewerkt')
		} catch {
			setToast('Bijwerken mislukt')
		}
	}

	const handleDelete = async (id: number) => {
		try {
			await deleteClass(id)
			setClasses(prev => prev.filter(c => c.id !== id))
			setToast('Klas verwijderd')
			window.location.reload()
		} catch {
			setToast('Verwijderen mislukt')
		}
	}

	return (
		<div className="max-w-6xl mx-auto px-6 py-8">
			<h1 className="text-xl font-semibold text-center mb-4">Klassen overzicht</h1>

			<div className="bg-white p-4 rounded-md shadow-sm">
				{/* filters */}
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<input
						placeholder="Zoeken op klas of naam..."
						className="border rounded px-3 py-2 text-sm w-full md:w-60"
						value={search}
						onChange={e => {
							setSearch(e.target.value)
							setPage(1)
						}}
					/>
					<select
						className="border rounded px-3 py-2 text-sm w-full md:w-60 md:ml-auto"
						value={filterKlas}
						onChange={e => {
							setFilterKlas(e.target.value)
							setPage(1)
						}}
					>
						<option value="">Alle klassen</option>
						{[...new Set(classes.map(c => c.className))].map(klas => (
							<option key={klas} value={klas}>
								{klas}
							</option>
						))}
					</select>
				</div>

				{loading ? (
					<p className="text-center text-sm text-gray-500">Laden…</p>
				) : error ? (
					<p className="text-center text-sm text-red-600">{error}</p>
				) : (
					<div className="flex flex-col md:flex-row gap-6">
						<div className="flex-1">
							<AdminClassesTable
								data={currentPage}
								page={page}
								totalPages={totalPages}
								setPage={setPage}
								onSelect={setSelected}
							/>
						</div>
						<CreateClassForm onAdd={handleAdd} />
					</div>
				)}
			</div>

			{selected && (
				<ClassEditor
					cls={selected}
					onClose={() => setSelected(null)}
					onUpdate={handleUpdate}
					onDelete={handleDelete}
				/>
			)}

			{toast && <Toast message={toast} onClose={() => setToast('')} />}
		</div>
	)
}
