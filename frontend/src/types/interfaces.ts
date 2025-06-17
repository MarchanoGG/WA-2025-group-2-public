import { JSX } from "react"

export interface UserRole {
	role: {
		id: number
		name: string
	}
}

export interface User {
	id: number
	username: string
	initials: string
	firstName: string
	lastName: string
	roles: UserRole[]
	sessionToken: string
}

export interface LoginResponse {
	user: User
	token: string
}

export interface AuthState {
	user: User | null
	token: string | null
	status: 'idle' | 'loading' | 'failed'
	error: string | null
}

export interface Appointment {
	id: number
	studentNumber: string | null
	studentName: string | null
	parentName: string | null
	phoneNumber: string | null
	email: string | null
	startTime: string
	endTime: string
	isClaimed: boolean
	isRejected: boolean
	userId: number
	classId: number
	parentCodeId?: number | null
	createdAt: string
	updatedAt: string
}

export interface AppointmentState {
	data: Appointment[]
	status: 'idle' | 'loading' | 'failed'
	error: string | null
}

export interface RouteConfig {
	path: string
	element: JSX.Element
	roles?: string[]
}
