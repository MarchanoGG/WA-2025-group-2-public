import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../api/client'
import type { AuthState, LoginResponse, User } from '../types/interfaces'

const initialState: AuthState = {
	user: null,
	token: null,
	status: 'idle',
	error: null,
}

export const login = createAsyncThunk<
	LoginResponse,
	{ username: string; password: string },
	{ rejectValue: string }
>('auth/login', async ({ username, password }, { rejectWithValue }) => {
	try {
		const res = await api.post('/auth/login', { username, password })
		const { user: rawUser, sessionToken } = res.data
		const user: User = { ...rawUser, sessionToken }
		return { user, token: sessionToken }
	} catch (err: any) {
		return rejectWithValue(err?.response?.data?.message ?? 'Inloggen mislukt')
	}
})

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout(state) {
			state.user = null
			state.token = null
			state.error = null
			state.status = 'idle'
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = 'loading'; state.error = null
			})
			.addCase(login.fulfilled, (state, { payload }) => {
				state.status = 'idle'
				state.user = payload.user
				state.token = payload.token
			})
			.addCase(login.rejected, (state, { payload }) => {
				state.status = 'failed'
				state.error = payload ?? 'Onbekende fout'
			})
	},
})

export const { logout } = authSlice.actions
export default authSlice.reducer
