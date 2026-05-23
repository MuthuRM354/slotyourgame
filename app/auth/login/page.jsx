import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata = { title: 'Sign In — SlotYourGame' }

export default function LoginPage() {
  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-green-400 font-extrabold text-2xl tracking-tight hover:text-green-300 transition">
            <Zap size={22} className="text-green-400" />
            SlotYourGame
          </Link>
          <p className="text-slate-500 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#0c1117] border border-[#1c2432] rounded-2xl p-7 shadow-2xl shadow-black/40">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          SlotYourGame · Built for cricket teams in India
        </p>
      </div>
    </main>
  )
}
