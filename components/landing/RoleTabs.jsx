'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ClipboardCheck, BarChart2, UserSearch, MapPin,
  Calendar, Users, BookOpen, Trophy,
  Building2, ListChecks, ShieldAlert,
  ArrowRight, CheckCircle2,
} from 'lucide-react'

const ROLES = [
  { key: 'player',       label: '🏏 Player',       short: 'Player' },
  { key: 'captain',      label: '⚡ Captain',       short: 'Captain' },
  { key: 'ground_admin', label: '🏟️ Ground Admin',  short: 'Ground' },
  { key: 'league_admin', label: '🏆 League Admin',  short: 'League' },
]

const ROLE_CONTENT = {
  player: {
    headline: 'Never miss a match again.',
    subheadline: 'One tap to mark your attendance. Track every run you score across the season.',
    color: 'text-blue-400',
    border: 'border-blue-500/25',
    bg: 'bg-blue-500/8',
    activeBg: 'bg-blue-500/15 border-blue-500/30',
    features: [
      { icon: ClipboardCheck, title: 'One-tap RSVP', desc: 'In · Maybe · Out — mark availability for every fixture instantly' },
      { icon: BarChart2,      title: 'Season Stats', desc: 'Runs, wickets, strike rate, and economy tracked every match' },
      { icon: UserSearch,     title: 'Free Agent Board', desc: 'Post your availability and get spotted by captains across the city' },
      { icon: MapPin,         title: 'Ground Discovery', desc: 'Find cricket grounds near you with real-time slot availability' },
    ],
    stat: { value: '18,400+', label: 'Active Players' },
    cta: 'Join as a Player',
  },
  captain: {
    headline: 'Run your team like a pro.',
    subheadline: 'Schedule fixtures, track squad availability, book grounds, and recruit free agents — all from one dashboard.',
    color: 'text-green-400',
    border: 'border-green-500/25',
    bg: 'bg-green-500/8',
    activeBg: 'bg-green-500/15 border-green-500/30',
    features: [
      { icon: Calendar,   title: 'Fixture Scheduling', desc: 'Create matches, nets, and tournaments. Players get notified instantly' },
      { icon: Users,      title: 'Squad RSVP View', desc: 'See who\'s in, who\'s out, and pick your XI with confidence' },
      { icon: MapPin,     title: 'Ground Booking', desc: 'Browse and book cricket grounds with availability calendar' },
      { icon: UserSearch, title: 'Recruit Free Agents', desc: 'Browse available players in your city by date and skill' },
    ],
    stat: { value: '847+', label: 'Active Captains' },
    cta: 'Register Your Team',
  },
  ground_admin: {
    headline: 'Fill every slot. Zero hassle.',
    subheadline: 'Manage your cricket ground\'s bookings from a single dashboard. Approve, reject, and block teams in seconds.',
    color: 'text-orange-400',
    border: 'border-orange-500/25',
    bg: 'bg-orange-500/8',
    activeBg: 'bg-orange-500/15 border-orange-500/30',
    features: [
      { icon: ListChecks,  title: 'Booking Requests', desc: 'Approve or reject booking requests as they come in, instantly' },
      { icon: Building2,   title: 'Ground Management', desc: 'Set time slots, pricing, ground details, and availability' },
      { icon: ShieldAlert, title: 'Team Blacklist', desc: 'Block no-show teams from booking your ground again' },
      { icon: BarChart2,   title: 'Booking History', desc: 'View all past and upcoming bookings with team details' },
    ],
    stat: { value: '156+', label: 'Registered Grounds' },
    cta: 'List Your Ground',
  },
  league_admin: {
    headline: 'Organise leagues. Own the season.',
    subheadline: 'Create full tournaments, manage standings, schedule every fixture, and track results across all teams.',
    color: 'text-purple-400',
    border: 'border-purple-500/25',
    bg: 'bg-purple-500/8',
    activeBg: 'bg-purple-500/15 border-purple-500/30',
    features: [
      { icon: Trophy,         title: 'League Creation', desc: 'Create group-stage or knockout tournaments in minutes' },
      { icon: BarChart2,      title: 'Live Standings', desc: 'Automatic points table with NRR, wins, losses, and net runs' },
      { icon: Calendar,       title: 'Fixture Scheduling', desc: 'Schedule all matches and share fixture lists with all teams' },
      { icon: Users,          title: 'Team Management', desc: 'Manage all participating teams, rosters, and contact details' },
    ],
    stat: { value: '320+', label: 'Leagues Organised' },
    cta: 'Create a League',
  },
}

