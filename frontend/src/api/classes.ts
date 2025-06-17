import { api } from './client'

// Must be 1 on 1 copy of the backend types but with extra relationships
// This is to ensure that the frontend and backend are in sync regarding the data structure.

interface RawClassUser {
    userId: number
    classId: number
    user: {
        id: number
        firstName: string
        lastName: string
        initials: string
    }
}

interface RawClass {
    id: number
    className: string
    education: string
    createdAt: string
    updatedAt: string
    users: RawClassUser[]
}

/** UI-vriendelijke types */
export interface ClassUser {
    userId: number
    classId: number
    firstName: string
    lastName: string
    initials: string
}

export interface ClassWithUsers {
    id: number
    className: string
    education: string
    createdAt: string
    updatedAt: string
    users: ClassUser[]
}

function mapRaw(u: RawClass): ClassWithUsers {
    return {
        id: u.id,
        className: u.className,
        education: u.education,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        users: u.users.map(cu => ({
            userId: cu.userId,
            classId: cu.classId,
            firstName: cu.user.firstName,
            lastName: cu.user.lastName,
            initials: cu.user.initials,
        })),
    }
}

export async function getClasses(): Promise<ClassWithUsers[]> {
    const { data } = await api.get<RawClass[]>('/api/classes')
    return data.map(mapRaw)
}

export async function createClass(payload: {
    className: string
    education: string
    users: number[]
}): Promise<ClassWithUsers> {
    const { data } = await api.post<RawClass>('/api/classes', payload)
    return mapRaw(data)
}

export async function updateClass(payload: {
    id: number
    className: string
    education: string
    users: number[]
}): Promise<ClassWithUsers> {
    const { data } = await api.post<RawClass>('/api/classes', payload)
    return mapRaw(data)
}

export async function deleteClass(id: number): Promise<void> {
    await api.delete(`/api/classes/${id}`)
}
