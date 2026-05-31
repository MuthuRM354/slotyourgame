import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RoleTabs from '@/components/landing/RoleTabs'
import {
  Calendar, CheckCircle2, BarChart2, MapPin,
  Trophy, UserSearch, ArrowRight, Zap,
  Users, Star, TrendingUp, Activity,
  ShieldCheck, ChevronRight, Clock,
  Target, Flame, Building2, ListChecks,
  ClipboardCheck, Award, Radio,
} from 'lucide-react'

/* ── Mock data (makes the platform feel alive) ─────────────────── */
const FIXTURES = [
  { id: 1, team1: 'Chennai Warriors', team2: 'Mumbai Strikers',   t1c: 'team-blue',   t2c: 'team-red',    date: 'Sat, 14 Jun', time: '6:00 PM',  venue: 'KD Sports Ground, T.Nagar',          type: 'T20',    confirmed: 9, maybe: 2, status: 'upcoming' },
  { id: 2, team1: 'Delhi Daredevils', team2: 'Pune Panthers',     t1c: 'team-blue',   t2c: 'team-purple', date: 'Sun, 15 Jun', time: '8:00 AM',  venue: 'DDA Sports Complex, Dwarka',         type: 'League', confirmed: 7, maybe: 3, status: 'confirmed' },
  { id: 3, team1: 'Bangalore Bulls',  team2: 'Hyderabad Hawks',   t1c: 'team-red',    t2c: 'team-orange', date: 'Sat, 21 Jun', time: '4:00 PM',  venue: 'Chinnaswamy Nets, Cubbon Park',      type: 'T20',    confirmed: 11,maybe: 1, status: 'upcoming' },
  { id: 4, team1: 'Kolkata Knights',  team2: 'Rajasthan Riders',  t1c: 'team-purple', t2c: 'team-yellow', date: 'Sun, 22 Jun', time: '7:00 AM',  venue: 'Eden Gardens Nets, Maidan',          type: 'Nets',   confirmed: 8, maybe: 2, status: 'upcoming' },
  { id: 5, team1: 'Gujarat Giants',   team2: 'Tamil Nadu Tigers', t1c: 'team-blue',   t2c: 'team-yellow', date: 'Sat, 28 Jun', time: '5:30 PM',  venue: 'Motera Stadium Practice, Ahmedabad', type: 'League', confirmed: 10,maybe: 0, status: 'confirmed' },
]

const GROUNDS = [
  { id: 1, name: 'KD Sports Ground',         location: 'T. Nagar, Chennai',      rating: 4.8, price: 800,  slots: '3 slots today',  available: true,  sport: 'Cricket',          gradient: 'ground-green'  },
  { id: 2, name: 'DDA Sports Complex',        location: 'Dwarka Sector 12, Delhi',rating: 4.6, price: 1200, slots: '2 slots left',   available: true,  sport: 'Cricket · Football',gradient: 'ground-blue'   },
  { id: 3, name: 'Chinnaswamy Nets',          location: 'Cubbon Park, Bangalore', rating: 4.9, price: 600,  slots: 'Fully booked',   available: false, sport: 'Cricket',          gradient: 'ground-purple' },
  { id: 4, name: 'Wankhede Practice Nets',    location: 'Church Gate, Mumbai',    rating: 4.7, price: 1500, slots: '1 slot available',available: true, sport: 'Cricket',          gradient: 'ground-red'    },
]

const LEADERBOARD = [
  { rank: 1, name: 'Ravi Kumar',    team: 'Chennai Warriors', runs: 1247, wkts: 8,  avg: 62.3, matches: 18 },
  { rank: 2, name: 'Arjun Sharma', team: 'Mumbai Strikers',  runs: 983,  wkts: 12, avg: 54.6, matches: 15 },
  { rank: 3, name: 'Mohammed Ali', team: 'Delhi Daredevils', runs: 876,  wkts: 31, avg: 41.7, matches: 20 },
  { rank: 4, name: 'Priya Rajan',  team: 'Bangalore Bulls',  runs: 754,  wkts: 6,  avg: 50.3, matches: 14 },
  { rank: 5, name: 'Karthik Siva', team: 'Hyderabad Hawks',  runs: 698,  wkts: 22, avg: 38.8, matches: 17 },
]