export default function RoleTabs() {
  const [active, setActive] = useState('player')
  const content = ROLE_CONTENT[active]

  return (
    <section className="py-28 px-5">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">Built for every role</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            One platform.<br />
            <span className="gradient-text">Every player's home.</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center flex-wrap mb-10">
          {ROLES.map((r) => {
            const isActive = active === r.key
            const c = ROLE_CONTENT[r.key]
            return (
              <button
                key={r.key}
                onClick={() => setActive(r.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                  isActive
                    ? `${c.activeBg} ${c.color}`
                    : 'border-[#1c2432] text-slate-500 hover:text-slate-300 hover:border-[#252f42] bg-transparent'
                }`}
              >
                <span className="hidden sm:inline">{r.label}</span>
                <span className="sm:hidden">{r.short}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Left: text */}
          <div key={active} className="animate-fade-in-up">
            <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border mb-5 ${content.bg} ${content.border} ${content.color}`}>
              <span>{content.stat.value}</span>
              <span className="opacity-60">{content.stat.label}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
              {content.headline}
            </h3>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              {content.subheadline}
            </p>
            <div className="space-y-3 mb-8">
              {content.features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3.5">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${content.bg} ${content.border}`}>
                    <Icon size={14} className={content.color} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{title}</p>
                    <p className="text-slate-500 text-xs leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/auth/register"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-all ${content.bg} ${content.border} ${content.color} hover:brightness-110`}
            >
              {content.cta} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right: visual mockup */}
          <div key={`${active}-card`} className="animate-fade-in relative">
            <div className="bg-[#0c1117] border border-[#1c2432] rounded-2xl p-5 space-y-3">
              {/* Mock header */}
              <div className="flex items-center justify-between border-b border-[#1c2432] pb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-current ${content.color}`} />
                  <span className="text-xs font-semibold text-slate-400">
                    {active === 'player' ? 'My Dashboard' :
                     active === 'captain' ? 'Team Dashboard' :
                     active === 'ground_admin' ? 'Ground Dashboard' :
                     'League Dashboard'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-600">SlotYourGame</span>
              </div>

              {/* Role-specific mockup content */}
              {active === 'player' && <PlayerMockup />}
              {active === 'captain' && <CaptainMockup />}
              {active === 'ground_admin' && <GroundMockup />}
              {active === 'league_admin' && <LeagueMockup />}
            </div>

            {/* Floating decoration */}
            <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-2xl border flex items-center justify-center text-xl ${content.bg} ${content.border} animate-float`}>
              {active === 'player' ? '🏏' : active === 'captain' ? '⚡' : active === 'ground_admin' ? '🏟️' : '🏆'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PlayerMockup() {
  return (
    <>
      <div className="bg-[#0f1520] rounded-xl p-3 border border-[#1c2432]">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Next Match — RSVP</p>
        <p className="text-white text-sm font-bold">Chennai Warriors vs Mumbai XI</p>
        <p className="text-slate-500 text-xs mt-0.5">Sat, 14 Jun · KD Ground · 6:00 PM</p>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 py-1.5 rounded-lg bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-bold">✓ IN</button>
          <button className="flex-1 py-1.5 rounded-lg bg-[#1c2432] text-slate-400 text-xs font-medium">? Maybe</button>
          <button className="flex-1 py-1.5 rounded-lg bg-[#1c2432] text-slate-400 text-xs font-medium">✗ Out</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[['247', 'Runs'], ['8', 'Wickets'], ['14', 'Matches']].map(([v, l]) => (
          <div key={l} className="bg-[#0f1520] rounded-xl p-3 border border-[#1c2432] text-center">
            <p className="text-blue-400 font-extrabold text-lg">{v}</p>
            <p className="text-slate-600 text-[10px]">{l}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function CaptainMockup() {
  const squad = [
    { name: 'Ravi K.', status: 'in', runs: 247 },
    { name: 'Arjun S.', status: 'in', runs: 183 },
    { name: 'Mohammed A.', status: 'maybe', runs: 156 },
    { name: 'Priya R.', status: 'out', runs: 98 },
  ]
  return (
    <>
      <div className="bg-[#0f1520] rounded-xl p-3 border border-[#1c2432]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Squad RSVP · 14 Jun</p>
          <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-semibold">9/11 in</span>
        </div>
        <div className="space-y-1.5">
          {squad.map(({ name, status, runs }) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status === 'in' ? 'bg-green-500' : status === 'maybe' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className="text-slate-300 text-xs">{name}</span>
              </div>
              <span className="text-slate-600 text-[10px]">{runs} runs</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#0f1520] rounded-xl p-3 border border-[#1c2432] flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">KD Sports Ground</p>
          <p className="text-white text-xs font-semibold">6:00–8:00 PM · ₹800/hr</p>
        </div>
        <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">Confirmed</span>
      </div>
    </>
  )
}

function GroundMockup() {
  const bookings = [
    { team: 'Chennai Warriors', time: '6–8 PM', status: 'pending' },
    { team: 'Mumbai Strikers', time: '8–10 AM', status: 'approved' },
    { team: 'Delhi Daredevils', time: '4–6 PM', status: 'pending' },
  ]
  return (
    <>
      <div className="flex items-center justify-between bg-[#0f1520] rounded-xl p-3 border border-[#1c2432]">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Pending Approvals</p>
          <p className="text-2xl font-extrabold text-orange-400 mt-0.5">3</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-lg">🏟️</div>
      </div>
      <div className="space-y-2">
        {bookings.map(({ team, time, status }) => (
          <div key={team} className="flex items-center justify-between bg-[#0f1520] rounded-xl px-3 py-2 border border-[#1c2432]">
            <div>
              <p className="text-white text-xs font-semibold">{team}</p>
              <p className="text-slate-500 text-[10px]">{time}</p>
            </div>
            <div className="flex gap-1.5">
              {status === 'pending' ? (
                <>
                  <button className="text-[10px] px-2 py-1 rounded-md bg-green-500/15 text-green-400 border border-green-500/20 font-bold">✓</button>
                  <button className="text-[10px] px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 font-bold">✗</button>
                </>
              ) : (
                <span className="text-[10px] px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/15 font-bold">Approved</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function LeagueMockup() {
  const standings = [
    { pos: 1, team: 'Chennai Warriors', p: 8, w: 6, pts: 12 },
    { pos: 2, team: 'Mumbai Strikers',  p: 8, w: 5, pts: 10 },
    { pos: 3, team: 'Delhi Daredevils', p: 8, w: 4, pts: 8  },
    { pos: 4, team: 'Bangalore Bulls',  p: 8, w: 3, pts: 6  },
  ]
  return (
    <>
      <div className="bg-[#0f1520] rounded-xl p-3 border border-[#1c2432]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">City T20 League · Standings</p>
          <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-semibold">Round 4</span>
        </div>
        <div className="space-y-1.5">
          <div className="grid grid-cols-4 text-[9px] text-slate-600 font-bold uppercase pb-1 border-b border-[#1c2432]">
            <span>#</span><span>Team</span><span className="text-center">W</span><span className="text-center">Pts</span>
          </div>
          {standings.map(({ pos, team, p, w, pts }) => (
            <div key={team} className="grid grid-cols-4 text-xs items-center">
              <span className={`font-bold text-[10px] ${pos === 1 ? 'rank-gold' : pos === 2 ? 'rank-silver' : 'text-slate-500'}`}>{pos}</span>
              <span className="text-slate-300 text-[10px] truncate">{team.split(' ')[0]}</span>
              <span className="text-center text-slate-400 text-[10px]">{w}/{p}</span>
              <span className="text-center font-bold text-purple-400 text-[10px]">{pts}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
