import { useLocation } from 'react-router-dom'

export default function Succes() {
  const location = useLocation()
  const { date, time } = location.state || {}

  const formattedDate = date ? new Date(date).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) : 'Niet beschikbaar'

  return (
    <div className="flex justify-center pt-24">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg text-center">
        <h2 className="text-xl font-bold mb-4">Afspraak succesvol gepland!</h2>
        <p className="mb-4">
          Bedankt voor het maken van een afspraak. U ontvangt binnenkort een bevestiging per e-mail.
        </p>

        <p className="mb-2"><strong>Datum:</strong> {formattedDate}</p>
        <p className="mb-4"><strong>Tijd:</strong> {time}</p>
      </div>
    </div>
  )
}
