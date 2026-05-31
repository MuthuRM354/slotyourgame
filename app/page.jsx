import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RoleTabs from '@/components/landing/RoleTabs'
import {
  Calendar, CheckCircle2, BarChart2, MapPin,
  Trophy, UserSearch, ArrowRight, Zap,
  Users, Star, TrendingUp, Activity,
  ChevronRight, Clock,
  Target, Flame, Building2,
  ClipboardCheck, Award,
} from 'lucide-react'

/* ── Mock data ──────────────────────────────────────────────────── */
const FIXTURES = [
  { id: 1, team1: 'Chennai Warriors', team2: 'Mumbai Strikers',   t1c: 'team-blue',   t2c: 'team-red',    date: 'Sat, 14 Jun', time: '6:00 PM',  venue: 'KD Sports Ground, T.Nagar',          type: 'T20',    confirmed: 9,  maybe: 2, status: 'upcoming'  },
  { id: 2, team1: 'Delhi Daredevils', team2: 'Pune Panthers',     t1c: 'team-blue',   t2c: 'team-purple', date: 'Sun, 15 Jun', time: '8:00 AM',  venue: 'DDA Sports Complex, Dwarka',         type: 'League', confirmed: 7,  maybe: 3, status: 'confirmed' },
  { id: 3, team1: 'Bangalore Bulls',  team2: 'Hyderabad Hawks',   t1c: 'team-red',    t2c: 'team-orange', date: 'Sat, 21 Jun', time: '4:00 PM',  venue: 'Chinnaswamy Nets, Cubbon Park',      type: 'T20',    confirmed: 11, maybe: 1, status: 'upcoming'  },
  { id: 4, team1: 'Kolkata Knights',  team2: 'Rajasthan Riders',  t1c: 'team-purple', t2c: 'team-yellow', date: 'Sun, 22 Jun', time: '7:00 AM',  venue: 'Eden Gardens Nets, Maidan',          type: 'Nets',   confirmed: 8,  maybe: 2, status: 'upcoming'  },
  { id: 5, team1: 'Gujarat Giants',   team2: 'Tamil Nadu Tigers', t1c: 'team-blue',   t2c: 'team-yellow', date: 'Sat, 28 Jun', time: '5:30 PM',  venue: 'Motera Stadium Practice, Ahmedabad', type: 'League', confirmed: 10, maybe: 0, status: 'confirmed' },
]

const GROUNDS = [
  { id: 1, name: 'KD Sports Ground',      location: 'T. Nagar, Chennai',       rating: 4.8, price: 800,  slots: '3 slots today',   available: true,  gradient: 'ground-green'  },
  { id: 2, name: 'DDA Sports Complex',    location: 'Dwarka Sector 12, Delhi', rating: 4.6, price: 1200, slots: '2 slots left',    available: true,  gradient: 'ground-blue'   },
  { id: 3, name: 'Chinnaswamy Nets',      location: 'Cubbon Park, Bangalore',  rating: 4.9, price: 600,  slots: 'Fully booked',    available: false, gradient: 'ground-purple' },
  { id: 4, name: 'Wankhede Practice Nets',location: 'Church Gate, Mumbai',     rating: 4.7, price: 1500, slots: '1 slot available', available: true, gradient: 'ground-red'    },
]

