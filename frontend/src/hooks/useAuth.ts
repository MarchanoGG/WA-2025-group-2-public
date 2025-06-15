// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState, AppDispatch } from '../store'
import { login, logout } from '../store/authSlice'
import type { User, AuthState } from '../types/interfaces'

export interface UseAuthReturn {
    user: User | null
    token: string | null
    status: AuthState['status']
    error: string | null
    login(u: string, p: string): Promise<void>
    logout(): void
}

export const useAuth = (): UseAuthReturn => {
    const { user, token, status, error } = useSelector((s: RootState) => s.auth)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    return {
        user,
        token,
        status,
        error,
        login: async (u, p) => {
            const result = await dispatch(login({ username: u, password: p }))
            if (login.fulfilled.match(result)) {
                const roles = result.payload.user.roles.map(r => r.role.name)
                if (roles.includes('admin')) navigate('/admin/classes', { replace: true })
                else navigate('/Overview', { replace: true })
            }
        },
        logout: () => {
            dispatch(logout())
            navigate('/Login', { replace: true })
        },
    }
}
