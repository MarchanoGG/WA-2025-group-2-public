import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Homepagina</h1>

            <nav className="flex flex-col gap-2">
                <Link to="/" className="text-blue-500 underline">
                    Ga naar Home
                </Link>
                <Link to="/login/parent" className="text-blue-500 underline">
                    Over Ons
                </Link>
            </nav>
        </div>
    )
}
