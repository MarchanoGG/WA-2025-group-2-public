import { api } from './client'

// Must be 1 on 1 copy of the backend types but with extra relationships
// This is to ensure that the frontend and backend are in sync regarding the data structure.

export interface ParentCode {
    id: number
    code: string
    used: boolean
    createdAt: string
    updatedAt: string
}

export async function getParentCodes(): Promise<ParentCode[]> {
    const { data } = await api.get('/api/parentCodes')
    return data
}

export async function createParentCodes(amount: number): Promise<ParentCode[]> {
    const { data: rawCodes }: { data: string[] } = await api.post('/api/parentCodes/generate', { amount: amount })

    const now = new Date().toISOString()
    return rawCodes.map((code, i) => ({
        id: Date.now() + i,
        code,
        used: false,
        createdAt: now,
        updatedAt: now,
    }))
}

export async function updateParentCode(id: number, payload: Partial<ParentCode>): Promise<ParentCode> {
    const { data } = await api.patch(`/api/parentCodes/${id}`, payload)
    return data
}

export async function deleteParentCode(id: number): Promise<void> {
	await api.delete(`/api/parentCodes/${id}`)
}