const STATS = [
  { value: '847+',  label: 'Teams',          icon: Users },
  { value: '18.4K', label: 'Players',        icon: Activity },
  { value: '3,200+',label: 'Matches Played', icon: Trophy },
  { value: '156+',  label: 'Grounds',        icon: MapPin },
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

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center glow-green-xs group-hover:bg-green-500/20 transition-all">
              <Zap size={15} className="text-green-400" />
            </div>
            <span className="font-extrabold text-[15px] tracking-tight">
              Slot<span className="text-green-400">YourGame</span>
            </span>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {[['Fixtures', '#fixtures'], ['Grounds', '#grounds'], ['Stats', '#stats'], ['Leagues', '#roles']].map(([label, href]) => (
              <a key={label} href={href} className="text-slate-400 hover:text-white transition-colors font-medium hover-underline">
                {label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/5">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm px-4 py-2 rounded-lg flex items-center gap-1.5">
              Get Started <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center hero-bg pt-16">

        {/* Decorative glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-green-500/5 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-green-500/4 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">

            {/* Left: text */}
            <div>
              {/* Badge */}
              <div className="animate-fade-in inline-flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold px-4 py-2 rounded-full mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                India's Cricket Team Management Platform
              </div>

              {/* Headline */}
              <h1 className="animate-fade-in-up text-5xl sm:text-6xl lg:text-[68px] xl:text-[76px] font-extrabold tracking-tight leading-[1.04] mb-6">
                Where grassroots
                <br />
                <span className="gradient-text text-glow-green">cricket gets serious.</span>
              </h1>

              {/* Sub */}
              <p className="animate-fade-in-up delay-100 text-lg text-slate-400 max-w-xl leading-relaxed mb-10">
                Schedule fixtures. Book grounds. Track every run your team scores.
                Made for the millions who play cricket beyond the IPL.
              </p>

              {/* CTAs */}
              <div className="animate-fade-in-up delay-200 flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/auth/register" className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base">
                  Create Your Team Free <ArrowRight size={17} />
                </Link>
                <Link href="/auth/login" className="btn-ghost flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base">
                  Sign In
                </Link>
              </div>

              {/* Stats row */}
              <div className="animate-fade-in-up delay-300 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STATS.map(({ value, label, icon: Icon }) => (
                  <div key={label} className="glass-light rounded-xl py-3 px-4 border border-[#1c2432]">
                    <p className="text-xl font-extrabold gradient-text">{value}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Icon size={10} /> {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating fixture card + stat card */}
            <div className="hidden lg:block relative animate-fade-in delay-300">

              {/* Main fixture card */}
              <div className="glass-card border border-[#1c2432] rounded-2xl p-5 glow-green-sm animate-float">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="live-dot text-xs font-bold text-slate-400">UPCOMING</span>
                  </div>
                  <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">T20</span>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between mb-1">
                  <div className="text-left">
                    <div className="w-10 h-10 rounded-xl team-blue border flex items-center justify-center font-extrabold text-sm mb-1.5">CW</div>
                    <p className="text-white text-sm font-bold">Chennai</p>
                    <p className="text-slate-500 text-xs">Warriors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">vs</p>
                  </div>
                  <div className="text-right">
                    <div className="w-10 h-10 rounded-xl team-red border flex items-center justify-center font-extrabold text-sm mb-1.5 ml-auto">MS</div>
                    <p className="text-white text-sm font-bold">Mumbai</p>
                    <p className="text-slate-500 text-xs">Strikers</p>
                  </div>
                </div>

                <div className="border-t border-[#1c2432] mt-4 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={11} /> Sat, 14 Jun · 6:00 PM
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={11} /> KD Sports Ground, T.Nagar
                  </div>
                </div>

                {/* RSVP pills */}
                <div className="flex gap-2 mt-3">
                  <span className="flex-1 text-center text-[11px] py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-bold">9 ✓ In</span>
                  <span className="flex-1 text-center text-[11px] py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-semibold">2 ? Maybe</span>
                  <span className="flex-1 text-center text-[11px] py-1.5 rounded-lg bg-[#0f1520] border border-[#1c2432] text-slate-500 font-semibold">1 ✗ Out</span>
                </div>
              </div>

              {/* Floating stat mini card */}
              <div className="absolute -bottom-6 -left-6 glass-card border border-[#1c2432] rounded-xl p-3.5 w-44">
                <p className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider">Top Scorer · This Week</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg team-blue border flex items-center justify-center text-[10px] font-extrabold">RK</div>
                  <div>
                    <p className="text-white text-xs font-bold">Ravi Kumar</p>
                    <p className="text-green-400 font-extrabold text-sm">78 <span className="text-slate-500 font-normal text-[10px]">runs</span></p>
                  </div>
                </div>
              </div>

              {/* Trophy badge */}
              <div className="absolute -top-4 -right-4 glass-card border border-[#1c2432] rounded-xl p-2.5">
                <div className="flex items-center gap-1.5">
                  <Award size={14} className="text-yellow-400" />
                  <span className="text-[10px] font-bold text-slate-300">847 Teams</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker strip ─────────────────────────────────────────── */}
      <div className="border-y border-[#1c2432] bg-[#0c1117] py-3 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap gap-8" style={{width: 'max-content'}}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              {['🏏 India\'s #1 Cricket Management Platform', '⚡ 847+ Active Teams', '🏟️ 156+ Registered Grounds', '🏆 3,200+ Matches Played', '📍 Available across India', '⭐ Trusted by cricketers in 40+ cities'].map((item) => (
                <span key={item} className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-green-500 rounded-full" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Active This Week (horizontal scroll) ──────────────────── */}
      <section className="py-16 px-5" id="fixtures">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="live-dot section-label">Active This Week</span>
            </div>
            <Link href="/auth/register" className="text-xs text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 transition-colors">
              Join to see your fixtures <ArrowRight size={11} />
            </Link>
          </div>

          <div className="scroll-x scroll-fade-right flex gap-4 pb-3">
            {FIXTURES.map((f) => (
              <div key={f.id} className="match-card w-[260px] sm:w-[280px] p-4">
                {/* Type + date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{f.date}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    f.status === 'confirmed'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-[#0f1520] text-slate-500 border-[#1c2432]'
                  }`}>{f.type}</span>
                </div>

                {/* Teams */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <div className={`w-9 h-9 rounded-xl ${f.t1c} border flex items-center justify-center font-extrabold text-xs mb-1`}>
                      {f.team1.slice(0,2).toUpperCase()}
                    </div>
                    <p className="text-white text-xs font-bold truncate">{f.team1}</p>
                  </div>
                  <span className="text-slate-600 text-xs font-bold shrink-0">vs</span>
                  <div className="flex-1 text-right">
                    <div className={`w-9 h-9 rounded-xl ${f.t2c} border flex items-center justify-center font-extrabold text-xs mb-1 ml-auto`}>
                      {f.team2.slice(0,2).toUpperCase()}
                    </div>
                    <p className="text-white text-xs font-bold truncate">{f.team2}</p>
                  </div>
                </div>

                {/* Venue + time */}
                <div className="space-y-1 border-t border-[#1c2432] pt-3">
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-500">
                    <Clock size={9} className="mt-0.5 shrink-0" /> {f.time}
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-500">
                    <MapPin size={9} className="mt-0.5 shrink-0" /> <span className="truncate">{f.venue}</span>
                  </div>
                </div>

                {/* RSVP */}
                <div className="flex gap-1.5 mt-3">
                  <span className="text-[10px] text-green-400 font-semibold">{f.confirmed}✓</span>
                  <span className="text-[10px] text-yellow-400 font-semibold">{f.maybe}?</span>
                </div>
              </div>
            ))}

            {/* Join CTA card */}
            <div className="match-card w-[220px] flex flex-col items-center justify-center p-6 text-center border-dashed">
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
      <section className="py-24 px-5 border-t border-[#1c2432]/40">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: text */}
          <div>
            <p className="section-label mb-4">Fixture Management</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
              Your squad always knows
              <br />
              <span className="gradient-text">when to show up.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg mb-8">
              Create fixtures in 30 seconds. Players get notified, mark their attendance,
              and you see the full RSVP breakdown before you pick your XI.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { icon: Calendar,      text: 'Schedule T20s, nets, and tournaments — all in one place' },
                { icon: ClipboardCheck,text: 'Players RSVP with In / Maybe / Out — one tap on mobile' },
                { icon: Users,         text: 'See your squad availability before you finalise the XI' },
                { icon: CheckCircle2,  text: 'Automatic reminders so no one misses a match again' },
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

          {/* Right: HTML fixture mockup */}
          <div className="space-y-3">
            {/* Fixture card large */}
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
                  <p className="text-xs text-slate-500 mt-1">T20 · 20 Overs</p>
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
                    <p className="text-green-400/70 text-[10px] font-semibold">In</p>
                  </div>
                  <div className="flex-1 bg-yellow-500/8 border border-yellow-500/15 rounded-xl py-2.5 text-center">
                    <p className="text-yellow-400 font-extrabold text-lg">2</p>
                    <p className="text-yellow-400/70 text-[10px] font-semibold">Maybe</p>
                  </div>
                  <div className="flex-1 bg-red-500/8 border border-red-500/15 rounded-xl py-2.5 text-center">
                    <p className="text-red-400 font-extrabold text-lg">1</p>
                    <p className="text-red-400/70 text-[10px] font-semibold">Out</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Player RSVP row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { init: 'RK', name: 'Ravi K.', status: 'in', color: 'team-blue' },
                { init: 'AS', name: 'Arjun S.', status: 'in', color: 'team-green' },
                { init: 'MA', name: 'Mohammed', status: 'maybe', color: 'team-yellow' },
              ].map(({ init, name, status, color }) => (
                <div key={init} className="bg-[#0c1117] border border-[#1c2432] rounded-xl p-2.5 flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${color} border flex items-center justify-center text-[10px] font-extrabold shrink-0`}>{init}</div>
                  <div>
                    <p className="text-white text-[10px] font-semibold">{name}</p>
                    <p className={`text-[9px] font-bold ${status === 'in' ? 'text-green-400' : 'text-yellow-400'}`}>{status === 'in' ? '✓ In' : '? Maybe'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature 2: Ground Booking ─────────────────────────────── */}
      <section className="py-24 px-5 border-t border-[#1c2432]/40" id="grounds">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: ground card grid */}
          <div className="grid grid-cols-2 gap-3">
            {GROUNDS.map((g) => (
              <div key={g.id} className="ground-card">
                {/* Ground image */}
                <div className={`${g.gradient} h-28 relative overflow-hidden`}>
                  {/* Pitch strip overlay */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20%] h-[70%] bg-white/8 rounded-t-sm" />
                  <div className="absolute bottom-2 right-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      g.available
                        ? 'bg-green-500 text-black'
                        : 'bg-red-500/80 text-white'
                    }`}>
                      {g.available ? g.slots : 'Fully Booked'}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/40 text-white backdrop-blur-sm">
                      {g.sport}
                    </span>
                  </div>
                </div>
                {/* Info */}
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
                  <p className="text-green-400 font-extrabold text-sm">₹{g.price}<span className="text-slate-500 font-normal text-[10px]">/hr</span></p>
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
            <p className="text-slate-400 leading-relaxed text-lg mb-8">
              Browse verified cricket grounds near you, check real-time slot availability,
              and book instantly. No WhatsApp messages to ground owners. No waiting.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { icon: MapPin,    text: 'Discover grounds across 40+ cities in India' },
                { icon: Clock,     text: 'Real-time slot availability — see exactly what\'s open' },
                { icon: Star,      text: 'Verified grounds with ratings from real teams' },
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
      <section className="py-24 px-5 border-t border-[#1c2432]/40" id="stats">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: text */}
          <div>
            <p className="section-label mb-4">Player Stats & Rankings</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
              Every run counts.
              <br />
              <span className="gradient-text">Every wicket remembered.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg mb-8">
              Automatic stat tracking after every match. Batting, bowling, and fielding
              stats per season. Player leaderboards that make grassroots cricket feel like the real thing.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { icon: BarChart2,   text: 'Runs, wickets, catches, strike rate, economy — all tracked' },
                { icon: TrendingUp,  text: 'Season-by-season performance graphs for every player' },
                { icon: Trophy,      text: 'City-wide leaderboards to benchmark against top players' },
                { icon: Target,      text: 'Player profiles to showcase your cricket career' },
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

            {/* Column headers */}
            <div className="grid grid-cols-[28px_1fr_64px_64px_56px] px-5 py-2 text-[10px] text-slate-600 font-bold uppercase tracking-wider border-b border-[#1c2432]">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">Runs</span>
              <span className="text-right">Wkts</span>
              <span className="text-right">Mat</span>
            </div>

            {LEADERBOARD.map(({ rank, name, team, runs, wkts, avg, matches }) => (
              <div
                key={rank}
                className="grid grid-cols-[28px_1fr_64px_64px_56px] px-5 py-3.5 border-b border-[#1c2432] hover:bg-[#0f1520] transition-colors items-center"
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
      <section className="py-24 px-5 border-t border-[#1c2432]/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030711] via-[#061409] to-[#030711] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-green-500/5 blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <p className="section-label mb-4">Built for India's cricket community</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-16">
            Numbers that speak for themselves.
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { value: '847+',  unit: 'Teams',          desc: 'Active cricket teams on the platform',    icon: Users,      color: 'text-green-400',  bg: 'bg-green-500/8  border-green-500/15'  },
              { value: '18,400+',unit:'Players',         desc: 'Registered cricketers tracking their game',icon: Activity,   color: 'text-blue-400',   bg: 'bg-blue-500/8   border-blue-500/15'   },
              { value: '3,200+',unit: 'Matches',         desc: 'Matches scheduled and played',            icon: Trophy,     color: 'text-yellow-400', bg: 'bg-yellow-500/8 border-yellow-500/15' },
              { value: '156+',  unit: 'Grounds',         desc: 'Verified cricket grounds listed',         icon: MapPin,     color: 'text-orange-400', bg: 'bg-orange-500/8 border-orange-500/15' },
            ].map(({ value, unit, desc, icon: Icon, color, bg }) => (
              <div key={unit} className={`bg-[#0c1117] border rounded-2xl p-6 text-center ${bg}`}>
                <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={18} className={color} />
                </div>
                <p className={`text-4xl font-extrabold ${color} mb-1`}>{value}</p>
                <p className="text-white font-bold text-sm mb-2">{unit}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-slate-500 text-sm">
            Designed for cricket & made in India 🇮🇳
          </p>
        </div>
      </section>

      {/* ── Role Tabs ────────────────────────────────────────────── */}
      <div id="roles" className="border-t border-[#1c2432]/40">
        <RoleTabs />
      </div>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="py-28 px-5 border-t border-[#1c2432]/40 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
            <Link
              href="/auth/register"
              className="btn-primary flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base animate-pulse-glow"
            >
              Create Your Team Free <ArrowRight size={18} />
            </Link>
            <Link
              href="/auth/login"
              className="btn-ghost flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base"
            >
              Sign In
            </Link>
          </div>

          {/* Trust badges */}
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
            {/* Brand */}
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
                India's cricket team management platform. Designed for sport & made in India 🇮🇳
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">Platform</p>
              <div className="space-y-2">
                {['Fixture Management', 'Ground Booking', 'Player Stats', 'Leagues & Tournaments', 'Free Agent Board'].map((l) => (
                  <p key={l}><Link href="/auth/register" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{l}</Link></p>
                ))}
              </div>
            </div>

            {/* Roles */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">For</p>
              <div className="space-y-2">
                {['Players', 'Team Captains', 'Ground Admins', 'League Organisers'].map((l) => (
                  <p key={l}><Link href="/auth/register" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{l}</Link></p>
                ))}
              </div>
            </div>

            {/* Join */}
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
              Designed for cricket & made in India 🏏
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
