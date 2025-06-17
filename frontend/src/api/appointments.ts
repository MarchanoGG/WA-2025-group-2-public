import { api } from './client';

export interface Appointment {
    id: number;
    studentNumber: string | null;
    studentName: string | null;
    parentName: string | null;
    phoneNumber: string | null;
    email: string | null;
    startTime: string;
    endTime: string;
    isClaimed: boolean;
    isRejected: boolean;
    userId: number;
    classId: number;
    parentCodeId: number | null;
    createdAt: string;
    updatedAt: string;
}

export async function getAppointments(): Promise<Appointment[]> {
    const { data } = await api.get<Appointment[]>('/api/appointments');
    return data;
}

export async function deleteAppointment(id: number): Promise<void> {
    await api.delete(`/api/appointments/${id}`);
}
