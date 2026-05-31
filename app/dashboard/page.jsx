import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar, BarChart2, MapPin, BookOpen, Trophy,
  UserSearch, Building2, ListChecks, ClipboardCheck,
  Handshake, ArrowRight, TrendingUp, Target, Activity,
  ChevronRight,
} from 'lucide-react'
import { ROLE_LABELS } from '@/lib/rbac'

export const metadata = { title: 'Dashboard — SlotYourGame' }

const ROLE_GRADIENT = {
  player:      'from-blue-500/6   to-transparent border-blue-500/15',
  captain:     'from-green-500/6  to-transparent border-green-500/15',
  ground_admin:'from-orange-500/6 to-transparent border-orange-500/15',
  league_admin:'from-purple-500/6 to-transparent border-purple-500/15',
  super_admin: 'from-red-500/6    to-transparent border-red-500/15',
}
const ROLE_BADGE = {
  player:      'bg-blue-500/10   border-blue-500/20   text-blue-400',
  captain:     'bg-green-500/10  border-green-500/20  text-green-400',
  ground_admin:'bg-orange-500/10 border-orange-500/20 text-orange-400',
  league_admin:'bg-purple-500/10 border-purple-500/20 text-purple-400',
  super_admin: 'bg-red-500/10    border-red-500/20    text-red-400',
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
    .limit(5)

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
      { href: '/dashboard/availability', icon: ClipboardCheck, color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',  glow: 'rgba(34,197,94,0.08)',   title: 'Attendance',       desc: 'Mark your fixture availability' },
      { href: '/dashboard/stats',        icon: BarChart2,      color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',    glow: 'rgba(59,130,246,0.08)',  title: 'My Stats',         desc: 'Runs, wickets & season totals' },
      { href: '/dashboard/marketplace',  icon: UserSearch,     color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20',    glow: 'rgba(236,72,153,0.08)', title: 'Free Agent Board', desc: 'Get discovered by captains' },
      { href: '/dashboard/grounds',      icon: MapPin,         color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20',glow: 'rgba(234,179,8,0.08)',  title: 'Browse Grounds',   desc: 'Find cricket pitches near you' },
    ],
    captain: [
      { href: '/dashboard/fixtures',     icon: Calendar,      color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',   glow: 'rgba(34,197,94,0.08)',  title: 'Fixtures',       desc: 'Schedule matches & net sessions' },
      { href: '/dashboard/grounds',      icon: MapPin,        color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', glow: 'rgba(234,179,8,0.08)', title: 'Book a Ground',  desc: 'Find and reserve a pitch' },
      { href: '/dashboard/roster',       icon: UserSearch,    color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',     glow: 'rgba(59,130,246,0.08)', title: 'Manage Roster',  desc: 'Add or remove players' },
      { href: '/dashboard/bookings',     icon: BookOpen,      color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', glow: 'rgba(168,85,247,0.08)', title: 'My Bookings',    desc: 'Track ground booking status' },
      { href: '/dashboard/marketplace',  icon: Handshake,     color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20',     glow: 'rgba(236,72,153,0.08)', title: 'Find Players',   desc: 'Browse available free agents' },
    ],
    ground_admin: [
      { href: '/dashboard/manage/bookings', icon: ListChecks, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', glow: 'rgba(234,179,8,0.08)',  title: `${pendingBookings} Pending`, desc: 'Approve or reject booking requests' },
      { href: '/dashboard/manage',          icon: Building2,  color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',   glow: 'rgba(34,197,94,0.08)',  title: 'Manage Ground',             desc: 'Update ground details & time slots' },
      { href: '/dashboard/manage/blacklist',icon: ListChecks, color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',       glow: 'rgba(239,68,68,0.08)',  title: 'Blacklist',                 desc: 'Block problem teams from booking' },
    ],
    league_admin: [
      { href: '/dashboard/leagues',   icon: Trophy,   color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', glow: 'rgba(234,179,8,0.08)', title: 'Leagues',      desc: 'Create and manage tournaments' },
      { href: '/dashboard/grounds',   icon: MapPin,   color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',   glow: 'rgba(34,197,94,0.08)', title: 'All Grounds',  desc: 'View and manage all grounds' },
      { href: '/dashboard/fixtures',  icon: Calendar, color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',     glow: 'rgba(59,130,246,0.08)',title: 'All Fixtures', desc: 'Platform-wide scheduling' },
    ],
    super_admin: [
      { href: '/dashboard/leagues',           icon: Trophy,     color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', glow: 'rgba(234,179,8,0.08)',  title: 'Leagues',    desc: 'Manage all tournaments' },
      { href: '/dashboard/grounds',           icon: MapPin,     color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',   glow: 'rgba(34,197,94,0.08)',  title: 'Grounds',    desc: 'All registered grounds' },
      { href: '/dashboard/manage/bookings',   icon: ListChecks, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', glow: 'rgba(249,115,22,0.08)', title: 'Bookings',   desc: 'Approve / reject all bookings' },
    ],
  }

  const actions = quickActions[role] ?? quickActions.player

  // Stat tiles config
  const statTiles = role === 'ground_admin'
    ? [
        { label: 'Pending Approvals', value: pendingBookings, icon: Activity, color: pendingBookings > 0 ? 'text-yellow-400' : 'text-green-400', bg: pendingBookings > 0 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20' },
        { label: 'Ground Status',     value: 'Active',        icon: Target,   color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
        { label: 'Today',             value: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), icon: Calendar, color: 'text-slate-300', bg: 'bg-slate-500/10 border-slate-500/20', small: true },
      ]
    : [
        { label: 'Upcoming Fixtures', value: fixtures?.length ?? 0, icon: Calendar,    color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
        { label: 'Total Runs',        value: totals.runs,            icon: TrendingUp,  color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
        { label: 'Wickets',           value: totals.wkts,            icon: Target,      color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
        { label: 'Catches',           value: totals.catches,         icon: Activity,    color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
      ]

  const firstName   = profile?.full_name?.split(' ')[0] ?? 'there'
  const roleBadge   = ROLE_BADGE[role] ?? ROLE_BADGE.player
  const roleLabel   = ROLE_LABELS[role] ?? role
  const roleGrad    = ROLE_GRADIENT[role] ?? ROLE_GRADIENT.player

  return (
    <div className="space-y-7 max-w-5xl">

      {/* ── Welcome banner ─────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${roleGrad} bg-[#0c1117] p-6`}>
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-green-500/4 blur-[60px] pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <div className="flex items-center flex-wrap gap-2 mt-3">
              <span className={`inline-flex text-[11px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wide ${roleBadge}`}>
                {roleLabel}
              </span>
              {profile?.teams?.name && (
                <span className="text-slate-600 text-sm">· {profile.teams.name}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat tiles ─────────────────────────────────────────── */}
      <div className={`grid gap-4 ${statTiles.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {statTiles.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-[#0c1117] rounded-2xl p-5 border border-[#1c2432] relative overflow-hidden group hover:border-[#252f42] transition-colors">
              {/* Top icon badge */}
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${s.bg}`}>
                <Icon size={14} className={s.color} />
              </div>
              <p className="text-xs text-slate-500 font-medium leading-none mb-2">{s.label}</p>
              <p className={`font-extrabold ${s.color} ${s.small ? 'text-lg' : 'text-3xl'} leading-none`}>
                {s.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Quick actions ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {actions.map(({ href, icon: Icon, color, bg, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group bg-[#0c1117] border border-[#1c2432] hover:border-[#252f42] rounded-2xl p-5 transition-all card-hover"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-white text-[13px] group-hover:text-green-300 transition-colors truncate">{title}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <ChevronRight size={13} className="text-slate-700 group-hover:text-green-500 shrink-0 mt-0.5 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Upcoming fixtures ──────────────────────────────────── */}
      {role !== 'ground_admin' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Upcoming Fixtures
            </h2>
            <Link
              href="/dashboard/fixtures"
              className="text-xs text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>

          <div className="bg-[#0c1117] rounded-2xl border border-[#1c2432] overflow-hidden">
            {!fixtures?.length ? (
              <div className="py-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#0f1520] border border-[#1c2432] flex items-center justify-center mx-auto mb-3">
                  <Calendar size={20} className="text-slate-700" />
                </div>
                <p className="text-slate-500 text-sm font-medium">No upcoming fixtures</p>
                <p className="text-slate-700 text-xs mt-1">
                  {role === 'captain' || role === 'league_admin' || role === 'super_admin'
                    ? 'Schedule your first match to get started.'
                    : 'Check back once your captain schedules a match.'}
                </p>
                {(role === 'captain' || role === 'league_admin' || role === 'super_admin') && (
                  <Link
                    href="/dashboard/fixtures"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 font-semibold transition-colors"
                  >
                    Schedule a fixture <ArrowRight size={11} />
                  </Link>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-[#1c2432]">
                {fixtures.map((f, i) => (
                  <li key={f.id}>
                    <Link
                      href={`/dashboard/attendance/${f.id}`}
                      className="flex items-center justify-between px-5 py-4 hover:bg-[#0f1520] transition-colors group"
                    >
                      {/* Left */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Date chip */}
                        <div className="w-10 h-10 rounded-xl bg-[#0f1520] border border-[#1c2432] flex flex-col items-center justify-center shrink-0 group-hover:border-green-500/20 transition-colors">
                          <span className="text-[10px] font-bold text-green-400 leading-none">
                            {new Date(f.fixture_date).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}
                          </span>
                          <span className="text-sm font-extrabold text-white leading-none mt-0.5">
                            {new Date(f.fixture_date).getDate()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-semibold group-hover:text-green-300 transition-colors truncate">
                            vs {f.opponent_name ?? 'TBC'}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {f.ground_name ?? 'Venue TBC'}
                            {f.fixture_type ? ` · ${f.fixture_type}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Status badge */}
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold border shrink-0 ml-3 ${
                        f.status === 'confirmed'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : f.status === 'cancelled'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {f.status ?? 'scheduled'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
