import { ReactNode } from 'react'
import bgImage from '../assets/auth-bg.jpg'

interface Props {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="bg-white backdrop-blur-md p-6 rounded-lg shadow-xl w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
