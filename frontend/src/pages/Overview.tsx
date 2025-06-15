// src/pages/Overview.tsx
import { useState } from 'react'
import OverviewTable from '../components/OverviewTable'
import OverviewSearch from '../components/OverviewSearch'
import AppointmentPopup from '../components/OverviewPopup'
import { useAuth } from '../hooks/useAuth'
import { useAppointments } from '../hooks/useAppointments'
import type { Appointment } from '../types/interfaces'

export default function Overview() {
	const { user } = useAuth()
	const userId = user?.id!
	const { data, status, error } = useAppointments(userId)

	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const [selected, setSelected] = useState<Appointment | null>(null)

	if (status === 'loading') return <p className="text-center">Laden…</p>
	if (status === 'failed') return <p className="text-center text-red-600">{error}</p>

	const filtered = data.filter((a: { studentName: string }) =>
		a.studentName?.toLowerCase().includes(search.toLowerCase()),
	)
	const pageSize = 10
	const totalPages = Math.ceil(filtered.length / pageSize)
	const currentPageData = filtered.slice((page - 1) * pageSize, page * pageSize)

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-xl font-semibold text-center mb-4">
				Overzicht Afspraken
			</h1>
			<div className="bg-white rounded-md p-4 shadow-sm">
				<OverviewSearch value={search} onChange={setSearch} />
				<OverviewTable
					data={currentPageData}
					onSelect={setSelected}
					page={page}
					totalPages={totalPages}
					setPage={setPage}
				/>
			</div>

			{selected && (
				<AppointmentPopup item={selected} onClose={() => setSelected(null)} />
			)}
		</div>
	)
}
