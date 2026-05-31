import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar, CheckCircle2, BarChart2, MapPin,
  Trophy, UserSearch, ShieldCheck, ArrowRight, Zap,
  Users, Star, TrendingUp, Globe, ChevronRight,
} from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#030711] text-white overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-[#1c2432]/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3.5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center group-hover:border-green-500/50 group-hover:bg-green-500/20 transition-all glow-green-xs">
              <Zap size={16} className="text-green-400" />
            </div>
            <span className="text-white font-bold text-[15px] tracking-tight">
              Slot<span className="text-green-400">YourGame</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/5"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="btn-primary text-sm px-4 py-2 rounded-lg flex items-center gap-1.5"
            >
              Get Started <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center hero-bg-grid pt-20">

        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green-500/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-green-500/4 blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 py-32 text-center w-full">

          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-4 py-2 rounded-full mb-10 hover:bg-green-500/15 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Built for cricket teams across India
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up text-5xl sm:text-6xl lg:text-[76px] font-extrabold tracking-tight leading-[1.05] mb-6">
            Stop managing cricket
            <br />
            <span className="gradient-text text-glow-green">on WhatsApp.</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up delay-100 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            SlotYourGame gives your team a proper home — fixtures, attendance,
            ground bookings, stats, and free agent recruiting. All in one place.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-200 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/auth/register"
              className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-xl text-base w-full sm:w-auto justify-center"
            >
              Create your team free <ArrowRight size={17} />
            </Link>
            <Link
              href="/auth/login"
              className="btn-ghost flex items-center gap-2 px-8 py-3.5 rounded-xl text-base w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </div>

          {/* Role pills */}
          <div className="animate-fade-in-up delay-300 flex flex-wrap justify-center gap-2 mb-14">
            {[
              { label: 'Players', color: 'bg-blue-500/8 border-blue-500/20 text-blue-400' },
              { label: 'Captains', color: 'bg-green-500/8 border-green-500/20 text-green-400' },
              { label: 'Ground Admins', color: 'bg-orange-500/8 border-orange-500/20 text-orange-400' },
              { label: 'League Admins', color: 'bg-purple-500/8 border-purple-500/20 text-purple-400' },
            ].map(({ label, color }) => (
              <span key={label} className={`border px-3.5 py-1.5 rounded-full text-xs font-medium ${color}`}>
                {label}
              </span>
            ))}
          </div>

          {/* Stats strip */}
          <div className="animate-fade-in-up delay-400 grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { value: '500+', label: 'Teams' },
              { value: '10k+', label: 'Players' },
              { value: '100%', label: 'Free' },
            ].map(({ value, label }) => (
              <div key={label} className="glass-light rounded-2xl py-4 px-3">
                <p className="text-xl font-bold gradient-text">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────────── */}
      <section className="py-28 px-5">
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              One platform, every role
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg leading-relaxed">
              From scheduling a match to tracking season stats — everything built for the way cricket clubs actually work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Calendar,
                iconColor: 'text-green-400',
                iconBg: 'bg-green-500/12 border-green-500/20',
                glowColor: 'rgba(34,197,94,0.08)',
                borderHover: 'hover:border-green-500/30',
                title: 'Fixture Management',
                desc: 'Schedule matches, net sessions, and tournaments. Separate tabs for upcoming and past fixtures with full history.',
              },
              {
                icon: CheckCircle2,
                iconColor: 'text-blue-400',
                iconBg: 'bg-blue-500/12 border-blue-500/20',
                glowColor: 'rgba(59,130,246,0.08)',
                borderHover: 'hover:border-blue-500/30',
                title: 'Attendance RSVP',
                desc: "Players mark In / Can't Make It / Maybe for every fixture. Captains see the count instantly before selection.",
              },
              {
                icon: MapPin,
                iconColor: 'text-yellow-400',
                iconBg: 'bg-yellow-500/12 border-yellow-500/20',
                glowColor: 'rgba(234,179,8,0.08)',
                borderHover: 'hover:border-yellow-500/30',
                title: 'Ground Booking',
                desc: 'Browse available grounds, pick a slot, and book in seconds. Ground admins approve or reject with one click.',
              },
              {
                icon: BarChart2,
                iconColor: 'text-purple-400',
                iconBg: 'bg-purple-500/12 border-purple-500/20',
                glowColor: 'rgba(168,85,247,0.08)',
                borderHover: 'hover:border-purple-500/30',
                title: 'Player Stats',
                desc: 'Track runs, wickets, catches, and strike rates per match. Visual charts per season to benchmark performance.',
              },
              {
                icon: UserSearch,
                iconColor: 'text-pink-400',
                iconBg: 'bg-pink-500/12 border-pink-500/20',
                glowColor: 'rgba(236,72,153,0.08)',
                borderHover: 'hover:border-pink-500/30',
                title: 'Free Agent Board',
                desc: 'Players post availability by date and city. Captains browse the board and contact players directly.',
              },
              {
                icon: Trophy,
                iconColor: 'text-orange-400',
                iconBg: 'bg-orange-500/12 border-orange-500/20',
                glowColor: 'rgba(249,115,22,0.08)',
                borderHover: 'hover:border-orange-500/30',
                title: 'Leagues & Standings',
                desc: 'Full points tables with NRR, match results, and bracket tracking for your league tournament.',
              },
            ].map(({ icon: Icon, iconColor, iconBg, glowColor, borderHover, title, desc }) => (
              <div
                key={title}
                className={`group bg-[#0c1117] border border-[#1c2432] ${borderHover} rounded-2xl p-6 card-hover`}
                style={{ '--hover-glow': glowColor }}
              >
                <div className={`w-11 h-11 rounded-xl border ${iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <h3 className="font-semibold text-white text-[15px] mb-2 group-hover:text-green-300 transition-colors">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role breakdown ────────────────────────────────────────── */}
      <section className="py-24 px-5 border-t border-[#1c2432]/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Designed for every role</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              One app, four powerful roles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                role: 'Player',
                emoji: '🏏',
                gradient: 'from-blue-500/8 to-transparent',
                border: 'border-blue-500/20',
                badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                checkColor: 'text-blue-500',
                perks: ['Mark match attendance', 'View your season stats', 'Post free availability', 'Browse cricket grounds'],
              },
              {
                role: 'Captain',
                emoji: '⚡',
                gradient: 'from-green-500/8 to-transparent',
                border: 'border-green-500/25',
                badge: 'bg-green-500/10 text-green-400 border-green-500/20',
                checkColor: 'text-green-500',
                perks: ['Schedule fixtures', 'See squad RSVP live', 'Book grounds easily', 'Recruit free agents'],
              },
              {
                role: 'Ground Admin',
                emoji: '🏟️',
                gradient: 'from-orange-500/8 to-transparent',
                border: 'border-orange-500/20',
                badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                checkColor: 'text-orange-500',
                perks: ['Approve/reject bookings', 'Manage slot calendar', 'Blacklist problem teams', 'View booking history'],
              },
              {
                role: 'League Admin',
                emoji: '🏆',
                gradient: 'from-purple-500/8 to-transparent',
                border: 'border-purple-500/20',
                badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                checkColor: 'text-purple-500',
                perks: ['Create & manage leagues', 'Update live standings', 'Schedule all matches', 'View all teams & stats'],
              },
            ].map(({ role, emoji, gradient, border, badge, checkColor, perks }) => (
              <div
                key={role}
                className={`relative overflow-hidden border ${border} rounded-2xl p-5 bg-gradient-to-b ${gradient} bg-[#0c1117] card-hover`}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-xl">{emoji}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badge}`}>
                    {role}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {perks.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <CheckCircle2 size={14} className={`${checkColor} mt-0.5 flex-shrink-0 opacity-80`} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof / trust strip ────────────────────────────── */}
      <section className="py-16 px-5 border-t border-[#1c2432]/60">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-8 sm:p-10 text-center glow-green-sm border border-[#1c2432]">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#22c55e" className="text-green-500" />
              ))}
            </div>
            <p className="text-lg sm:text-xl text-white font-medium italic leading-relaxed max-w-xl mx-auto">
              "Finally, our team stops missing fixtures because someone forgot to check WhatsApp. SlotYourGame solved our coordination nightmare."
            </p>
            <div className="flex items-center justify-center gap-2.5 mt-5">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <span className="text-green-400 text-xs font-bold">RC</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">Rahul Chandra</p>
                <p className="text-xs text-slate-500">Captain, Chennai Warriors CC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-28 px-5 relative overflow-hidden">
        {/* BG glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] rounded-full bg-green-500/6 blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <Globe size={12} />
            Free for all cricket clubs · No installs
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Ready to level up
            <br />
            <span className="gradient-text">your cricket team?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Join hundreds of cricket clubs already using SlotYourGame. Free forever, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="btn-primary flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base animate-pulse-glow"
            >
              Create a free account <ArrowRight size={18} />
            </Link>
            <Link
              href="/auth/login"
              className="btn-ghost flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-[#1c2432]/60 py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-green-500/15 border border-green-500/25 flex items-center justify-center">
              <Zap size={12} className="text-green-400" />
            </div>
            <span className="text-sm font-semibold text-slate-400">
              Slot<span className="text-green-400">YourGame</span>
            </span>
          </div>
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} SlotYourGame · Built for cricket teams in India
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <Link href="/auth/login" className="hover:text-slate-400 transition-colors">Sign In</Link>
            <Link href="/auth/register" className="hover:text-slate-400 transition-colors">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
