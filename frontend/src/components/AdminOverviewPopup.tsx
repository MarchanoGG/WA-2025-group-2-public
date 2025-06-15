import { useState } from "react";

type Props = {
  item: any;
  onClose: () => void;
  onDelete: (id: number) => void;
  onSave: (updatedItem: any) => void;
};

export default function AdminOverviewPopup({ item, onClose, onDelete, onSave }: Props) {
  const [formData, setFormData] = useState({ studentName: item.studentName || "", phoneNumber: item.phoneNumber || "" });
  const [errors, setErrors] = useState({ studentName: "", phoneNumber: "" });

  const validate = () => {
    const newErrors = {
      studentName: formData.studentName.trim() === "" ? "Naam is verplicht" : "",
      phoneNumber: formData.phoneNumber.trim() === "" ? "Telefoonnummer is verplicht" : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleSave = () => { if (!validate()) return; onSave({ ...item, ...formData }); };
  const handleDelete = () => onDelete(item.id);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60 z-40" />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-md border z-50">
        <h2 className="text-lg font-semibold mb-4">Afsprakenbeheer</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Naam leerling</label>
            <input type="text" value={formData.studentName} onChange={(e) => handleChange("studentName", e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
            {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefoonnummer ouders</label>
            <input type="text" value={formData.phoneNumber} onChange={(e) => handleChange("phoneNumber", e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Terug</button>
          <div className="flex gap-2">
            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Verwijderen</button>
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Opslaan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
