import Link from 'next/link'
import {
  Calendar, MapPin, BarChart2, Trophy,
  UserSearch, ArrowRight, Zap, ChevronRight,
  Users, Activity, CheckCircle2, Building2,
} from 'lucide-react'

export const metadata = {
  title: 'SlotYourGame — Cricket Team Management',
  description: 'Schedule fixtures, book grounds, track stats. Built for grassroots cricket in India.',
}

const FEATURES = [
  {
    href:    '/grounds',
    icon:    MapPin,
    color:   'text-green-400',
    bg:      'bg-green-500/10 border-green-500/20',
    title:   'Find & Book Grounds',
    desc:    'Browse verified cricket grounds, check slot availability, book instantly.',
    cta:     'Browse grounds',
  },
  {
    href:    '/dashboard/fixtures',
    icon:    Calendar,
    color:   'text-blue-400',
    bg:      'bg-blue-500/10 border-blue-500/20',
    title:   'Fixture Management',
    desc:    'Schedule T20s, nets & tournaments. Players RSVP with one tap.',
    cta:     'View fixtures',
  },
  {
    href:    '/dashboard/stats',
    icon:    BarChart2,
    color:   'text-yellow-400',
    bg:      'bg-yellow-500/10 border-yellow-500/20',
    title:   'Player Stats',
    desc:    'Track every run, wicket and match. See your career leaderboard.',
    cta:     'See stats',
  },
  {
    href:    '/dashboard/leagues',
    icon:    Trophy,
    color:   'text-purple-400',
    bg:      'bg-purple-500/10 border-purple-500/20',
    title:   'Leagues & Tournaments',
    desc:    'Organise multi-team leagues, track standings, log results.',
    cta:     'View leagues',
  },
  {
    href:    '/dashboard/marketplace',
    icon:    UserSearch,
    color:   'text-orange-400',
    bg:      'bg-orange-500/10 border-orange-500/20',
    title:   'Free Agent Board',
    desc:    'Players post availability. Captains find cover for missing squad members.',
    cta:     'Browse players',
  },
  {
    href:    '/dashboard/manage',
    icon:    Building2,
    color:   'text-red-400',
    bg:      'bg-red-500/10 border-red-500/20',
    title:   'Ground Management',
    desc:    'Ground admins manage slots, approve bookings, control blacklists.',
    cta:     'Manage ground',
  },
]

const STATS = [
  { value: '847+',   label: 'Teams',    icon: Users,     color: 'text-green-400' },
  { value: '18.4K',  label: 'Players',  icon: Activity,  color: 'text-blue-400'  },
  { value: '3,200+', label: 'Matches',  icon: Calendar,  color: 'text-yellow-400'},
  { value: '156+',   label: 'Grounds',  icon: MapPin,    color: 'text-orange-400'},
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030711] text-white overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#030711]/90 backdrop-blur-sm border-b border-[#1c2432]/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center">
              <Zap size={15} className="text-green-400" />
            </div>
            <span className="font-extrabold text-[15px] tracking-tight">
              Slot<span className="text-green-400">YourGame</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm">
            <Link href="/grounds"               className="text-slate-400 hover:text-white transition-colors font-medium">Find Grounds</Link>
            <Link href="/dashboard/leagues"     className="text-slate-400 hover:text-white transition-colors font-medium">Leagues</Link>
            <Link href="/dashboard/fixtures"    className="text-slate-400 hover:text-white transition-colors font-medium">Fixtures</Link>
            <Link href="/dashboard/marketplace" className="text-slate-400 hover:text-white transition-colors font-medium">Free Agents</Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login"
              className="hidden sm:block text-sm text-slate-300 hover:text-white transition-colors font-semibold px-4 py-2 rounded-lg hover:bg-white/5">
              Sign In
            </Link>
            <Link href="/auth/register"
              className="text-sm font-bold px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black transition-colors flex items-center gap-1.5">
              Get Started <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative hero-bg pt-32 pb-20 px-5 overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-green-500/8 blur-[140px]" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-bold px-4 py-2 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            India&apos;s Cricket Team Management Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.05] mb-6">
            Where grassroots<br />
            <span className="gradient-text">cricket gets serious.</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            Schedule fixtures. Book grounds. Track every run your team scores.
            Built for the millions who play cricket beyond the IPL.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/auth/register"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold bg-green-500 hover:bg-green-400 text-black transition-colors">
              Create Your Team Free <ArrowRight size={17} />
            </Link>
            <Link href="/auth/login"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all text-slate-200">
              Sign In
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            {STATS.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="bg-[#0c1117] border border-[#1c2432] rounded-xl px-4 py-3">
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Icon size={10} /> {label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-5 mt-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500/70" />Free forever</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500/70" />No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500/70" />Works on any device</span>
          </div>
        </div>
      </section>

      {/* ── Feature Pages Grid ───────────────────────────────────── */}
      <section className="py-20 px-5 border-t border-[#1c2432]/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Everything in one place</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Every tool your team needs
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ href, icon: Icon, color, bg, title, desc, cta }) => (
              <Link key={href} href={href}
                className="group bg-[#0c1117] border border-[#1c2432] hover:border-green-500/25 rounded-2xl p-6 transition-all hover:bg-[#0f1520]">
                <div className={`w-11 h-11 rounded-xl ${bg} border flex items-center justify-center mb-4`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-green-300 transition-colors">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{desc}</p>
                <span className={`flex items-center gap-1.5 text-sm font-semibold ${color}`}>
                  {cta} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 px-5 border-t border-[#1c2432]/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to get serious<br />
            <span className="gradient-text">about your cricket?</span>
          </h2>
          <p className="text-slate-400 mb-8">
            Join 847+ teams already managing fixtures, grounds and stats on SlotYourGame.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register"
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base font-bold bg-green-500 hover:bg-green-400 text-black transition-colors">
              Create Your Team Free <ArrowRight size={18} />
            </Link>
            <Link href="/auth/login"
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base font-semibold bg-white/5 border border-white/10 hover:bg-white/8 transition-all text-slate-200">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-[#1c2432]/60 px-5 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center">
              <Zap size={13} className="text-green-400" />
            </div>
            <span className="font-extrabold text-[14px]">Slot<span className="text-green-400">YourGame</span></span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/grounds"               className="hover:text-white transition-colors">Grounds</Link>
            <Link href="/dashboard/fixtures"    className="hover:text-white transition-colors">Fixtures</Link>
            <Link href="/dashboard/leagues"     className="hover:text-white transition-colors">Leagues</Link>
            <Link href="/dashboard/marketplace" className="hover:text-white transition-colors">Free Agents</Link>
            <Link href="/auth/login"            className="hover:text-white transition-colors">Sign In</Link>
          </div>

          <p className="text-xs text-slate-600">Made in India 🇮🇳 · Free forever</p>
        </div>
      </footer>

    </div>
  )
}
