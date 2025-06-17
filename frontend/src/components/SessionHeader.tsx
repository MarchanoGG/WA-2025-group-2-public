import { useState } from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from '../hooks/useAuth'

export default function SessionHeader() {
	const { user, logout } = useAuth()
	const [menuOpen, setMenuOpen] = useState(false)

	if (!user) return null

	const primaryRole = user.roles[0]?.role.name ?? '–'
	const isAdmin = primaryRole === 'admin'
	const isNotAdmin = primaryRole === 'mentor' || primaryRole === 'dean'

	return (
		<header className="bg-white shadow-sm border-b border-blue-100">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
				<div className="flex items-center gap-3 flex-shrink-0">
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className="md:hidden text-sm text-blue-600 border border-blue-300 px-3 py-1 rounded hover:bg-blue-50"
					>
						☰ Menu
					</button>
					<button
						onClick={logout}
						className="hidden md:inline text-sm text-blue-600 border border-blue-300 px-3 py-1 rounded hover:bg-blue-50"
					>
						Afmelden
					</button>
				</div>

				{(isAdmin || isNotAdmin) && (
					<div className={`z-50 ${menuOpen
						? 'flex flex-col gap-4 bg-white shadow-md border rounded p-4 absolute top-16 left-4 right-4'
						: 'hidden'
					} md:flex md:flex-row md:gap-10 md:justify-center md:static md:bg-transparent md:shadow-none md:border-none md:p-0`}>

						{isAdmin && (
							<>
								<NavLink to="/admin/Overview" className={({ isActive }) => `px-4 py-2 rounded font-medium ${isActive ? 'bg-blue-600 text-white' : 'border border-blue-300 text-blue-600 hover:bg-blue-50'}`}>Afspraken</NavLink>
								<NavLink to="/admin/classes" className={({ isActive }) => `px-4 py-2 rounded font-medium ${isActive ? 'bg-blue-600 text-white' : 'border border-blue-300 text-blue-600 hover:bg-blue-50'}`}>Klassen</NavLink>
								<NavLink to="/admin/users" className={({ isActive }) => `px-4 py-2 rounded font-medium ${isActive ? 'bg-blue-600 text-white' : 'border border-blue-300 text-blue-600 hover:bg-blue-50'}`}>Gebruikers</NavLink>
								<NavLink to="/admin/parent-codes" className={({ isActive }) => `px-4 py-2 rounded font-medium ${isActive ? 'bg-blue-600 text-white' : 'border border-blue-300 text-blue-600 hover:bg-blue-50'}`}>Ouder Codes</NavLink>
							</>
						)}

						{isNotAdmin && (
							<>
								<NavLink to="/Overview" className={({ isActive }) => `px-4 py-2 rounded font-medium ${isActive ? 'bg-blue-600 text-white' : 'border border-blue-300 text-blue-600 hover:bg-blue-50'}`}>Afspraken</NavLink>
								<NavLink to="/Availability" className={({ isActive }) => `px-4 py-2 rounded font-medium ${isActive ? 'bg-blue-600 text-white' : 'border border-blue-300 text-blue-600 hover:bg-blue-50'}`}>Beschikbaarheid</NavLink>
							</>
						)}

						{menuOpen && (
							<button
								onClick={logout}
								className="text-sm text-red-600 border border-red-300 px-4 py-2 rounded hover:bg-red-50 mt-2 md:hidden"
							>
								Afmelden
							</button>
						)}
					</div>
				)}

				{/* Rechts: Gebruiker info */}
				<div className="flex items-center gap-3 flex-shrink-0">
					<div className="text-right text-sm">
						<div className="font-medium">{user.firstName} {user.lastName}</div>
						<div className="text-xs text-gray-500">{primaryRole}</div>
					</div>
					<div className="w-8 h-8 rounded-full text-xs bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
						{user.initials}
					</div>
				</div>
			</div>
		</header>
	)
}
