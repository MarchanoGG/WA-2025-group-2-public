import { api } from './client'
import type { User, Role } from '../userAdmin'

// Must be 1 on 1 copy of the backend types but with extra relationships
// This is to ensure that the frontend and backend are in sync regarding the data structure.

interface RawRole {
    roleId: number
    role: { id: number; name: 'admin' | 'mentor' | 'dean' | 'teamleader' }
}
interface RawUser {
    id: number
    username: string
    initials: string
    firstName: string
    lastName: string
    createdAt: string
    updatedAt: string
    roles: RawRole[]
}

const rawToUi = (u: RawUser): User => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.username, 
    initials: u.initials,
    roles: u.roles.map<Role>(r => {
        switch (r.role.name) {
            case 'mentor': return 'Mentor'
            case 'dean': return 'Decaan'
            default: return 'Admin'
        }
    }),
})

const roleNameToId = (role: Role) =>
    ({ Mentor: 3, Decaan: 2, Admin: 1 }[role])


export async function getUsers(): Promise<User[]> {
    const { data } = await api.get<RawUser[]>('/api/users')
    return data.map(rawToUi)
}

export async function createUser(payload: {
    email: string
    password: string
    firstName: string
    lastName: string
    initials: string
    roles: Role[]
}): Promise<User> {
    const body = {
        username: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        initials: payload.initials,
        roles: payload.roles.map(roleNameToId),
    }
    const { data } = await api.post<RawUser>('/api/users', body)
    return rawToUi(data)
}

export async function updateUser(payload: {
    id: number
    email: string
    password?: string
    firstName: string
    lastName: string
    initials: string
    roles: Role[]
}): Promise<User> {
    const body = {
        id: payload.id,
        username: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        initials: payload.initials,
        roles: payload.roles.map(roleNameToId),
    }
    const { data } = await api.post<RawUser>('/api/users', body)
    return rawToUi(data)
}

export async function deleteUser(id: number): Promise<void> {
    await api.delete(`/api/users/${id}`)
}
