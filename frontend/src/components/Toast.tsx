import { useEffect } from "react"

type Props = {
  message: string
  onClose: () => void
}

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3000)
    return () => clearTimeout(timeout)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-md text-sm z-50">
      {message}
    </div>
  )
}
