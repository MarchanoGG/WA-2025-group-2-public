// src/api/client.ts
import axios from 'axios'
import type { Store } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
})

let reduxStore: Store<RootState> | null = null
export const injectStore = (store: Store<RootState>) => {
	reduxStore = store
}

api.interceptors.request.use((config) => {
	const token = reduxStore?.getState().auth.token
	if (token) {
		config.headers = config.headers || {}
			; (config.headers as Record<string, string>).Authorization = `Bearer ${token}`
	}
	return config
})
