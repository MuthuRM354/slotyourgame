import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar, BarChart2, MapPin, BookOpen, Trophy,
  UserSearch, Building2, ListChecks, ClipboardCheck,
  Handshake, ArrowRight, TrendingUp, Target, Activity,
  ChevronRight, Clock, Star, Users, Flame, Award,
  CheckCircle2, XCircle, HelpCircle, Zap,
} from 'lucide-react'
import { ROLE_LABELS } from '@/lib/rbac'

export const metadata = { title: 'Dashboard — SlotYourGame' }

const ROLE_BADGE = {
  player:      'bg-blue-500/10   border-blue-500/20   text-blue-400',
  captain:     'bg-green-500/10  border-green-500/20  text-green-400',
  ground_admin:'bg-orange-500/10 border-orange-500/20 text-orange-400',
  league_admin:'bg-purple-500/10 border-purple-500/20 text-purple-400',
  super_admin: 'bg-red-500/10    border-red-500/20    text-red-400',
}

const ROLE_ACCENT = {
  player:      'text-blue-400   bg-blue-500/8   border-blue-500/15',
  captain:     'text-green-400  bg-green-500/8  border-green-500/15',
  ground_admin:'text-orange-400 bg-orange-500/8 border-orange-500/15',
  league_admin:'text-purple-400 bg-purple-500/8 border-purple-500/15',
  super_admin: 'text-red-400    bg-red-500/8    border-red-500/15',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, teams(*)')
    .eq('id', user.id)
    .single()

  const role  = profile?.role ?? 'player'
  const today = new Date().toISOString().split('T')[0]

  // Upcoming fixtures
  const { data: fixtures } = await supabase
    .from('fixtures')
    .select('*')
    .eq('team_id', profile?.team_id)
    .gte('fixture_date', today)
    .order('fixture_date', { ascending: true })
    .limit(4)

  // Personal stats
  const { data: stats } = await supabase
    .from('player_stats')
    .select('runs_scored, wickets_taken, catches')
    .eq('player_id', user.id)

  const totals = (stats ?? []).reduce(
    (a, s) => ({
      runs:    a.runs    + (s.runs_scored    ?? 0),
      wkts:    a.wkts    + (s.wickets_taken  ?? 0),
      catches: a.catches + (s.catches        ?? 0),
    }),
    { runs: 0, wkts: 0, catches: 0 }
  )

  // Ground admin: pending bookings
  let pendingBookings = 0
  if (role === 'ground_admin' || role === 'super_admin') {
    const { count } = await supabase
      .from('ground_bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    pendingBookings = count ?? 0
  }

  // Quick actions per role
  const quickActions = {
    player: [
      { href: '/dashboard/availability', icon: ClipboardCheck, color: 'text-green-400',  bg: 'bg-green-500/10  border-green-500/20',  title: 'RSVP to Match',    desc: "Mark today's availability" },
      { href: '/dashboard/stats',        icon: BarChart2,      color: 'text-blue-400',   bg: 'bg-blue-500/10   border-blue-500/20',   title: 'My Stats',         desc: 'Season performance' },
      { href: '/dashboard/marketplace',  icon: UserSearch,     color: 'text-pink-400',   bg: 'bg-pink-500/10   border-pink-500/20',   title: 'Free Agents',      desc: 'Browse openings' },
      { href: '/dashboard/grounds',      icon: MapPin,         color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', title: 'Find Grounds',     desc: 'Book near you' },
    ],
    captain: [
      { href: '/dashboard/fixtures',     icon: Calendar,      color: 'text-green-400',  bg: 'bg-green-500/10   border-green-500/20',  title: 'New Fixture',    desc: 'Schedule a match' },
      { href: '/dashboard/grounds',      icon: MapPin,        color: 'text-yellow-400', bg: 'bg-yellow-500/10  border-yellow-500/20', title: 'Book Ground',    desc: 'Find available slots' },
      { href: '/dashboard/roster',       icon: Users,         color: 'text-blue-400',   bg: 'bg-blue-500/10    border-blue-500/20',   title: 'Manage Roster',  desc: 'Add/remove players' },
      { href: '/dashboard/bookings',     icon: BookOpen,      color: 'text-purple-400', bg: 'bg-purple-500/10  border-purple-500/20', title: 'My Bookings',    desc: 'Track reservations' },
      { href: '/dashboard/marketplace',  icon: Handshake,     color: 'text-pink-400',   bg: 'bg-pink-500/10    border-pink-500/20',   title: 'Find Players',   desc: 'Browse free agents' },
    ],
    ground_admin: [
      { href: '/dashboard/manage/bookings', icon: ListChecks, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', title: `${pendingBookings} Pending`, desc: 'Approve requests' },
      { href: '/dashboard/manage',          icon: Building2,  color: 'text-green-400',  bg: 'bg-green-500/10  border-green-500/20',  title: 'My Ground',             desc: 'Update details' },
      { href: '/dashboard/manage/blacklist',icon: ListChecks, color: 'text-red-400',    bg: 'bg-red-500/10    border-red-500/20',    title: 'Blacklist',             desc: 'Manage blocked teams' },
    ],
    league_admin: [
      { href: '/dashboard/leagues',   icon: Trophy,   color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', title: 'Leagues',      desc: 'Manage tournaments' },
      { href: '/dashboard/grounds',   icon: MapPin,   color: 'text-green-400',  bg: 'bg-green-500/10  border-green-500/20',  title: 'All Grounds',  desc: 'View all venues' },
      { href: '/dashboard/fixtures',  icon: Calendar, color: 'text-blue-400',   bg: 'bg-blue-500/10   border-blue-500/20',   title: 'All Fixtures', desc: 'Full schedule' },
    ],
    super_admin: [
      { href: '/dashboard/leagues',          icon: Trophy,     color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', title: 'Leagues',  desc: 'All tournaments' },
      { href: '/dashboard/grounds',          icon: MapPin,     color: 'text-green-400',  bg: 'bg-green-500/10  border-green-500/20',  title: 'Grounds',  desc: 'All venues' },
      { href: '/dashboard/manage/bookings',  icon: ListChecks, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', title: 'Bookings', desc: 'Approve/reject' },
    ],
  }

  const actions = quickActions[role] ?? quickActions.player

  // Stat tiles
  const statTiles = role === 'ground_admin'
    ? [
        { label: 'Pending',        value: pendingBookings, icon: Activity,   color: pendingBookings > 0 ? 'text-yellow-400' : 'text-green-400', bg: pendingBookings > 0 ? 'bg-yellow-500/10 border-yellow-500/15' : 'bg-green-500/10 border-green-500/15' },
        { label: 'Ground Status',  value: 'Active',        icon: Building2,  color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/15' },
        { label: 'Today',          value: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), icon: Calendar, color: 'text-slate-300', bg: 'bg-[#0f1520] border-[#1c2432]', small: true },
      ]
    : [
        { label: 'Next Match',     value: fixtures?.length ?? 0, icon: Calendar,   color: 'text-green-400',  bg: 'bg-green-500/10  border-green-500/15' },
        { label: 'Season Runs',    value: totals.runs,            icon: TrendingUp, color: 'text-blue-400',   bg: 'bg-blue-500/10   border-blue-500/15' },
        { label: 'Wickets',        value: totals.wkts,            icon: Target,     color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/15' },
        { label: 'Catches',        value: totals.catches,         icon: Activity,   color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/15' },
      ]

  const firstName   = profile?.full_name?.split(' ')[0] ?? 'there'
  const roleBadge   = ROLE_BADGE[role] ?? ROLE_BADGE.player
  const roleLabel   = ROLE_LABELS[role] ?? role
  const roleAccent  = ROLE_ACCENT[role] ?? ROLE_ACCENT.player
  const initials    = (profile?.full_name ?? 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── Welcome banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1c2432] bg-[#0c1117] p-6">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-green-500/5 blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-green-500/3 blur-[40px]" />
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center text-green-400 font-extrabold text-lg shrink-0 glow-green-xs">
              {initials}
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Hey, {firstName} 👋
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`inline-flex text-[11px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wide ${roleBadge}`}>
                  {roleLabel}
                </span>
                {profile?.teams?.name && (
                  <span className="text-slate-600 text-xs flex items-center gap-1">
                    <Zap size={10} className="text-slate-700" /> {profile.teams.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick tip */}
          {fixtures?.length === 0 && role !== 'ground_admin' && (
            <div className="hidden sm:flex items-center gap-2.5 bg-[#0f1520] border border-[#1c2432] rounded-xl px-4 py-3">
              <Flame size={14} className="text-orange-400 shrink-0" />
              <p className="text-xs text-slate-400 max-w-[140px] leading-relaxed">
                {role === 'captain' ? 'Schedule your next fixture to get started.' : 'Your captain will schedule a fixture soon.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Stat tiles ─────────────────────────────────────────────── */}
      <div className={`grid gap-3 ${statTiles.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {statTiles.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`bg-[#0c1117] rounded-2xl p-4 border relative overflow-hidden group hover:border-[#252f42] transition-colors ${s.bg}`}>
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mb-3 ${s.bg}`}>
                <Icon size={14} className={s.color} />
              </div>
              <p className="text-xs text-slate-500 font-medium mb-1.5 truncate">{s.label}</p>
              <p className={`font-extrabold ${s.color} ${s.small ? 'text-xl' : 'text-3xl'} leading-none`}>
                {s.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Quick actions ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">Quick Actions</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {actions.map(({ href, icon: Icon, color, bg, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group bg-[#0c1117] border border-[#1c2432] hover:border-[#252f42] rounded-2xl p-4 transition-all card-hover"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-white text-xs font-bold group-hover:text-green-300 transition-colors leading-tight">{title}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <ChevronRight size={11} className="text-slate-700 group-hover:text-green-500 shrink-0 mt-0.5 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Upcoming fixtures ──────────────────────────────────────── */}
      {role !== 'ground_admin' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">Upcoming Fixtures</p>
            <Link href="/dashboard/fixtures" className="text-xs text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 transition-colors">
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {!fixtures?.length ? (
            /* ── Empty state ── */
            <div className="bg-[#0c1117] border border-[#1c2432] rounded-2xl py-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0f1520] border border-[#1c2432] flex items-center justify-center mx-auto mb-4">
                <Calendar size={22} className="text-slate-700" />
              </div>
              <p className="text-white font-semibold text-base mb-1">No fixtures scheduled yet</p>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                {role === 'captain' || role === 'league_admin' || role === 'super_admin'
                  ? 'Schedule your first match to get your squad moving.'
                  : 'Your captain will schedule the next fixture soon.'}
              </p>
              {(role === 'captain' || role === 'league_admin' || role === 'super_admin') && (
                <Link
                  href="/dashboard/fixtures"
                  className="mt-5 inline-flex items-center gap-1.5 btn-primary text-xs px-5 py-2.5 rounded-lg"
                >
                  Schedule a Fixture <ArrowRight size={12} />
                </Link>
              )}
            </div>
          ) : (
            /* ── Fixture cards (CricHeroes-style) ── */
            <div className="space-y-3">
              {fixtures.map((f) => {
                const fDate = new Date(f.fixture_date)
                const day   = fDate.getDate()
                const mon   = fDate.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()
                const dow   = fDate.toLocaleDateString('en-IN', { weekday: 'short' })

                return (
                  <Link
                    key={f.id}
                    href={`/dashboard/attendance/${f.id}`}
                    className="group flex items-center gap-4 bg-[#0c1117] border border-[#1c2432] hover:border-green-500/20 rounded-2xl px-5 py-4 transition-all hover:bg-[#0f1520]"
                  >
                    {/* Date chip */}
                    <div className="w-12 shrink-0 text-center bg-[#0f1520] border border-[#1c2432] group-hover:border-green-500/20 rounded-xl py-2 transition-colors">
                      <p className="text-[9px] font-bold text-green-400 leading-none">{mon}</p>
                      <p className="text-xl font-extrabold text-white leading-tight mt-0.5">{day}</p>
                      <p className="text-[9px] text-slate-600 leading-none">{dow}</p>
                    </div>

                    {/* Fixture info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-bold text-sm group-hover:text-green-300 transition-colors truncate">
                          vs {f.opponent_name ?? 'TBC'}
                        </p>
                        {f.fixture_type && (
                          <span className="text-[10px] text-slate-500 bg-[#0f1520] border border-[#1c2432] px-1.5 py-0.5 rounded-md font-semibold shrink-0">
                            {f.fixture_type}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {f.ground_name && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={10} /> {f.ground_name}
                          </span>
                        )}
                        {f.fixture_time && (
                          <span className="flex items-center gap-1 shrink-0">
                            <Clock size={10} /> {f.fixture_time}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${
                        f.status === 'confirmed'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : f.status === 'cancelled'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-[#0f1520] text-slate-400 border-[#1c2432]'
                      }`}>
                        {f.status ?? 'Scheduled'}
                      </span>
                      <ChevronRight size={13} className="text-slate-700 group-hover:text-green-500 transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Ground admin: pending bookings panel ───────────────────── */}
      {role === 'ground_admin' && pendingBookings > 0 && (
        <div className="bg-[#0c1117] border border-yellow-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <ListChecks size={14} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{pendingBookings} Booking Requests</p>
                <p className="text-slate-500 text-xs">Awaiting your approval</p>
              </div>
            </div>
            <Link
              href="/dashboard/manage/bookings"
              className="btn-primary text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
            >
              Review All <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
