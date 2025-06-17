import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import {
    fetchAppointments,
    clearAppointments,
    rejectAppointment,
} from '../store/appointmentsSlice'
import type { Appointment } from '../types/interfaces'


export function useAppointments(userId: number) {
    const { data, status, error } = useSelector((s: RootState) => s.appointments)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchAppointments(userId))
        return () => {
            dispatch(clearAppointments())
        }
    }, [dispatch, userId])

    return { data, status, error }
}

export function useRejectAppointment(
    userId: number
): (appointmentId: number) => Promise<void> {
    const dispatch = useDispatch<AppDispatch>()

    return async (appointmentId: number) => {
        await dispatch(rejectAppointment(appointmentId))
        dispatch(fetchAppointments(userId))
    }
}
