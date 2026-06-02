import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Zap, Shield, Trophy, Users } from 'lucide-react'

export const metadata = { title: 'Sign In — SlotYourGame' }

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#030711] flex">

      {/* ── Left panel (decorative, hidden on mobile) ─────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] relative overflow-hidden p-10">
        {/* Background glow */}
        <div className="absolute inset-0 hero-bg-grid" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-green-500/8 blur-[80px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-center glow-green-xs">
            <Zap size={18} className="text-green-400" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Slot<span className="text-green-400">YourGame</span>
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Your cricket team's
              <br />
              <span className="gradient-text">command centre</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Fixtures, attendance, ground bookings, player stats, and free agents — all in one dashboard.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              { icon: Shield,  color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',  text: 'Secure JWT authentication' },
              { icon: Trophy,  color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'Full league & standings management' },
              { icon: Users,   color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',    text: 'Role-based dashboards for every member' },
            ].map(({ icon: Icon, color, bg, text }) => (
              <div key={text} className="flex items-center gap-3 glass-light rounded-xl px-4 py-3 border border-[#1c2432]">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon size={13} className={color} />
                </div>
                <span className="text-sm text-slate-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative z-10">
          <p className="text-xs text-slate-600">
            Trusted by cricket clubs across India · Free forever
          </p>
        </div>
      </div>

      {/* ── Right panel: form ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 relative">
        {/* Subtle right panel glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-green-500/4 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                <Zap size={15} className="text-green-400" />
              </div>
              <span className="text-white font-bold text-[15px]">
                Slot<span className="text-green-400">YourGame</span>
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1.5">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">
              Sign in to your account to continue.
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#0c1117] border border-[#1c2432] rounded-2xl p-7 shadow-2xl shadow-black/60">
            <LoginForm />
          </div>

          {/* Footer link */}
          <p className="text-center text-xs text-slate-600 mt-6">
            <Link href="/" className="hover:text-slate-400 transition-colors">← Back to homepage</Link>
          </p>
        </div>
      </div>

    </main>
  )
}
