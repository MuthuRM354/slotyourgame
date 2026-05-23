'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, CheckCircle2, User, Zap, Shield } from 'lucide-react'
import { ROLE_LABELS } from '@/lib/rbac'

const SELECTABLE_ROLES = ['player', 'captain', 'ground_admin']

const ROLE_META = {
  player: {
    icon: User,
    desc: 'Play for a team, mark attendance, track your stats.',
    color: 'border-blue-500/40 bg-blue-500/5 text-blue-400',
    active: 'border-blue-500/60 bg-blue-500/10 text-blue-300',
  },
  captain: {
    icon: Zap,
    desc: 'Lead a team, schedule fixtures, book grounds.',
    color: 'border-green-500/40 bg-green-500/5 text-green-400',
    active: 'border-green-500/60 bg-green-500/10 text-green-300',
  },
  ground_admin: {
    icon: Shield,
    desc: 'Manage your ground, approve bookings, set slots.',
    color: 'border-orange-500/40 bg-orange-500/5 text-orange-400',
    active: 'border-orange-500/60 bg-orange-500/10 text-orange-300',
  },
}

export default function RegisterForm() {
  const router = useRouter()
  const [form, setForm]       = useState({ fullName: '', email: '', password: '', role: 'player' })
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email:    form.email,
      password: form.password,
      options:  { data: { full_name: form.fullName, role: form.role } },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-6">
        <CheckCircle2 size={44} className="text-green-400 mx-auto" />
        <p className="text-white font-semibold text-lg">Account created!</p>
        <p className="text-slate-400 text-sm leading-relaxed">
          Check your email to verify your address,<br />then sign in.
        </p>
        <button
          onClick={() => router.push('/auth/login')}
          className="mt-2 w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition text-sm"
        >
          Go to Sign In
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 text-red-400 text-sm px-4 py-3 rounded-xl">
          <span className="mt-0.5">⚠</span> {error}
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
        <input
          type="text" value={form.fullName} onChange={set('fullName')} required
          placeholder="James Anderson"
          className="w-full bg-[#0a0f18] border border-[#1c2432] hover:border-slate-600 focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
        <input
          type="email" value={form.email} onChange={set('email')} required
          placeholder="you@example.com"
          className="w-full bg-[#0a0f18] border border-[#1c2432] hover:border-slate-600 focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'} value={form.password} onChange={set('password')} required minLength={6}
            placeholder="min 6 characters"
            className="w-full bg-[#0a0f18] border border-[#1c2432] hover:border-slate-600 focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 outline-none transition"
          />
          <button type="button" onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Role selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">I am a…</label>
        <div className="grid grid-cols-3 gap-2">
          {SELECTABLE_ROLES.map((r) => {
            const meta = ROLE_META[r]
            const RoleIcon = meta.icon
            const isSelected = form.role === r
            return (
              <button
                key={r} type="button"
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium border transition ${
                  isSelected ? meta.active : 'border-[#1c2432] bg-[#0a0f18] text-slate-500 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                <RoleIcon size={15} />
                {ROLE_LABELS[r]}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {ROLE_META[form.role].desc}
        </p>
      </div>

      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 active:bg-green-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition text-sm"
      >
        {loading ? <><Loader2 size={15} className="animate-spin" /> Creating account…</> : 'Create Account'}
      </button>
    </form>
  )
}
