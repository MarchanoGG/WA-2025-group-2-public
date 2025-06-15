import { useState } from "react";
import { dummyParentCodes } from "../dummyParentCodes";
import Toast from "../components/Toast";

export default function AdminParentCodes() {
  const [codes, setCodes] = useState(dummyParentCodes);
  const [amount, setAmount] = useState(30);
  const [generated, setGenerated] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any | null>(null);
  const [toast, setToast] = useState("");

  const pageSize = 10;
  const filtered = codes.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleGenerate = () => {
    const lastId = codes.length > 0 ? Math.max(...codes.map((c) => c.id)) : 0;
    const newCodes = Array.from({ length: amount }, (_, i) => ({ id: lastId + i + 1, code: `NEW-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, used: false }));
    setCodes((prev) => [...newCodes, ...prev]);
    setGenerated(newCodes.map((c) => c.code));
    setShowPopup(true);
  };

  const handleDelete = () => {
    setCodes((prev) => prev.filter((c) => c.id !== selected.id));
    setToast("Code is verwijderd.");
    setSelected(null);
  };

  const handleSave = () => {
    setCodes((prev) => prev.map((c) => (c.id === selected.id ? selected : c)));
    setToast("Code is bijgewerkt.");
    setSelected(null);
  };

  const handleClosePopup = () => setShowPopup(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value));
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePageSelect = (pageNum: number) => setPage(pageNum);
  const handleCloseEdit = () => setSelected(null);
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setSelected({ ...selected, code: e.target.value });
  const handleUsedChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelected({ ...selected, used: e.target.value === "Ja" });

  return (
    <div className="p-6 max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-center text-gray-500 mb-4">Overzicht Ouder Codes</h1>
        <div className="bg-white rounded-md shadow-sm p-4">
          <input placeholder="Zoeken.." value={search} onChange={handleSearchChange} className="border px-3 py-2 rounded-md text-sm w-full mb-3" />
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Code</th>
                <th className="py-2">Gebruikt</th>
                <th className="py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {currentPage.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-mono text-xs whitespace-nowrap">{item.code}</td>
                  <td className="py-2">{item.used ? "Ja" : "Nee"}</td>
                  <td onClick={() => setSelected(item)} className="py-2 text-blue-600 hover:underline cursor-pointer">Bekijk →</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm">
              <button onClick={handlePrevPage} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Vorige</button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button key={pageNum} onClick={() => handlePageSelect(pageNum)} className={`px-3 py-1 rounded border ${page === pageNum ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>{pageNum}</button>
                  );
                })}
              </div>
              <button onClick={handleNextPage} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Volgende</button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4 h-fit">
        <h2 className="font-semibold text-lg mb-1">Nieuwe Ouder Codes genereren</h2>
        <p className="text-sm text-gray-500 mb-4">Codes worden per brief meegegeven aan de leerlingen</p>
        <label className="block text-sm mb-1">Hoeveelheid</label>
        <input type="number" value={amount} onChange={handleAmountChange} className="border px-3 py-2 rounded-md text-sm w-full mb-4" />
        <button onClick={handleGenerate} className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 text-sm">Toevoegen</button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/60 z-40" />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-md border z-50">
            <h3 className="text-lg font-semibold mb-4">Nieuw gegenereerde codes</h3>
            <ul className="text-sm font-mono max-h-64 overflow-y-auto space-y-1">
              {generated.map((code, idx) => <li key={idx} className="bg-gray-100 px-3 py-1 rounded">{code}</li>)}
            </ul>
            <button onClick={handleClosePopup} className="mt-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">Sluiten</button>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/60 z-40" />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-md border z-50">
            <h3 className="text-lg font-semibold mb-4">Ouder Code Details</h3>
            <div className="mb-4">
              <label className="block text-sm mb-1">Code</label>
              <input value={selected.code} onChange={handleCodeChange} className="w-full border px-3 py-2 rounded text-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Gebruikt</label>
              <select value={selected.used ? "Ja" : "Nee"} onChange={handleUsedChange} className="w-full border px-3 py-2 rounded text-sm">
                <option>Ja</option>
                <option>Nee</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
              <button onClick={handleCloseEdit} className="flex-1 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">Terug</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm">Verwijderen</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Opslaan</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
