import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'

export default function Confirm() {
  const location = useLocation()
  const navigate = useNavigate()
  const { date, time } = location.state || {}

  const formattedDate = date ? new Date(date).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) : 'Niet beschikbaar'

  return (
    <div className="flex justify-center pt-24">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-xl font-bold mb-2">Afspraak bevestigen</h2>
        <p className="mb-4">Beste ouders/verzorgers van Marciano Hardoar,</p>
        <p className="mb-4">
          U staat op het punt om een afspraak te maken bij de Mentor van klas 2D.
          Controleer de gegevens en klik op bevestig als alles klopt. U krijgt een mail als bevestiging.
        </p>

        <div className="mb-4 text-sm leading-relaxed">
          <p><strong>Leerlingnummer:</strong> 351235</p>
          <p><strong>Naam kind:</strong> Lukas</p>
          <p><strong>Telefoonnummer:</strong> 0612345678</p>
          <p><strong>E-mailadres:</strong> Jaman@gmail.com</p>
        </div>

        <div className="mb-6 text-sm">
          <p><strong>Datum afspraak:</strong> {formattedDate}</p>
          <p><strong>Tijd:</strong> {time}</p>
        </div>

        <div className="flex gap-4 justify-end">
          <Button text="Terug" action={() => navigate(-1)} classes="bg-white text-black border" />
          <Button text="Bevestig" action={() => navigate('/Parents/Succes', { state: { date, time } })} />
        </div>
      </div>
    </div>
  )
}
