import { Outlet } from 'react-router-dom'
import DebugMenu from '../components/DebugMenu'

export default function DefaultLayout() {
    return (
        <div>
            <DebugMenu />
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    )
}