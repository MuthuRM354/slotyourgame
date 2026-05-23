import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar, BarChart2, MapPin, BookOpen, Trophy,
  UserSearch, Building2, ListChecks, ClipboardCheck,
  TrendingUp, Target, Handshake, Zap,
} from 'lucide-react'
import { ROLE_LABELS } from '@/lib/rbac'

export const metadata = { title: 'Dashboard — SlotYourGame' }

const ROLE_BADGE = {
  player:      'bg-blue-500/10   border-blue-500/25   text-blue-400',
  captain:     'bg-green-500/10  border-green-500/25  text-green-400',
  ground_admin:'bg-orange-500/10 border-orange-500/25 text-orange-400',
  league_admin:'bg-purple-500/10 border-purple-500/25 text-purple-400',
  super_admin: 'bg-red-500/10    border-red-500/25    text-red-400',
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
      { href: '/dashboard/availability', icon: ClipboardCheck, color: 'text-green-400',  bg: 'bg-green-500/8',  border: 'border-green-500/20', title: 'Attendance',     desc: "Mark your availability for fixtures" },
      { href: '/dashboard/stats',        icon: BarChart2,      color: 'text-blue-400',   bg: 'bg-blue-500/8',   border: 'border-blue-500/20',  title: 'My Stats',       desc: 'Season runs, wickets & catches' },
      { href: '/dashboard/marketplace',  icon: UserSearch,     color: 'text-pink-400',   bg: 'bg-pink-500/8',   border: 'border-pink-500/20',  title: 'Free Agent Board',desc: "Get discovered by captains" },
      { href: '/dashboard/grounds',      icon: MapPin,         color: 'text-yellow-400', bg: 'bg-yellow-500/8', border: 'border-yellow-500/20',title: 'Browse Grounds',  desc: 'Find cricket pitches near you' },
    ],
    captain: [
      { href: '/dashboard/fixtures',     icon: Calendar,      color: 'text-green-400',  bg: 'bg-green-500/8',   border: 'border-green-500/20', title: 'Fixtures',       desc: 'Schedule matches & net sessions' },
      { href: '/dashboard/grounds',      icon: MapPin,        color: 'text-yellow-400', bg: 'bg-yellow-500/8',  border: 'border-yellow-500/20',title: 'Book a Ground',  desc: 'Find and reserve a pitch' },
      { href: '/dashboard/roster',       icon: UserSearch,    color: 'text-blue-400',   bg: 'bg-blue-500/8',    border: 'border-blue-500/20',  title: 'Manage Roster',  desc: 'Add or remove players' },
      { href: '/dashboard/bookings',     icon: BookOpen,      color: 'text-purple-400', bg: 'bg-purple-500/8',  border: 'border-purple-500/20',title: 'My Bookings',    desc: 'Track ground bookings & status' },
      { href: '/dashboard/marketplace',  icon: Handshake,     color: 'text-pink-400',   bg: 'bg-pink-500/8',    border: 'border-pink-500/20',  title: 'Find Players',   desc: 'Browse available free agents' },
    ],
    ground_admin: [
      { href: '/dashboard/manage/bookings', icon: ListChecks, color: 'text-yellow-400', bg: 'bg-yellow-500/8', border: 'border-yellow-500/20', title: `${pendingBookings} Pending`, desc: 'Approve or reject booking requests' },
      { href: '/dashboard/manage',          icon: Building2,  color: 'text-green-400',  bg: 'bg-green-500/8',  border: 'border-green-500/20',  title: 'Manage Ground',             desc: 'Update ground details & time slots' },
      { href: '/dashboard/manage/blacklist',icon: ListChecks, color: 'text-red-400',    bg: 'bg-red-500/8',    border: 'border-red-500/20',    title: 'Blacklist',                 desc: 'Block problem teams from booking' },
    ],
    league_admin: [
      { href: '/dashboard/leagues',   icon: Trophy,        color: 'text-yellow-400', bg: 'bg-yellow-500/8', border: 'border-yellow-500/20',title: 'Leagues',      desc: 'Create and manage tournaments' },
      { href: '/dashboard/grounds',   icon: MapPin,        color: 'text-green-400',  bg: 'bg-green-500/8',  border: 'border-green-500/20', title: 'All Grounds',  desc: 'View and manage all grounds' },
      { href: '/dashboard/fixtures',  icon: Calendar,      color: 'text-blue-400',   bg: 'bg-blue-500/8',   border: 'border-blue-500/20',  title: 'All Fixtures', desc: 'Platform-wide scheduling' },
    ],
    super_admin: [
      { href: '/dashboard/leagues',           icon: Trophy,     color: 'text-yellow-400', bg: 'bg-yellow-500/8', border: 'border-yellow-500/20',title: 'Leagues',    desc: 'Manage all tournaments' },
      { href: '/dashboard/grounds',           icon: MapPin,     color: 'text-green-400',  bg: 'bg-green-500/8',  border: 'border-green-500/20', title: 'Grounds',    desc: 'All registered grounds' },
      { href: '/dashboard/manage/bookings',   icon: ListChecks, color: 'text-orange-400', bg: 'bg-orange-500/8', border: 'border-orange-500/20',title: 'Bookings',   desc: 'Approve / reject all bookings' },
    ],
  }

  const actions = quickActions[role] ?? quickActions.player

  // Stat tiles config
  const statTiles = role === 'ground_admin'
    ? [
        { label: 'Pending Approvals', value: pendingBookings, color: pendingBookings > 0 ? 'text-yellow-400' : 'text-green-400' },
        { label: 'Ground Status',     value: 'Active',        color: 'text-green-400' },
        { label: 'Today',             value: today,           color: 'text-slate-300', small: true },
      ]
    : [
        { label: 'Upcoming Fixtures', value: fixtures?.length ?? 0, color: 'text-green-400' },
        { label: 'Total Runs',        value: totals.runs,            color: 'text-blue-400' },
        { label: 'Wickets',           value: totals.wkts,            color: 'text-yellow-400' },
        { label: 'Catches',           value: totals.catches,         color: 'text-purple-400' },
      ]

  const firstName   = profile?.full_name?.split(' ')[0] ?? 'there'
  const roleBadge   = ROLE_BADGE[role] ?? ROLE_BADGE.player
  const roleLabel   = ROLE_LABELS[role] ?? role

  return (
    <div className="space-y-6">

      {/* ── Welcome header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Welcome back, {firstName} 👋
          </h2>
          <div className="flex items-center gap-2.5 mt-2">
            <span className={`inline-flex text-xs px-2.5 py-1 rounded-full border font-semibold ${roleBadge}`}>
              {roleLabel}
            </span>
            {profile?.teams?.name && (
              <span className="text-slate-600 text-sm">· {profile.teams.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Stat tiles ─────────────────────────────────────────────── */}
      <div className={`grid gap-3 ${statTiles.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {statTiles.map((s) => (
          <div key={s.label} className="bg-[#0c1117] rounded-2xl p-4 border border-[#1c2432]">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{s.label}</p>
            <p className={`font-bold mt-1.5 ${s.color} ${s.small ? 'text-base' : 'text-2xl'}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Quick actions ──────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {actions.map(({ href, icon: Icon, color, bg, border, title, desc }) => (
            <Link
              key={href} href={href}
              className={`group bg-[#0c1117] border ${border} hover:border-opacity-60 rounded-2xl p-4 transition-all hover:bg-[#0f1520]`}
            >
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={17} className={color} />
              </div>
              <p className="font-semibold text-white text-sm group-hover:text-green-300 transition">{title}</p>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Upcoming fixtures ──────────────────────────────────────── */}
      {role !== 'ground_admin' && (
        <div className="bg-[#0c1117] rounded-2xl border border-[#1c2432] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1c2432]">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-green-400" />
              <h3 className="font-semibold text-white text-sm">Upcoming Fixtures</h3>
            </div>
            <Link href="/dashboard/fixtures" className="text-xs text-green-400 hover:text-green-300 transition font-medium">
              View all →
            </Link>
          </div>

          {!fixtures?.length ? (
            <div className="py-10 text-center">
              <Calendar size={28} className="text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No upcoming fixtures scheduled.</p>
              {(role === 'captain' || role === 'league_admin' || role === 'super_admin') && (
                <Link href="/dashboard/fixtures" className="mt-3 inline-block text-xs text-green-400 hover:text-green-300 transition">
                  Schedule one →
                </Link>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-[#1c2432]">
              {fixtures.map((f) => (
                <li key={f.id}>
                  <Link
                    href={`/dashboard/attendance/${f.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[#0f1520] transition group"
                  >
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-green-300 transition">
                        vs {f.opponent_name ?? 'TBC'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {f.fixture_date}
                        {f.ground_name ? ` · ${f.ground_name}` : ''}
                        {f.fixture_type ? ` · ${f.fixture_type}` : ''}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                      f.status === 'confirmed'
                        ? 'bg-green-500/10 text-green-400 border-green-500/25'
                        : f.status === 'cancelled'
                        ? 'bg-red-500/10 text-red-400 border-red-500/25'
                        : 'bg-slate-500/10 text-slate-400 border-slate-500/25'
                    }`}>
                      {f.status ?? 'scheduled'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
