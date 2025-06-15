import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'
import TextInput from '../components/TextInput'

export default function Login() {
	const { login, status, error } = useAuth()
	const [username, setUsername] = useState('admin')
	const [password, setPassword] = useState('admin')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		login(username, password)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<TextInput
				placeholder="E-mail"
				type="text"
				name="email"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>

			<TextInput
				placeholder="Wachtwoord"
				type="password"
				name="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			{error && <p className="text-red-600 text-sm">{error}</p>}

			<Button
				text={status === 'loading' ? 'Bezig…' : 'Inloggen'}
				classes="w-full disabled:opacity-50"
			/>
		</form>
	)
}
