// src/components/OverviewTable.tsx
import { format } from 'date-fns'
import type { Appointment } from '../types/interfaces'

type Props = {
	data: Appointment[]
	onSelect: (item: Appointment) => void
	page: number
	totalPages: number
	setPage: (value: number) => void
}

export default function OverviewTable({
	data,
	onSelect,
	page,
	totalPages,
	setPage,
}: Props) {
	return (
		<div>
		<div className="overflow-x-auto">
  			<table className="w-full min-w-[700px] text-sm table-auto border-collapse">
				<thead>
					<tr className="text-gray-500 text-left border-b border-gray-200">
						<th className="p-3">Name</th>
						<th className="p-3">Leerlingnummer</th>
						<th className="p-3">Tel. (ouders)</th>
						<th className="p-3">Email (ouders)</th>
						<th className="p-3">Dag en Tijd</th>
						<th className="p-3">Details</th>
					</tr>
				</thead>
				<tbody>
					{data.map((item) => (
						<tr
							key={item.id}
							className="border-b border-gray-100 hover:bg-gray-50"
						>
							<td className="p-3">{item.studentName}</td>
							<td className="p-3">{item.studentNumber}</td>
							<td className="p-3">{item.phoneNumber}</td>
							<td className="p-3 truncate max-w-[200px]">{item.email}</td>
							<td className="p-3">
								{format(new Date(item.startTime), 'd MMM')} –{' '}
								{format(new Date(item.endTime), 'HH:mm')}
							</td>
							<td className="p-3">
								<button
									className="text-blue-600 hover:underline"
									onClick={() => onSelect(item)}
								>
									Bekijk →
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			</div>

			{totalPages > 1 && (
				<div className="flex justify-between items-center mt-4">
					<button
						className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
						disabled={page === 1}
						onClick={() => setPage(page - 1)}
					>
						Vorige
					</button>
					<div className="flex gap-2 justify-center flex-1">
						{[...Array(totalPages)].map((_, i) => {
							const pageNum = i + 1
							return (
								<button
									key={pageNum}
									onClick={() => setPage(pageNum)}
									className={`px-3 py-1 rounded-md border text-sm ${pageNum === page
											? 'bg-blue-600 text-white'
											: 'bg-white text-gray-700 hover:bg-gray-100'
										}`}
								>
									{pageNum}
								</button>
							)
						})}
					</div>
					<button
						className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
						disabled={page === totalPages}
						onClick={() => setPage(page + 1)}
					>
						Volgende
					</button>
				</div>
			)}
		</div>
	)
}
