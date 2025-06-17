import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { RootState } from '../store'

const routes = [
	{ label: 'Login (Ouder)', path: '/Parents/Login' },
	{ label: 'Appointment', path: '/Parents/Appointment' },
	{ label: 'Login (Werknemer)', path: '/Login' },
	{ label: 'Booking', path: '/Parents/Booking' },
	{ label: 'Confirm', path: '/Parents/Confirm' },
	{ label: 'Succes', path: '/Parents/Succes' },
	{ label: 'Overview (Werknemer)', path: '/Overview' },
	{ label: 'Availability (Werknemer)', path: '/Availability' },
	{ label: 'Admin Classes', path: '/Admin/Classes' },
	{ label: 'Admin Users', path: '/Admin/Users' },
	{ label: 'Admin Overview', path: '/Admin/Overview' },
	{ label: 'Admin Parent Codes', path: '/Admin/Parent-Codes' },
]

export default function DebugMenu() {
	const location = useLocation()
	const reduxState = useSelector((s: RootState) => s)
	const { login } = useAuth()

	const [visible, setVisible] = useState(false)
	const [expanded, setExpanded] = useState(false)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const loginAs = async (username: string, password: string) => {
		await login(username, password)
	}

	const handleMouseEnter = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		setExpanded(true)
	}

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => setExpanded(false), 400)
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === '=') setVisible(true)
		}
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === '=') {
				setExpanded(false)
				setVisible(false)
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [])

	if (!visible) return null

	return (
		<div
			className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out ${
				expanded ? 'w-80 h-auto' : 'w-16 h-16'
			} bg-black text-white rounded-lg shadow-lg text-sm overflow-hidden`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{expanded ? (
				<div className="p-4">
					<h2 className="text-lg font-bold mb-2">Debug Menu</h2>

					<div className="mb-2">
						<div className="text-gray-400">Locatie:</div>
						<div className="break-all">{location.pathname}</div>
					</div>

					<div className="mb-2">
						<div className="text-gray-400">Routes:</div>
						<ul className="list-disc list-inside space-y-1">
							{routes.map((r) => (
								<li key={r.path}>
									<Link to={r.path} className="text-blue-400 hover:underline">
										{r.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="mb-2">
						<div className="text-gray-400 mb-1">Snel inloggen als:</div>
						<div className="flex gap-2 flex-wrap">
							{['admin', 'mentor', 'dean'].map((role) => (
								<button
									key={role}
									className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
									onClick={() => loginAs(role, role)}
								>
									{role}
								</button>
							))}
						</div>
					</div>

					<div>
						<div className="text-gray-400">Redux State:</div>
						<pre className="text-xs overflow-auto max-h-40 bg-gray-900 p-2 rounded">
							{JSON.stringify(reduxState, null, 2)}
						</pre>
					</div>
				</div>
			) : (
				<div className="w-full h-full flex items-center justify-center">
					<span className="text-xs text-gray-300">DEBUG</span>
				</div>
			)}
		</div>
	)
}
