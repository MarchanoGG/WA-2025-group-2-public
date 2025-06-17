import { useEffect, useState } from 'react'
import Toast from '../components/Toast'
import ParentCodePdfPopup from '../components/ParentCodepdfPopup'
import { generateParentCodesPdf } from '../utils/pdfGenerator'
import ParentCodeEditor from '../components/ParentCodeEditor'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'
import {
	getParentCodes,
	updateParentCode,
	deleteParentCode,
	type ParentCode,
	createParentCodes
} from '../api/parentCodes'

export default function AdminParentCodes() {
	const [codes, setCodes] = useState<ParentCode[]>([])
	const [amount, setAmount] = useState(30)
	const [pdfVisible, setPdfVisible] = useState(false)
	const [pdfUrl, setPdfUrl] = useState('')
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const [selected, setSelected] = useState<ParentCode | null>(null)
	const [toast, setToast] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		(async () => {
			try {
				const data = await getParentCodes()
				setCodes(data)
			} catch (err) {
				console.error(err)
				setError('Kon oudercodes niet ophalen.')
			} finally {
				setLoading(false)
			}
		})()
	}, [])

	const pageSize = 20
	const filtered = [...codes]
		.filter(c => c.code.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	const totalPages = Math.ceil(filtered.length / pageSize)
	const currentPage = filtered.slice((page - 1) * pageSize, page * pageSize)

	const handleGenerate = async () => {
		try {
			const newCodes = await createParentCodes(amount)

			if (newCodes.length < amount) {
				setToast('Niet genoeg unieke codes gegenereerd.')
				return
			}

			setCodes(prev => [...newCodes, ...prev])
			const blob = await generateParentCodesPdf(newCodes.map(c => c.code))
			const blobUrl = URL.createObjectURL(blob)
			setPdfUrl(blobUrl)
			setPdfVisible(true)
		} catch (err) {
			console.error(err)
			setToast('Fout bij genereren van codes.')
		}
	}

	return (
		<div className="p-6 max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
			<div className="md:col-span-2">
				<h1 className="text-center text-gray-500 mb-4">Overzicht Ouder Codes</h1>
				<div className="bg-white rounded-md shadow-sm p-4">
					<input
						placeholder="Zoeken.."
						value={search}
						onChange={e => setSearch(e.target.value)}
						className="border px-3 py-2 rounded-md text-sm w-full mb-3"
					/>

					{loading ? (
						<p className="text-gray-500 text-sm text-center py-4">Laden…</p>
					) : error ? (
						<p className="text-red-600 text-sm text-center py-4">{error}</p>
					) : (
						<>
							<table className="w-full table-auto text-sm">
								<thead>
									<tr className="text-left text-gray-500 border-b">
										<th className="py-2">Code</th>
										<th className="py-2">Gemaakt op</th>
										<th className="py-2">Details</th>
									</tr>
								</thead>
								<tbody>
									{currentPage.map(item => (
										<tr key={item.id} className="border-b hover:bg-gray-50">
											<td className="py-2 font-mono text-xs whitespace-nowrap">{item.code}</td>
											<td className="py-2">
												{formatDistanceToNow(parseISO(item.createdAt), {
													addSuffix: true,
													locale: nl,
												})}
											</td>
											<td
												onClick={() => setSelected(item)}
												className="py-2 text-blue-600 hover:underline cursor-pointer"
											>
												Bekijk →
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{totalPages > 1 && (
								<div className="flex justify-between items-center mt-4 text-sm">
									<button
										onClick={() => setPage(p => Math.max(1, p - 1))}
										disabled={page === 1}
										className="px-3 py-1 border rounded disabled:opacity-50"
									>
										Vorige
									</button>
									<div className="flex gap-1">
										{[...Array(totalPages)].map((_, i) => {
											const pageNum = i + 1
											return (
												<button
													key={pageNum}
													onClick={() => setPage(pageNum)}
													className={`px-3 py-1 rounded border ${page === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
												>
													{pageNum}
												</button>
											)
										})}
									</div>
									<button
										onClick={() => setPage(p => Math.min(totalPages, p + 1))}
										disabled={page === totalPages}
										className="px-3 py-1 border rounded disabled:opacity-50"
									>
										Volgende
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			<div className="bg-white rounded-md shadow-sm p-4 h-fit">
				<h2 className="font-semibold text-lg mb-1">Nieuwe Ouder Codes genereren</h2>
				<p className="text-sm text-gray-500 mb-4">
					Codes worden per brief meegegeven aan de leerlingen
				</p>
				<label className="block text-sm mb-1">Hoeveelheid</label>
				<input
					type="number"
					value={amount}
					onChange={e => setAmount(Number(e.target.value))}
					className="border px-3 py-2 rounded-md text-sm w-full mb-4"
				/>
				<button
					onClick={handleGenerate}
					className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 text-sm"
				>
					Toevoegen
				</button>
			</div>

			{pdfVisible && <ParentCodePdfPopup pdfUrl={pdfUrl} onClose={() => setPdfVisible(false)} />}
			{selected && (
				<ParentCodeEditor
					code={selected}
					onClose={() => setSelected(null)}
					onSave={async updated => {
						await updateParentCode(updated.id, updated)
						setCodes(prev => prev.map(c => (c.id === updated.id ? { ...c, ...updated } : c)))
						setSelected(null)
						setToast('Code is bijgewerkt.')
					}}
					onDelete={async id => {
						try {
							await deleteParentCode(id)
							setCodes(prev => prev.filter(c => c.id !== id))
							setSelected(null)
							setToast('Code is verwijderd.')
						} catch (err) {
							console.error(err)
							setToast('Verwijderen mislukt.')
						}
					}}
				/>
			)}
			{toast && <Toast message={toast} onClose={() => setToast('')} />}
		</div>
	)
}
