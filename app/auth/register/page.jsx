import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'
import { Zap, Calendar, BarChart2, MapPin } from 'lucide-react'

export const metadata = { title: 'Create Account — SlotYourGame' }

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#030711] flex">

      {/* ── Left decorative panel ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] relative overflow-hidden p-10">
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
              Get your team
              <br />
              <span className="gradient-text">organised today</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Free forever. No credit card. Set up your team in under 2 minutes.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: '01', title: 'Create your account', desc: 'Choose your role — player, captain, or ground admin.' },
              { step: '02', title: 'Set up your team', desc: 'Add players, schedule your first fixture.' },
              { step: '03', title: 'Play smarter', desc: 'Track stats, manage bookings, recruit free agents.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center shrink-0">
                  {step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-slate-600">
            Trusted by cricket clubs across India · Free forever
          </p>
        </div>
      </div>

      {/* ── Right panel: form ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 relative">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-green-500/4 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
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
              Create your account
            </h1>
            <p className="text-slate-500 text-sm">
              Free forever · No credit card required
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#0c1117] border border-[#1c2432] rounded-2xl p-7 shadow-2xl shadow-black/60">
            <RegisterForm />
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-600 mt-6">
            <Link href="/" className="hover:text-slate-400 transition-colors">← Back to homepage</Link>
          </p>
        </div>
      </div>

    </main>
  )
}
