interface TimeSlotProps {
  time: string
  selected: boolean
  onClick: () => void
}

export default function TimeSlot({ time, selected, onClick }: TimeSlotProps) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 border rounded text-sm text-center cursor-pointer transition 
      ${selected ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-100'}`}
    >
      {time}
    </div>
  )
}
