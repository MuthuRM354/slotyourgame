'use client'

/**
 * One-time admin setup page.
 *
 * Creates the first ADMIN account on the platform.
 * Protected by a setup secret (X-Setup-Secret header).
 *
 * How to use:
 *  1. Set APP_SETUP_SECRET env var in Railway
 *  2. Visit /setup and enter that secret + admin credentials
 *  3. After first admin is created this page returns 409 — disable the env var
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'

export default function SetupPage() {
  const router  = useRouter()
  const [form,    setForm]    = useState({ fullName: '', email: '', password: '', secret: '' })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE}/api/v1/auth/setup`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'X-Setup-Secret': form.secret,
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email:    form.email,
          password: form.password,
          role:     'ADMIN',
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.message ?? `Error ${res.status}`)
      setDone(true)
      setTimeout(() => router.push('/auth/login'), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <main className="min-h-screen bg-[#030711] flex items-center justify-center px-5">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto">
          <CheckCircle2 size={30} className="text-green-400" />
        </div>
        <p className="text-white font-bold text-xl">Admin account created!</p>
        <p className="text-slate-400 text-sm">Redirecting to Sign In…</p>
        <p className="text-slate-600 text-xs mt-4">
          Security: remove <code className="text-slate-400">APP_SETUP_SECRET</code> from Railway env vars now.
        </p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#030711] flex items-center justify-center px-5">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={26} className="text-orange-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">First Admin Setup</h1>
          <p className="text-slate-400 text-sm mt-2">
            Creates the platform&apos;s first ADMIN account.<br />
            Requires the <code className="text-orange-400 text-xs">APP_SETUP_SECRET</code> env var set in Railway.
          </p>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 bg-yellow-500/8 border border-yellow-500/20 text-yellow-400 text-xs px-4 py-3 rounded-xl mb-6">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>This endpoint only works once. After creating the admin, remove <code>APP_SETUP_SECRET</code> from Railway.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Setup Secret */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Setup Secret</label>
            <input type="password" value={form.secret} onChange={set('secret')} required
              placeholder="Value of APP_SETUP_SECRET env var"
              className="input-field w-full" />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Admin Full Name</label>
            <input type="text" value={form.fullName} onChange={set('fullName')} required
              placeholder="Your name"
              className="input-field w-full" autoComplete="name" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Admin Email</label>
            <input type="email" value={form.email} onChange={set('email')} required
              placeholder="admin@slotyourgame.com"
              className="input-field w-full" autoComplete="email" />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={form.password} onChange={set('password')}
                required minLength={8} placeholder="min 8 characters"
                className="input-field w-full pr-11" autoComplete="new-password" />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors" tabIndex={-1}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" /><span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-60 disabled:pointer-events-none mt-2">
            {loading
              ? <><Loader2 size={15} className="animate-spin" />Creating admin…</>
              : <>Create Admin Account <ArrowRight size={15} /></>
            }
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Already have an admin account?{' '}
          <a href="/auth/login" className="text-green-400 hover:text-green-300">Sign in</a>
        </p>
      </div>
    </main>
  )
}
