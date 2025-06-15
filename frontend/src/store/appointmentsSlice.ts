import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../api/client'
import type { Appointment, AppointmentState } from '../types/interfaces'

const initialState: AppointmentState = {
	data: [],
	status: 'idle',
	error: null,
}

export const fetchAppointments = createAsyncThunk<
	Appointment[],
	number,
	{ rejectValue: string }
>('appointments/fetch', async (userId, { rejectWithValue }) => {
	try {
		const res = await api.get<Appointment[]>(`/api/appointments/${userId}`)
		return res.data
	} catch (err: any) {
		return rejectWithValue(err.response?.data?.message ?? 'Kon afspraken niet laden')
	}
})

export const rejectAppointment = createAsyncThunk<
	Appointment,
	number,
	{ rejectValue: string }
>('appointments/reject', async (appointmentId, { rejectWithValue }) => {
	try {
		const res = await api.post<Appointment>(`/api/appointments/${appointmentId}/reject`)
		return res.data
	} catch (err: any) {
		return rejectWithValue(err.response?.data?.message ?? 'Kon afspraak niet annuleren')
	}
})

export const upsertAvailability = createAsyncThunk<
	Appointment[],                                 // backend geeft de nieuwe lijst terug
	{ userId: number; appointments: Partial<Appointment>[] },
	{ rejectValue: string }
>('appointments/upsertAvailability', async (body, { rejectWithValue }) => {
	try {
		const res = await api.post<Appointment[]>(
			`/api/appointments/${body.userId}`,
			{ appointments: body.appointments },
		)
		return res.data
	} catch (err: any) {
		return rejectWithValue(err.response?.data?.message ?? 'Opslaan mislukt')
	}
})

const appointmentsSlice = createSlice({
	name: 'appointments',
	initialState,
	reducers: {
		clearAppointments(state) {
			state.data = []
			state.status = 'idle'
			state.error = null
		},
	},
	extraReducers: (b) => {
		// fetch
		b.addCase(fetchAppointments.pending, (s) => {
			s.status = 'loading'; s.error = null
		})
			.addCase(fetchAppointments.fulfilled, (s, { payload }) => {
				s.status = 'idle'; s.data = payload
			})
			.addCase(fetchAppointments.rejected, (s, { payload }) => {
				s.status = 'failed'; s.error = payload ?? 'Onbekende fout'
			})

		// reject
		b.addCase(rejectAppointment.fulfilled, (s, { payload }) => {
			s.data = s.data.map(a => (a.id === payload.id ? payload : a))
		})

		// upsert availability
		b.addCase(upsertAvailability.pending, (s) => {
			s.status = 'loading'
		})
			.addCase(upsertAvailability.fulfilled, (s, { payload }) => {
				s.status = 'idle'; s.data = payload
			})
			.addCase(upsertAvailability.rejected, (s, { payload }) => {
				s.status = 'failed'; s.error = payload ?? 'Onbekende fout'
			})
	},
})

export const { clearAppointments } = appointmentsSlice.actions
export default appointmentsSlice.reducer
