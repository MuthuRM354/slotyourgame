'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, CheckCircle2, User, Zap, Shield, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ROLE_LABELS } from '@/lib/rbac'

const SELECTABLE_ROLES = ['player', 'captain', 'ground_admin']

const ROLE_META = {
  player: {
    icon: User,
    label: 'Player',
    desc: 'Play for a team, mark attendance, track your stats.',
    idle:   'border-[#1c2432] bg-[#0a0f18] text-slate-500',
    active: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
    ring:   'ring-blue-500/20',
  },
  captain: {
    icon: Zap,
    label: 'Captain',
    desc: 'Lead a team, schedule fixtures, book grounds, recruit players.',
    idle:   'border-[#1c2432] bg-[#0a0f18] text-slate-500',
    active: 'border-green-500/50 bg-green-500/10 text-green-300',
    ring:   'ring-green-500/20',
  },
  ground_admin: {
    icon: Shield,
    label: 'Ground Admin',
    desc: 'Manage your ground, approve bookings, control time slots.',
    idle:   'border-[#1c2432] bg-[#0a0f18] text-slate-500',
    active: 'border-orange-500/50 bg-orange-500/10 text-orange-300',
    ring:   'ring-orange-500/20',
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

  /* ── Success state ───────────────────────────────────────── */
  if (success) {
    return (
      <div className="text-center space-y-5 py-4 animate-scale-in">
        <div className="relative inline-flex">
          <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center glow-green">
            <CheckCircle2 size={30} className="text-green-400" />
          </div>
          <div className="absolute inset-0 rounded-full bg-green-500/8 animate-ping-slow" />
        </div>
        <div>
          <p className="text-white font-bold text-xl">Account created!</p>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Check your email to verify your address,<br />then sign in to get started.
          </p>
        </div>
        <button
          onClick={() => router.push('/auth/login')}
          className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm"
        >
          Go to Sign In <ArrowRight size={15} />
        </button>
      </div>
    )
  }

  /* ── Form ────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {error && (
        <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-3.5 rounded-xl animate-fade-in">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Full Name</label>
        <input
          type="text" value={form.fullName} onChange={set('fullName')} required
          placeholder="James Anderson"
          className="input-field"
          autoComplete="name"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Email address</label>
        <input
          type="email" value={form.email} onChange={set('email')} required
          placeholder="you@example.com"
          className="input-field"
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'} value={form.password} onChange={set('password')}
            required minLength={6}
            placeholder="min 6 characters"
            className="input-field pr-11"
            autoComplete="new-password"
          />
          <button
            type="button" onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
            tabIndex={-1}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Role selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">I am a…</label>
        <div className="grid grid-cols-3 gap-2">
          {SELECTABLE_ROLES.map((r) => {
            const meta = ROLE_META[r]
            const RoleIcon = meta.icon
            const isSelected = form.role === r
            return (
              <button
                key={r} type="button"
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                className={`flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? `${meta.active} ring-2 ${meta.ring}`
                    : `${meta.idle} hover:border-slate-600 hover:text-slate-300`
                }`}
              >
                <RoleIcon size={14} />
                <span className="text-[11px] leading-tight text-center">{meta.label}</span>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pl-0.5">
          {ROLE_META[form.role].desc}
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 btn-primary py-3.5 rounded-xl text-sm mt-1 disabled:opacity-60 disabled:pointer-events-none"
      >
        {loading ? (
          <><Loader2 size={15} className="animate-spin" /> Creating account…</>
        ) : (
          <>Create Account <ArrowRight size={15} /></>
        )}
      </button>

      {/* Login link */}
      <p className="text-center text-sm text-slate-500 pt-1">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}
