import { useState } from 'react';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function ParentsLogin() {
	const [code, setCode] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();

	const handleLogin = async () => {
		const clean = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();

		if (clean.length !== 16) {
			setErrorMessage('Ongeldige code. Zorg ervoor dat de code 16 karakters lang is.');
			return;
		}

		try {
			const res = await api.get<{ code: string }[]>('/api/parentCodes');
			const codes = res.data.map(c => c.code);

			if (!codes.includes(clean)) {
				setErrorMessage('Deze code bestaat niet of is ongeldig.');
				return;
			}

			setErrorMessage('');
			navigate('/Parents/Appointment');
		} catch (err) {
			console.error(err);
			setErrorMessage('Er ging iets mis bij het controleren van de code.');
		}
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-xl font-semibold mb-4">Login als Ouder</h1>
			<p className="text-center mb-6 text-gray-500">
				Vul hier de unieke 16-karakterige code in om een afspraak te maken.
			</p>

			{errorMessage && (
				<p className="text-red-600 mb-4">{errorMessage}</p>
			)}

			<TextInput
				value={code}
				onChange={(e) => setCode(e.target.value.toUpperCase())}
				placeholder="XXXX-XXXX-XXXX-XXXX"
				name="parentCode"
				classes="mb-6"
			/>

			<Button text="Verder" action={handleLogin} classes="w-full" />
		</div>
	);
}
