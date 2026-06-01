'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import { login } from '@/lib/auth'

export default function LoginForm() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
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
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Email address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          required placeholder="you@example.com" className="input-field" autoComplete="email" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
        <div className="relative">
          <input type={show ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)}
            required placeholder="••••••••" className="input-field pr-11" autoComplete="current-password" />
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5" tabIndex={-1}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 btn-primary py-3.5 rounded-xl text-sm mt-2 disabled:opacity-60 disabled:pointer-events-none">
        {loading ? <><Loader2 size={15} className="animate-spin" />Signing in…</> : <>Sign In <ArrowRight size={15} /></>}
      </button>

      <p className="text-center text-sm text-slate-500 pt-1">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
          Create one free
        </Link>
      </p>
    </form>
  )
}
