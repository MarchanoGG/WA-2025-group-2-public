import type { ClassWithUsers } from '../api/classes'
import React from 'react'

type Props = {
    data: ClassWithUsers[]
    page: number
    totalPages: number
    setPage: (n: number) => void
    onSelect: (cls: ClassWithUsers) => void
}

export default function AdminClassesTable({
    data,
    page,
    totalPages,
    setPage,
    onSelect,
}: Props) {
    return (
        <>
            <table className="w-full table-auto text-sm">
                <thead>
                    <tr className="border-b text-left text-gray-500">
                        <th className="py-2">Klas</th>
                        <th className="py-2">Onderwijs</th>
                        <th className="py-2">Mentor/Decaan</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(c => (
                        <tr key={c.id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{c.className}</td>
                            <td className="py-2">{c.education}</td>
                            <td className="py-2">
                                {c.users.map(u => `${u.firstName} ${u.initials}`).join(', ')}
                            </td>
                            <td className="py-2">
                                <button
                                    onClick={() => onSelect(c)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Bewerken
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 text-sm">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Vorige
                    </button>
                    <span>
                        Pagina {page} / {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Volgende
                    </button>
                </div>
            )}
        </>
    )
}
