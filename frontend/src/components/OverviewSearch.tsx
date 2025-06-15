type Props = {
  value: string
  onChange: (value: string) => void
}

export default function AppointmentSearch({ value, onChange }: Props) {
  return (
<div className="flex justify-between items-center mb-4">
<input
  placeholder="Zoeken.."
  className="border border-gray-500 focus:border-blue-300 focus:ring-blue-200 focus:ring-1 focus:outline-none px-4 py-2 rounded-md text-sm w-1/3"
  value={value}
  onChange={(e) => onChange(e.target.value)}
/>

</div>

  )
}