const LEADERBOARD = [
  { rank: 1, name: 'Ravi Kumar',    team: 'Chennai Warriors', runs: 1247, wkts: 8,  matches: 18 },
  { rank: 2, name: 'Arjun Sharma', team: 'Mumbai Strikers',  runs: 983,  wkts: 12, matches: 15 },
  { rank: 3, name: 'Mohammed Ali', team: 'Delhi Daredevils', runs: 876,  wkts: 31, matches: 20 },
  { rank: 4, name: 'Priya Rajan',  team: 'Bangalore Bulls',  runs: 754,  wkts: 6,  matches: 14 },
  { rank: 5, name: 'Karthik Siva', team: 'Hyderabad Hawks',  runs: 698,  wkts: 22, matches: 17 },
]

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#030711] text-white overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-[#1c2432]/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center glow-green-xs group-hover:bg-green-500/20 transition-all">
              <Zap size={15} className="text-green-400" />
            </div>
            <span className="font-extrabold text-[15px] tracking-tight">
              Slot<span className="text-green-400">YourGame</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            {[['Fixtures', '#fixtures'], ['Grounds', '#grounds'], ['Stats', '#stats'], ['Roles', '#roles']].map(([label, href]) => (
              <a key={label} href={href} className="text-slate-400 hover:text-white transition-colors font-medium hover-underline">
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden sm:block text-sm text-slate-300 hover:text-white transition-colors font-semibold px-4 py-2 rounded-lg hover:bg-white/5">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm px-4 py-2 rounded-lg flex items-center gap-1.5">
              Get Started <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative hero-bg pt-28 pb-16 px-5 overflow-hidden">

        {/* Green glow orb - top center */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-green-500/8 blur-[160px]" />
        {/* Green glow orb - right */}
        <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[700px] rounded-full bg-green-500/4 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_440px] gap-10 items-start">

            {/* Left: text block */}
            <div>
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2.5 bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-bold px-4 py-2 rounded-full mb-7 animate-fade-in">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                India's Cricket Team Management Platform
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-[68px] xl:text-[76px] font-extrabold tracking-tight leading-[1.04] mb-6 animate-fade-in-up">
                Where grassroots
                <br />
                <span className="gradient-text text-glow-green">cricket gets serious.</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed mb-8 animate-fade-in-up delay-100">
                Schedule fixtures. Book grounds. Track every run your team scores.
                Built for the millions who play cricket beyond the IPL.
              </p>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-fade-in-up delay-200">
                <Link href="/auth/register" className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold">
                  Create Your Team Free <ArrowRight size={17} />
                </Link>
                <Link href="/auth/login" className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all text-slate-200">
                  Sign In
                </Link>
              </div>

              {/* Community stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up delay-300">
                {[
                  { value: '847+',   sub: 'Teams',    icon: Users,     color: 'text-green-400' },
                  { value: '18.4K',  sub: 'Players',  icon: Activity,  color: 'text-blue-400'  },
                  { value: '3,200+', sub: 'Matches',  icon: Trophy,    color: 'text-yellow-400'},
                  { value: '156+',   sub: 'Grounds',  icon: MapPin,    color: 'text-orange-400'},
                ].map(({ value, sub, icon: Icon, color }) => (
                  <div key={sub} className="bg-[#0c1117] border border-[#1c2432] rounded-xl px-4 py-3 hover:border-[#252f42] transition-colors">
                    <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Icon size={10} /> {sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Trust strip */}
              <div className="flex items-center gap-4 mt-6 text-xs text-slate-600 animate-fade-in-up delay-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500/70" /> Free forever</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500/70" /> No credit card</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500/70" /> Works on any device</span>
              </div>
            </div>

            {/* Right: fixture card */}
            <div className="hidden lg:block animate-fade-in delay-200">

              {/* Trophy badge — top right of card column */}
              <div className="flex justify-end mb-3">
                <div className="glass-card border border-[#1c2432] rounded-xl px-3 py-2 flex items-center gap-1.5">
                  <Award size={13} className="text-yellow-400" />
                  <span className="text-[11px] font-bold text-slate-300">847 Active Teams</span>
                </div>
              </div>

              {/* Main fixture card */}
              <div className="glass-card border border-[#1c2432] rounded-2xl p-5 glow-green-sm animate-float">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="live-dot text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming</span>
                  </div>
                  <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">T20</span>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="text-left flex-1">
                    <div className="w-11 h-11 rounded-xl team-blue border flex items-center justify-center font-extrabold text-sm mb-2">CW</div>
                    <p className="text-white text-sm font-bold">Chennai</p>
                    <p className="text-slate-500 text-xs">Warriors</p>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">vs</p>
                    <p className="text-[9px] text-slate-600 mt-1">T20 · 20 Overs</p>
                  </div>
                  <div className="text-right flex-1">
                    <div className="w-11 h-11 rounded-xl team-red border flex items-center justify-center font-extrabold text-sm mb-2 ml-auto">MS</div>
                    <p className="text-white text-sm font-bold">Mumbai</p>
                    <p className="text-slate-500 text-xs">Strikers</p>
                  </div>
                </div>

                {/* Venue & time */}
                <div className="bg-[#0f1520] rounded-xl px-3 py-2.5 space-y-1.5 mb-4 border border-[#1c2432]">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={11} className="text-slate-600 shrink-0" />
                    Sat, 14 Jun · 6:00 PM
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={11} className="text-slate-600 shrink-0" />
                    KD Sports Ground, T.Nagar
                  </div>
                </div>

                {/* RSVP */}
                <div className="mb-1">
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-2">Squad RSVP · 12/15 responded</p>
                  <div className="flex gap-2">
                    <div className="flex-1 text-center bg-green-500/8 border border-green-500/15 rounded-xl py-2">
                      <p className="text-green-400 font-extrabold text-base">9</p>
                      <p className="text-green-400/60 text-[9px] font-semibold">In</p>
                    </div>
                    <div className="flex-1 text-center bg-yellow-500/8 border border-yellow-500/15 rounded-xl py-2">
                      <p className="text-yellow-400 font-extrabold text-base">2</p>
                      <p className="text-yellow-400/60 text-[9px] font-semibold">Maybe</p>
                    </div>
                    <div className="flex-1 text-center bg-red-500/8 border border-red-500/15 rounded-xl py-2">
                      <p className="text-red-400 font-extrabold text-base">1</p>
                      <p className="text-red-400/60 text-[9px] font-semibold">Out</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Scorer mini-card */}
              <div className="mt-3 glass-card border border-[#1c2432] rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold mb-1">Top Scorer · This Week</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg team-blue border flex items-center justify-center text-[10px] font-extrabold">RK</div>
                    <div>
                      <p className="text-white text-xs font-bold">Ravi Kumar</p>
                      <p className="text-green-400 font-extrabold text-sm">78 <span className="text-slate-500 font-normal text-[10px]">runs</span></p>
                    </div>
                  </div>
                </div>
                <TrendingUp size={16} className="text-green-400/50" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Ticker strip ─────────────────────────────────────────── */}
      <div className="border-y border-[#1c2432] bg-[#0c1117] py-3 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap" style={{width: 'max-content'}}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-5">
              {[
                '🏏 India\'s #1 Cricket Management Platform',
                '⚡ 847+ Active Teams',
                '🏟️ 156+ Registered Grounds',
                '🏆 3,200+ Matches Played',
                '📍 Available across India',
                '⭐ Trusted by cricketers in 40+ cities',
              ].map((item) => (
                <span key={item} className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-500/60 rounded-full flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Active This Week ──────────────────────────────────────── */}
      <section className="py-14 px-5" id="fixtures">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="live-dot section-label">Active This Week</span>
            </div>
            <Link href="/auth/register" className="text-xs text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 transition-colors">
              Join to see your fixtures <ArrowRight size={11} />
            </Link>
          </div>

          <div className="scroll-x scroll-fade-right flex gap-4 pb-3">
            {FIXTURES.map((f) => (
              <div key={f.id} className="match-card w-[260px] sm:w-[275px] p-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{f.date}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    f.status === 'confirmed'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-[#0f1520] text-slate-500 border-[#1c2432]'
                  }`}>{f.type}</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <div className={`w-9 h-9 rounded-xl ${f.t1c} border flex items-center justify-center font-extrabold text-xs mb-1.5`}>
                      {f.team1.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-white text-xs font-bold truncate">{f.team1}</p>
                  </div>
                  <span className="text-slate-600 text-xs font-bold shrink-0">vs</span>
                  <div className="flex-1 text-right">
                    <div className={`w-9 h-9 rounded-xl ${f.t2c} border flex items-center justify-center font-extrabold text-xs mb-1.5 ml-auto`}>
                      {f.team2.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-white text-xs font-bold truncate">{f.team2}</p>
                  </div>
                </div>

                <div className="space-y-1 border-t border-[#1c2432] pt-3">
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-500">
                    <Clock size={9} className="mt-0.5 shrink-0" /> {f.time}
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-500">
                    <MapPin size={9} className="mt-0.5 shrink-0" />
                    <span className="truncate">{f.venue}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-3">
                  <span className="text-[10px] text-green-400 font-semibold">{f.confirmed} In</span>
                  <span className="text-[10px] text-yellow-400 font-semibold">{f.maybe} Maybe</span>
                </div>
              </div>
            ))}

            {/* CTA card */}
            <div className="match-card w-[210px] flex flex-col items-center justify-center p-6 text-center flex-shrink-0 border-dashed">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
                <Calendar size={20} className="text-green-400" />
              </div>
              <p className="text-white text-sm font-bold mb-1">Your fixture here</p>
              <p className="text-slate-500 text-xs mb-4">Schedule your team's matches</p>
              <Link href="/auth/register" className="btn-outline-green text-xs px-4 py-2 rounded-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature 1: Fixture Management ─────────────────────────── */}
      <section className="py-20 px-5 border-t border-[#1c2432]/40">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          <div>
            <p className="section-label mb-4">Fixture Management</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
              Your squad always knows
              <br />
              <span className="gradient-text">when to show up.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-base mb-7">
              Create fixtures in 30 seconds. Players get notified, mark their attendance,
              and you see the full RSVP breakdown before you pick your XI.
            </p>
            <div className="space-y-3.5 mb-8">
              {[
                { icon: Calendar,       text: 'Schedule T20s, nets, and tournaments — all in one place' },
                { icon: ClipboardCheck, text: 'Players RSVP with In / Maybe / Out — one tap on mobile' },
                { icon: Users,          text: 'See your squad availability before you finalise the XI' },
                { icon: CheckCircle2,   text: 'Automatic reminders so no one misses a match again' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={12} className="text-green-400" />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/register" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm">
              Schedule Your First Fixture <ArrowRight size={15} />
            </Link>
          </div>

          {/* HTML mockup */}
          <div className="space-y-3">
            <div className="bg-[#0c1117] border border-[#1c2432] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-green-400" />
                  <span className="text-sm font-semibold text-white">Upcoming Fixture</span>
                </div>
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full font-bold">Confirmed</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="w-12 h-12 rounded-xl team-blue border flex items-center justify-center font-extrabold mb-2">CW</div>
                  <p className="text-white font-bold text-sm">Chennai Warriors</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-slate-600 font-bold text-xs uppercase tracking-widest">vs</p>
                  <p className="text-xs text-slate-500 mt-1">T20</p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 rounded-xl team-red border flex items-center justify-center font-extrabold mb-2 ml-auto">MS</div>
                  <p className="text-white font-bold text-sm">Mumbai Strikers</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 bg-[#0f1520] rounded-lg px-3 py-2 border border-[#1c2432]">
                  <Clock size={11} /> Sat, 14 Jun · 6:00 PM
                </div>
                <div className="flex items-center gap-1.5 bg-[#0f1520] rounded-lg px-3 py-2 border border-[#1c2432]">
                  <MapPin size={11} /> KD Sports Ground
                </div>
              </div>

              <div className="border-t border-[#1c2432] pt-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">Squad RSVP · 12/15 responded</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-green-500/8 border border-green-500/15 rounded-xl py-2.5 text-center">
                    <p className="text-green-400 font-extrabold text-lg">9</p>
                    <p className="text-green-400/60 text-[10px] font-semibold">In</p>
                  </div>
                  <div className="flex-1 bg-yellow-500/8 border border-yellow-500/15 rounded-xl py-2.5 text-center">
                    <p className="text-yellow-400 font-extrabold text-lg">2</p>
                    <p className="text-yellow-400/60 text-[10px] font-semibold">Maybe</p>
                  </div>
                  <div className="flex-1 bg-red-500/8 border border-red-500/15 rounded-xl py-2.5 text-center">
                    <p className="text-red-400 font-extrabold text-lg">1</p>
                    <p className="text-red-400/60 text-[10px] font-semibold">Out</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { init: 'RK', name: 'Ravi K.',  status: 'in',    color: 'team-blue'   },
                { init: 'AS', name: 'Arjun S.', status: 'in',    color: 'team-green'  },
                { init: 'MA', name: 'Mohammed', status: 'maybe', color: 'team-yellow' },
              ].map(({ init, name, status, color }) => (
                <div key={init} className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-2.5 flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${color} border flex items-center justify-center text-[10px] font-extrabold shrink-0`}>{init}</div>
                  <div>
                    <p className="text-white text-[10px] font-semibold">{name}</p>
                    <p className={`text-[9px] font-bold ${status === 'in' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {status === 'in' ? 'In' : 'Maybe'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature 2: Ground Booking ─────────────────────────────── */}
      <section className="py-20 px-5 border-t border-[#1c2432]/40" id="grounds">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          {/* Left: ground cards grid */}
          <div className="grid grid-cols-2 gap-3">
            {GROUNDS.map((g) => (
              <div key={g.id} className="ground-card">
                <div className={`${g.gradient} h-28 relative overflow-hidden`}>
                  {/* Pitch crease lines */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[18%] h-[65%] bg-white/10 rounded-t-sm" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[35%] h-px bg-white/20" />
                  <div className="absolute bottom-2 right-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      g.available ? 'bg-green-500 text-black' : 'bg-red-500/80 text-white'
                    }`}>
                      {g.available ? g.slots : 'Fully Booked'}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="text-white text-xs font-bold leading-tight">{g.name}</p>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star size={9} fill="#f59e0b" className="text-yellow-400" />
                      <span className="text-[10px] text-yellow-400 font-bold">{g.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2">
                    <MapPin size={9} /> {g.location}
                  </div>
                  <p className="text-green-400 font-extrabold text-sm">
                    ₹{g.price}<span className="text-slate-500 font-normal text-[10px]">/hr</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: text */}
          <div>
            <p className="section-label mb-4">Ground Booking</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
              Book cricket grounds
              <br />
              <span className="gradient-text">in seconds, not calls.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-base mb-7">
              Browse verified cricket grounds near you, check real-time slot availability,
              and book instantly. No WhatsApp messages to ground owners. No waiting.
            </p>
            <div className="space-y-3.5 mb-8">
              {[
                { icon: MapPin,       text: 'Discover grounds across 40+ cities in India' },
                { icon: Clock,        text: 'Real-time slot availability — see exactly what\'s open' },
                { icon: Star,         text: 'Verified grounds with ratings from real teams' },
                { icon: CheckCircle2, text: 'Ground admins confirm or reject bookings on the platform' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={12} className="text-green-400" />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/register" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm">
              Find a Ground <MapPin size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature 3: Player Stats + Leaderboard ─────────────────── */}
      <section className="py-20 px-5 border-t border-[#1c2432]/40" id="stats">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          {/* Left: text */}
          <div>
            <p className="section-label mb-4">Player Stats &amp; Rankings</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
              Every run counts.
              <br />
              <span className="gradient-text">Every wicket remembered.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-base mb-7">
              Automatic stat tracking after every match. Batting, bowling, and fielding
              stats per season. Player leaderboards that make grassroots cricket feel like the real thing.
            </p>
            <div className="space-y-3.5 mb-8">
              {[
                { icon: BarChart2,  text: 'Runs, wickets, catches, strike rate, economy — all tracked' },
                { icon: TrendingUp, text: 'Season-by-season performance graphs for every player' },
                { icon: Trophy,     text: 'City-wide leaderboards to benchmark against top players' },
                { icon: Target,     text: 'Player profiles to showcase your cricket career' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={12} className="text-green-400" />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/register" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm">
              Track Your Stats <BarChart2 size={15} />
            </Link>
          </div>

          {/* Right: leaderboard */}
          <div className="bg-[#0c1117] border border-[#1c2432] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1c2432]">
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-yellow-400" />
                <span className="text-sm font-bold text-white">Season Leaderboard</span>
              </div>
              <span className="text-xs text-slate-600">T20 · Jun 2026</span>
            </div>

            <div className="grid grid-cols-[28px_1fr_60px_60px_48px] px-5 py-2 text-[10px] text-slate-600 font-bold uppercase tracking-wider border-b border-[#1c2432]">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">Runs</span>
              <span className="text-right">Wkts</span>
              <span className="text-right">Mat</span>
            </div>

            {LEADERBOARD.map(({ rank, name, team, runs, wkts, matches }) => (
              <div
                key={rank}
                className="grid grid-cols-[28px_1fr_60px_60px_48px] px-5 py-3 border-b border-[#1c2432] hover:bg-[#0f1520] transition-colors items-center"
              >
                <span className={`text-sm font-extrabold ${
                  rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : rank === 3 ? 'rank-bronze' : 'text-slate-600'
                }`}>
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                </span>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{name}</p>
                  <p className="text-slate-500 text-[10px] truncate">{team}</p>
                </div>
                <span className="text-right font-extrabold text-blue-400 text-sm">{runs.toLocaleString()}</span>
                <span className="text-right font-bold text-yellow-400 text-sm">{wkts}</span>
                <span className="text-right text-slate-500 text-xs">{matches}</span>
              </div>
            ))}

            <div className="px-5 py-4 text-center">
              <Link href="/auth/register" className="text-xs text-green-400 hover:text-green-300 font-semibold transition-colors">
                See full leaderboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community numbers ─────────────────────────────────────── */}
      <section className="py-20 px-5 border-t border-[#1c2432]/40 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030711] via-[#061409] to-[#030711]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-green-500/6 blur-[100px]" />

        <div className="relative max-w-5xl mx-auto text-center">
          <p className="section-label mb-3">Built for India's cricket community</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-12">
            Numbers that speak for themselves.
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '847+',    unit: 'Teams',   desc: 'Active cricket teams',           icon: Users,     color: 'text-green-400',  bg: 'border-green-500/15'  },
              { value: '18,400+', unit: 'Players', desc: 'Registered cricketers',          icon: Activity,  color: 'text-blue-400',   bg: 'border-blue-500/15'   },
              { value: '3,200+',  unit: 'Matches', desc: 'Matches scheduled and played',   icon: Trophy,    color: 'text-yellow-400', bg: 'border-yellow-500/15' },
              { value: '156+',    unit: 'Grounds', desc: 'Verified cricket grounds',       icon: MapPin,    color: 'text-orange-400', bg: 'border-orange-500/15' },
            ].map(({ value, unit, desc, icon: Icon, color, bg }) => (
              <div key={unit} className={`bg-[#0c1117] border ${bg} rounded-2xl p-6 text-center`}>
                <Icon size={20} className={`${color} mx-auto mb-3`} />
                <p className={`text-4xl font-extrabold ${color} mb-1`}>{value}</p>
                <p className="text-white font-bold text-sm mb-1.5">{unit}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-slate-500 text-sm">
            Designed for cricket &amp; made in India 🇮🇳
          </p>
        </div>
      </section>

      {/* ── Role Tabs ────────────────────────────────────────────── */}
      <div id="roles" className="border-t border-[#1c2432]/40">
        <RoleTabs />
      </div>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-5 border-t border-[#1c2432]/40 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[700px] h-[500px] rounded-full bg-green-500/6 blur-[120px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold px-4 py-2 rounded-full mb-8">
            <Flame size={12} /> Free for all cricket clubs · No installs needed
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5">
            Ready to play
            <br />
            <span className="gradient-text">smarter cricket?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Join 847+ cricket teams already managing their game on SlotYourGame.
            Free forever, no credit card, works on any device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base animate-pulse-glow">
              Create Your Team Free <ArrowRight size={18} />
            </Link>
            <Link href="/auth/login" className="btn-ghost flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base">
              Sign In
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 text-slate-600 text-xs">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> Free forever</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> Works on any device</span>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-[#1c2432]/60 py-12 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center">
                  <Zap size={14} className="text-green-400" />
                </div>
                <span className="font-extrabold text-[15px]">
                  Slot<span className="text-green-400">YourGame</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                India's cricket team management platform. Designed for sport &amp; made in India 🇮🇳
              </p>
            </div>

            <div>
              <p className="text-white font-semibold text-sm mb-3">Platform</p>
              <div className="space-y-2">
                {['Fixture Management', 'Ground Booking', 'Player Stats', 'Leagues & Tournaments', 'Free Agent Board'].map((l) => (
                  <p key={l}><Link href="/auth/register" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{l}</Link></p>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white font-semibold text-sm mb-3">For</p>
              <div className="space-y-2">
                {['Players', 'Team Captains', 'Ground Admins', 'League Organisers'].map((l) => (
                  <p key={l}><Link href="/auth/register" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{l}</Link></p>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white font-semibold text-sm mb-3">Get Started</p>
              <div className="space-y-2 mb-4">
                {[['Sign In', '/auth/login'], ['Create Account', '/auth/register']].map(([l, h]) => (
                  <p key={l}><Link href={h} className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{l}</Link></p>
                ))}
              </div>
              <Link href="/auth/register" className="btn-outline-green text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1.5">
                Join Free <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="border-t border-[#1c2432] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-xs">
              © {new Date().getFullYear()} SlotYourGame · All rights reserved
            </p>
            <p className="text-slate-600 text-xs">
              Designed for cricket &amp; made in India 🏏
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
