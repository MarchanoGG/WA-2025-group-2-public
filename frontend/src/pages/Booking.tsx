import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { nl } from 'date-fns/locale'

import Button from '../components/Button'
import TimeSlot from '../components/TimeSlot'

import { useNavigate } from 'react-router-dom'

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')

  const timeOptions = [
    '17:15', '17:30', '17:45', '18:00', '18:30',
    '18:45', '19:00', '19:15', '19:30', '19:45',
    '20:00', '20:15', '20:30', '20:45', '21:00',
    '21:15', '21:30', '21:45', '22:00', '22:15',
  ]
  const navigate = useNavigate()

  return (

    
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-10">
      <div className="flex gap-16 items-start">
        {/* Kalender met react-datepicker */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-bold mb-4">Datum</h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              if (date) setSelectedDate(date)
            }}
            inline
            locale={nl}
            dateFormat="dd-MM-yyyy"
          />
        </div>

        {/* Tijdslots */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-bold mb-4">Tijd</h2>
          <div className="grid grid-cols-5 gap-3">
            {timeOptions.map((time, index) => (
              <TimeSlot
                key={index}
                time={time}
                selected={selectedTime === time}
                onClick={() => setSelectedTime(time)}
              />
            ))}
          </div>
        </div>
      </div>

<Button
  text="Bevestigen"
  action={() => {
    if (!selectedTime) return alert("Selecteer eerst een tijd.")
    navigate('/Parents/Confirm', {
      state: {
        date: selectedDate.toISOString(),
        time: selectedTime
      }
    })
  }}
/>
    </div>
  )
} 