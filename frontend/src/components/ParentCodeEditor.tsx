import { useState } from "react";
import QRCode from "react-qr-code";

type Props = {
  code: { id: number; code: string; used: boolean };
  onClose: () => void;
  onSave: (updated: { id: number; code: string; used: boolean }) => void;
  onDelete: (id: number) => void;
};

export default function ParentCodeEditor({ code, onClose, onSave, onDelete }: Props) {
  const [current, setCurrent] = useState({ ...code });

  const qrUrl = `${window.location.origin}/Parents/Login?${current.code}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(prev => ({ ...prev, code: e.target.value }));
  };

  const handleUsedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrent(prev => ({ ...prev, used: e.target.value === "Ja" }));
  };

  function handleEmailClick(code: string): void {
    const subject = encodeURIComponent("Uw oudercode voor EduPlanner");
    const loginUrl = `${window.location.origin}/Parents/Login`;
    const body = encodeURIComponent(`Beste ouder,\n\nHier is uw oudercode voor EduPlanner:\n\n${code}\n\n` + `U kunt deze code gebruiken om in te loggen via:\n${loginUrl}\n\n` + `Met vriendelijke groet,\nHet EduPlanner Team`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, "_blank");
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-md border z-50">
        <h3 className="text-lg font-semibold mb-4">Ouder Code Details</h3>

        <div className="mb-4">
          <label className="block text-sm mb-1">Code</label>
          <input value={current.code} onChange={handleChange} className="w-full border px-3 py-2 rounded text-sm font-mono" />
        </div>

        <div className="mb-4 text-center">
          <QRCode value={qrUrl} size={180} />
          <div className="text-xs mt-2 font-mono break-all">{qrUrl}</div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">
            Terug
          </button>
          <button onClick={() => onDelete(current.id)} className="flex-1 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm">
            Verwijderen
          </button>
          <button onClick={() => onSave(current)} className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">
            Opslaan
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <button onClick={() => handleEmailClick(current.code)} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm">
            Verzend via Outlook
          </button>
        </div>
      </div>
    </div>
  );
}
