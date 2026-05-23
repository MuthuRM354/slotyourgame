'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function SetupPage() {
  const router = useRouter()
  const [status,  setStatus]  = useState('checking') // checking | ready | done | no_key
  const [form,    setForm]    = useState({ fullName: '', email: '', password: '' })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [err,     setErr]     = useState('')
  const [ok,      setOk]      = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    fetch('/api/setup')
      .then((r) => r.json())
      .then((d) => {
        if (d.reason === 'no_service_key') setStatus('no_key')
        else if (d.done) setStatus('done')
        else setStatus('ready')
      })
      .catch(() => setStatus('ready'))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setErr(data.error); return }
      setOk(true)
      setTimeout(() => router.push('/auth/login'), 2500)
    } catch (e) {
      setErr('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
            <ShieldCheck size={26} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">First-Time Setup</h1>
          <p className="text-sm text-slate-400 mt-1">Create the super admin account</p>
        </div>

        {/* States */}
        {status === 'checking' && (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-slate-500" />
          </div>
        )}

        {status === 'no_key' && (
          <div className="bg-yellow-500/10 border border-yellow-600/30 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-yellow-400 font-semibold">
              <AlertTriangle size={18} /> Missing environment variable
            </div>
            <p className="text-sm text-slate-400">
              Add your Supabase service role key to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs">.env.local</code>:
            </p>
            <pre className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-green-400 overflow-x-auto">
{`SUPABASE_SERVICE_ROLE_KEY=your_service_role_key`}
            </pre>
            <p className="text-xs text-slate-500">
              Find it in <strong className="text-slate-300">Supabase → Project Settings → API → service_role key</strong>
            </p>
          </div>
        )}

        {status === 'done' && (
          <div className="bg-[#0c1117] border border-[#1c2432] rounded-2xl p-8 text-center space-y-4">
            <CheckCircle2 size={40} className="text-green-400 mx-auto" />
            <p className="text-white font-semibold">Setup already complete</p>
            <p className="text-sm text-slate-400">A super admin already exists.</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-2.5 rounded-xl transition text-sm"
            >
              Go to Sign In
            </button>
          </div>
        )}

        {status === 'ready' && !ok && (
          <form onSubmit={handleSubmit} className="bg-[#0c1117] border border-[#1c2432] rounded-2xl p-6 space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400">
              ⚠ This page only works once. After setup, it will be locked.
            </div>

            {err && (
              <div className="bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-3 text-sm text-red-300">
                {err}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Full Name</label>
              <input
                required value={form.fullName} onChange={set('fullName')}
                placeholder="Super Admin"
                className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/30 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Email</label>
              <input
                required type="email" value={form.email} onChange={set('email')}
                placeholder="admin@slotyourgame.com"
                className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/30 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Password</label>
              <div className="relative">
                <input
                  required type={show ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="min 6 characters" minLength={6}
                  className="w-full bg-[#0a0f18] border border-[#1c2432] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/30 transition"
                />
                <button type="button" onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition text-sm"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> Creating…</> : 'Create Super Admin'}
            </button>
          </form>
        )}

        {ok && (
          <div className="bg-[#0c1117] border border-green-700/30 rounded-2xl p-8 text-center space-y-3">
            <CheckCircle2 size={40} className="text-green-400 mx-auto" />
            <p className="text-white font-semibold">Super admin created!</p>
            <p className="text-sm text-slate-400">Redirecting to sign in…</p>
          </div>
        )}

        <p className="text-center text-xs text-slate-600 mt-6">
          SlotYourGame · First-time setup
        </p>
      </div>
    </div>
  )
}
