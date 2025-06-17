import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

interface RoleRouteProps {
    allowedRoles: string[]
    redirectTo?: string
}

export default function RoleRoute({
    allowedRoles,
    redirectTo = '/Login',
}: RoleRouteProps) {
    const { token, user } = useSelector((s: RootState) => s.auth)
    if (!token || !user) return <Navigate to={redirectTo} replace />

    const hasRole = user.roles.some((r: { role: { name: string } }) => allowedRoles.includes(r.role.name))
    if (!hasRole) {
        // fallback: stuur admin naar worker-pagina, of andersom
        const fallback = allowedRoles.includes('admin') ? '/Overview' : '/admin/classes'
        return <Navigate to={fallback} replace />
    }

    return <Outlet />
}
