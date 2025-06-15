// src/hooks/useAppointments.ts
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import {
    fetchAppointments,
    clearAppointments,
    rejectAppointment,
} from '../store/appointmentsSlice'
import type { Appointment } from '../types/interfaces'

/**
 * Hook voor je Overview-pagina: haalt één keer bij mount alle afspraken op
 * en ruimt op bij unmount.
 */
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

/**
 * Hook voor popups of knoppen die alleen willen 'rejecten'.
 * Doet géén automatische fetch bij mount.
 * Na reject trigger je zelf reload indien gewenst.
 */
export function useRejectAppointment(
    userId: number
): (appointmentId: number) => Promise<void> {
    const dispatch = useDispatch<AppDispatch>()

    return async (appointmentId: number) => {
        await dispatch(rejectAppointment(appointmentId))
        // optioneel: herlaad alle afspraken na reject
        dispatch(fetchAppointments(userId))
    }
}
