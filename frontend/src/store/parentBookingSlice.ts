import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ParentBookingState {
	studentNumber: string | null
	studentName: string | null
	parentName: string | null
	phoneNumber: string | null
	email: string | null
	level: '' | 'vmbo' | 'havo' | 'vwo' | null
	classId: string | null
	userId: number | null
	parentCode: string | null

	appointmentId: number | null
	startTime: string | null
	endTime: string | null
}

const initialState: ParentBookingState = {
	studentNumber: null,
	studentName: null,
	parentName: null,
	phoneNumber: null,
	email: null,
	level: null,
	classId: null,
	userId: null,
	parentCode: null,

	appointmentId: null,
	startTime: null,
	endTime: null,
}

export type Field = keyof ParentBookingState

const slice = createSlice({
	name: 'parentBooking',
	initialState,
	reducers: {
		setField: <K extends Field>(
			state: ParentBookingState,
			action: PayloadAction<{ field: K; value: ParentBookingState[K] }>
		) => {
			state[action.payload.field] = action.payload.value

			if (action.payload.field === 'level') {
				state.classId = null
				state.userId = null
			}
		},
		resetBooking: () => initialState,
	},
})

export const { setField, resetBooking } = slice.actions
export default slice.reducer