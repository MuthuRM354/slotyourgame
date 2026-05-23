'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'

export default function LoginForm() {
  const router  = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 text-red-400 text-sm px-4 py-3 rounded-xl">
          <span className="mt-0.5">⚠</span> {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          placeholder="you@example.com"
          className="w-full bg-[#0a0f18] border border-[#1c2432] hover:border-slate-600 focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
        </div>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
            placeholder="••••••••"
            className="w-full bg-[#0a0f18] border border-[#1c2432] hover:border-slate-600 focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 outline-none transition"
          />
          <button type="button" onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 active:bg-green-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition text-sm"
      >
        {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={15} /></>}
      </button>

      <p className="text-center text-sm text-slate-500">
        No account?{' '}
        <Link href="/auth/register" className="text-green-400 hover:text-green-300 font-medium transition">
          Create one
        </Link>
      </p>
    </form>
  )
}
