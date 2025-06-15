import { useEffect, useState, useMemo } from 'react'
import {
	format,
	setHours,
	setMinutes,
	setSeconds,
	setMilliseconds,
	addMinutes,
	isBefore,
	startOfDay,
	endOfDay,
	isSameDay,
} from 'date-fns'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { useAuth } from '../hooks/useAuth'
import { useAvailability } from '../hooks/useAvailability'

/* helper: seconds & ms = 0  */
const roundToMinute = (d: Date) =>
	setMilliseconds(setSeconds(new Date(d), 0), 0)

export default function AvailabilityPage() {
	const { user } = useAuth()
	const userId = user?.id!

	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [slotDuration, setSlotDuration] = useState<number>(15)
	const [classId] = useState<number>(1)

	const {
		loading,
		error,
		openSlots,
		bookedSlots,
		toggleSlot,
		selectedSlots,
		setSelectedSlots,
		save,
	} = useAvailability(userId, slotDuration)

	/* === Highlight-dagen berekenen === */
	const highlightedDays = useMemo<Date[]>(() => {
		const uniqueDates: Date[] = []

			;[...openSlots, ...bookedSlots].forEach(({ startTime }) => {
				const d = startOfDay(new Date(startTime))
				if (!uniqueDates.some((u) => isSameDay(u, d))) {
					uniqueDates.push(d)
				}
			})
		return uniqueDates
	}, [openSlots, bookedSlots])

	/* alle tijdsloten (17:00–22:00) */
	const timeSlots = useMemo<Date[]>(() => {
		const slots: Date[] = []
		let start = roundToMinute(setHours(setMinutes(selectedDate, 0), 17))
		const end = roundToMinute(setHours(setMinutes(selectedDate, 0), 22))
		while (isBefore(start, end)) {
			slots.push(new Date(start))
			start = addMinutes(start, slotDuration)
		}
		return slots
	}, [selectedDate, slotDuration])

	/* preselecteer bestaande open slots voor de huidige dag */
	useEffect(() => {
		const dayStart = startOfDay(selectedDate).getTime()
		const dayEnd = endOfDay(selectedDate).getTime()

		const preselect = openSlots
			.filter(({ startTime }) => {
				const t = new Date(startTime).getTime()
				return t >= dayStart && t <= dayEnd
			})
			.map(({ startTime }) => roundToMinute(new Date(startTime)))

		setSelectedSlots((prev) => {
			const sameLen = prev.length === preselect.length
			const same =
				sameLen &&
				prev.every((p) =>
					preselect.some((n) => n.getTime() === p.getTime()),
				)
			return same ? prev : preselect
		})
	}, [openSlots, selectedDate, setSelectedSlots])

	const isSelected = (slot: Date) =>
		selectedSlots.some((s) => s.getTime() === slot.getTime())

	const isBooked = (slot: Date) =>
		bookedSlots.some(
			({ startTime }) =>
				roundToMinute(new Date(startTime)).getTime() === slot.getTime(),
		)

	const isExistingOpen = (slot: Date) =>
		openSlots.some(
			({ startTime }) =>
				roundToMinute(new Date(startTime)).getTime() === slot.getTime(),
		)

	const handleConfirm = async () => {
		await save(selectedDate, classId)
	}

	/* ---------- UI ---------- */
	return (
		<div className="min-h-screen bg-slate-50 py-10 px-4">
			<div className="max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-sm">
				<h1 className="text-xl font-semibold text-center mb-6">
					Beschikbaarheid
				</h1>

				<div className="flex gap-10 justify-center">
					{/* Links: datum + slotlengte */}
					<div>
						<h2 className="text-lg font-semibold mb-2">Datum</h2>
						<DatePicker
							selected={selectedDate}
							onChange={(date) => setSelectedDate(date as Date)}
							dateFormat="dd MMMM yyyy"
							className="border px-3 py-2 text-sm w-full mb-4"
							highlightDates={[
								{
									'react-datepicker__day--has-availability': highlightedDays,
								},
							]}
						/>

						<label className="block text-sm mb-1">
							Lengte tijdsblok voor {format(selectedDate, 'd MMM')}
						</label>
						<select
							value={slotDuration}
							onChange={(e) => setSlotDuration(Number(e.target.value))}
							className="border px-3 py-2 text-sm w-full"
						>
							<option value={15}>15 minuten</option>
							<option value={30}>30 minuten</option>
						</select>
					</div>

					{/* Rechts: tijdsloten */}
					<div>
						<h2 className="text-lg font-semibold mb-2 text-center">Tijd</h2>
						{loading && <p className="text-center">Laden…</p>}
						{error && <p className="text-center text-red-600">{error}</p>}

						<div className="grid grid-cols-4 gap-3">
							{timeSlots.map((slot, idx) => {
								const selected = isSelected(slot)
								const booked = isBooked(slot)
								const existing = isExistingOpen(slot)

								const base =
									'border text-sm rounded-md px-3 py-2 transition cursor-pointer'

								if (booked) {
									return (
										<span
											key={idx}
											className={`${base} bg-red-200 text-red-700 border-red-300 cursor-not-allowed`}
											title="Al geboekt door ouder"
										>
											{format(slot, 'HH:mm')}
										</span>
									)
								}

								return (
									<button
										key={idx}
										onClick={() => toggleSlot(slot)}
										className={`${base} ${selected
												? 'bg-blue-600 text-white border-blue-600'
												: existing
													? 'bg-gray-300 text-gray-800 border-gray-900 hover:bg-gray-300'
													: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
											}`}
									>
										{format(slot, 'HH:mm')}
									</button>
								)
							})}
						</div>
					</div>
				</div>

				<div className="text-center mt-6">
					<button
						onClick={handleConfirm}
						disabled={loading}
						className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
					>
						Bevestigen
					</button>
				</div>
			</div>
		</div>
	)
}
