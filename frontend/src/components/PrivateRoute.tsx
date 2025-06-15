// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export default function PrivateRoute() {
    const isLoggedIn = !!useSelector((s: RootState) => s.auth.token)
    return isLoggedIn ? <Outlet /> : <Navigate to="/Login" replace />
}
