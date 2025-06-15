import { useAuth } from '../hooks/useAuth'

export default function Header() {
	const { user, logout } = useAuth()

	return (
		<header className="bg-white shadow-sm border-b border-blue-100">
			<div className="container mx-auto px-4 py-3 flex justify-between items-center">
				<button
					onClick={() => logout()}
					className="text-sm text-blue-600 border border-blue-300 px-3 py-1 rounded hover:bg-blue-50">
					Afmelden
				</button>

				{user && (
					<div className="flex items-center gap-2 text-sm">
						<span>
							{user.firstName} {user.lastName}
						</span>
						<span className="px-2 py-1 border rounded text-xs font-semibold">
							{user.initials}
						</span>
					</div>
				)}
			</div>
		</header>
	)
}
