// src/components/AppointmentPopup.tsx
import { format } from 'date-fns'
import type { Appointment } from '../types/interfaces'
import { useRejectAppointment } from '../hooks/useAppointments'

type Props = {
	item: Appointment
	onClose: () => void
}

export default function AppointmentPopup({ item, onClose }: Props) {
	const reject = useRejectAppointment(item.userId)

	// Eventueel kun je hier loading-state uit Redux halen,
	// maar voor eenvoud laat ik de knop disabled tijdens de call:
	const handleReject = async () => {
		try {
			await reject(item.id)
		} catch {
			// optioneel: toon een foutmelding
		} finally {
			onClose()
		}
	}

	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded shadow-md w-[400px]">
				<h2 className="text-lg font-semibold mb-2">Afspraak Details</h2>

				<div className="space-y-1 text-sm">
					<p><strong>ID:</strong> {item.id}</p>
					<p><strong>Naam:</strong> {item.studentName ?? '–'}</p>
					<p><strong>Telefoon:</strong> {item.phoneNumber ?? '–'}</p>
					<p><strong>Email:</strong> {item.email ?? '–'}</p>
					<p>
						<strong>Starttijd:</strong>{' '}
						{format(new Date(item.startTime), 'dd-MM-yyyy HH:mm')}
					</p>
					<p>
						<strong>Eindtijd:</strong>{' '}
						{format(new Date(item.endTime), 'HH:mm')}
					</p>
				</div>

				<div className="flex justify-end gap-2 mt-6">
					<button
						onClick={onClose}
						className="px-4 py-2 border rounded hover:bg-gray-50"
					>
						Terug
					</button>
					<button
						onClick={handleReject}
						className="px-4 py-2 border rounded bg-red-50 text-red-600 hover:bg-red-100"
					>
						Annuleren
					</button>
				</div>
			</div>
		</div>
	)
}
