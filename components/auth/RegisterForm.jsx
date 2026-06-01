'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, CheckCircle2, User, Zap, Shield, AlertCircle, ArrowRight } from 'lucide-react'
import { register } from '@/lib/auth'

const ROLES = ['player', 'captain']
const ROLE_META = {
  player:  { icon: User, label: 'Player',  desc: 'Play for a team, mark attendance, track your stats.',                idle: 'border-[#1c2432] bg-[#0a0f18] text-slate-500', active: 'border-blue-500/50 bg-blue-500/10 text-blue-300',   ring: 'ring-blue-500/20' },
  captain: { icon: Zap,  label: 'Captain', desc: 'Lead a team, schedule fixtures, book grounds, recruit players.', idle: 'border-[#1c2432] bg-[#0a0f18] text-slate-500', active: 'border-green-500/50 bg-green-500/10 text-green-300', ring: 'ring-green-500/20' },
}

export default function RegisterForm() {
  const router = useRouter()
  const [form, setForm]       = useState({ fullName: '', email: '', password: '', role: 'player' })
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form.fullName, form.email, form.password, form.role)
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-3.5 rounded-xl animate-fade-in">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Full Name</label>
        <input type="text" value={form.fullName} onChange={set('fullName')} required placeholder="James Anderson" className="input-field" autoComplete="name" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Email address</label>
        <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" className="input-field" autoComplete="email" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
        <div className="relative">
          <input type={show ? 'text' : 'password'} value={form.password} onChange={set('password')}
            required minLength={8} placeholder="min 8 characters" className="input-field pr-11" autoComplete="new-password" />
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5" tabIndex={-1}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">I am a…</label>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map(r => {
            const m = ROLE_META[r]
            const Icon = m.icon
            return (
              <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                className={`flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  form.role === r ? `${m.active} ring-2 ${m.ring}` : `${m.idle} hover:border-slate-600 hover:text-slate-300`
                }`}>
                <Icon size={14} />
                <span className="text-[11px] leading-tight text-center">{m.label}</span>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pl-0.5">{ROLE_META[form.role].desc}</p>
      </div>

      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 btn-primary py-3.5 rounded-xl text-sm mt-1 disabled:opacity-60 disabled:pointer-events-none">
        {loading ? <><Loader2 size={15} className="animate-spin" />Creating account…</> : <>Create Account <ArrowRight size={15} /></>}
      </button>

      <p className="text-center text-sm text-slate-500 pt-1">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">Sign in</Link>
      </p>
    </form>
  )
}
