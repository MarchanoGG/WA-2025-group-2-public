import { useEffect, useState } from "react"

type Props = {
  pdfUrl: string
  onClose: () => void
}

export default function ParentCodePdfPopup({ pdfUrl, onClose }: Props) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-md w-[95vw] h-[90vh] z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Gegenereerde PDF met Ouder Codes</h3>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-black">Sluiten</button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col justify-center items-center p-4">
          {isMobile ? (
            <>
              <p className="text-sm mb-4 text-center">
                PDF weergave wordt op mobiel niet ondersteund. Klik hieronder om de PDF in een nieuw tabblad te openen.
              </p>
              <a href={pdfUrl} download="oudercodes.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                📄 Open PDF in nieuw tabblad
              </a>
            </>
          ) : (
            <>
              <iframe src={pdfUrl} title="Parent Codes PDF" className="w-full h-full" style={{ border: "none" }} />
              <a href={pdfUrl} download="oudercodes.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline mt-2 block text-center">
                📄 Open PDF in nieuw tabblad
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
