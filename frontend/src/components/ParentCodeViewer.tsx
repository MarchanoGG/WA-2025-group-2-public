import QRCode from "react-qr-code"

type Props = {
  code: string
  onClose: () => void
}

export default function ParentCodeViewer({ code, onClose }: Props) {
  const qrUrl = `${window.location.origin}/Parents/Login?${code}`

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-md p-6 w-full max-w-sm z-50 text-center">
        <h3 className="text-lg font-semibold mb-4">Ouder Code</h3>
        <div className="text-sm font-mono mb-4">{code}</div>
        <QRCode value={qrUrl} size={200} />
        <div className="mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">Sluiten</button>
        </div>
      </div>
    </div>
  )
}
