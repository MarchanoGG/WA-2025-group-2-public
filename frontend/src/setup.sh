mkdir -p src/layouts src/components src/pages

# Layouts
cat << 'EOF' > src/layouts/AuthLayout.tsx
import { ReactNode } from 'react'
import bgImage from '../assets/auth-bg.jpg'

interface Props {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: \`url(\${bgImage})\` }}
    >
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-xl w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
EOF

cat << 'EOF' > src/layouts/PortalLayout.tsx
import { ReactNode } from 'react'
import Header from '../components/Header'

interface Props {
  children: ReactNode
}

export default function PortalLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
EOF

# Header component
cat << 'EOF' > src/components/Header.tsx
export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button className="text-sm text-blue-600 border border-blue-300 px-3 py-1 rounded hover:bg-blue-50">
          Afmelden
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span>Marchano Gopal</span>
          <span className="px-2 py-1 border rounded text-xs font-semibold">233655412</span>
        </div>
      </div>
    </header>
  )
}
EOF

# Pages
declare -A pages=(
  ["ParentsLogin"]="Login als Ouder"
  ["Appointment"]="Afspraak Maken"
  ["Login"]="Login voor Werknemers"
  ["Booking"]="Kies een Tijdslot"
  ["Confirm"]="Bevestig Afspraak"
  ["Succes"]="Afspraak Succesvol"
)

for file in "${!pages[@]}"; do
cat << EOF > src/pages/$file.tsx
export default function $file() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">${pages[$file]}</h1>
      {/* Inhoud voor $file */}
    </div>
  )
}
EOF
done
