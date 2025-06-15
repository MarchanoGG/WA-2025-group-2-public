import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import {
    fetchAppointments,
    upsertAvailability,
} from '../store/appointmentsSlice'
import type { Appointment } from '../types/interfaces'
import {
    addMinutes,
    startOfDay,
    endOfDay,
    formatISO,
} from 'date-fns'

export interface UseAvailabilityReturn {
    loading: boolean
    error: string | null
    openSlots: Appointment[]
    bookedSlots: Appointment[]
    selectedSlots: Date[]
    setSelectedSlots: React.Dispatch<React.SetStateAction<Date[]>>
    toggleSlot(slot: Date): void
    save(day: Date, classId: number): Promise<void>
}

const toLocalIso = (d: Date) =>
    formatISO(d, { representation: 'complete', format: 'extended' }).replace(/Z$/, '')

export function useAvailability(
    userId: number,
    slotDuration: number,
): UseAvailabilityReturn {
    const { data, status, error } = useSelector(
        (state: RootState) => state.appointments,
    )
    const dispatch = useDispatch<AppDispatch>()

    const [selectedSlots, setSelectedSlots] = useState<Date[]>([])

    /* één fetch bij mount */
    useEffect(() => {
        dispatch(fetchAppointments(userId))
    }, [dispatch, userId])

    /* open = niet geclaimd & niet gereject */
    const openSlots = useMemo(
        () => data.filter((a: Appointment) => !a.isRejected && !a.isClaimed),
        [data],
    )

    const bookedSlots = useMemo(
        () => data.filter((a: Appointment) => a.isClaimed),
        [data],
    )

    const toggleSlot = (slot: Date) => {
        setSelectedSlots((prev) => {
            const exists = prev.some((s) => s.getTime() === slot.getTime())
            return exists
                ? prev.filter((s) => s.getTime() !== slot.getTime())
                : [...prev, slot]
        })
    }

    /* ---------------- SAVE ---------------- */
    async function save(day: Date, classId: number) {
        const dayStart = startOfDay(day).getTime()
        const dayEnd = endOfDay(day).getTime()

        /* 1. Open slots van ALLE andere dagen gewoon meenemen */
        const otherDays = openSlots.filter((a: { startTime: string | number | Date }) => {
            const t = new Date(a.startTime).getTime()
            return t < dayStart || t > dayEnd
        })

        /* 2. Binnen huidige dag… */
        const existingToday = openSlots.filter((a: { startTime: string | number | Date }) => {
            const t = new Date(a.startTime).getTime()
            return t >= dayStart && t <= dayEnd
        })

        /* 2a  geselecteerde slots behouden/aanmaken  */
        const currentDayPayload: Partial<Appointment>[] = selectedSlots.map((slot) => {
            const end = addMinutes(slot, slotDuration)
            const found = existingToday.find(
                (a: { startTime: string | number | Date }) => new Date(a.startTime).getTime() === slot.getTime(),
            )
            return found
                ? { id: found.id, startTime: found.startTime, endTime: found.endTime }
                : { startTime: toLocalIso(slot), endTime: toLocalIso(end) }
        })

        /* 2b  slots die niet meer geselecteerd zijn NIET meesturen → backend verwijdert ze */

        /* 3. Combineer payload: andere dagen + (nieuwe/bestaande) huidige dag */
        const fullPayload: Partial<Appointment>[] = [
            ...otherDays.map((a: { id: any; startTime: any; endTime: any }) => ({
                id: a.id,
                startTime: a.startTime,
                endTime: a.endTime,
            })),
            ...currentDayPayload,
        ]

        await dispatch(
            upsertAvailability({ userId, appointments: fullPayload }),
        )
    }

    return {
        loading: status === 'loading',
        error,
        openSlots,
        bookedSlots,
        selectedSlots,
        setSelectedSlots,
        toggleSlot,
        save,
    }
}
