import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar, CheckCircle2, BarChart2, MapPin,
  Trophy, UserSearch, ShieldCheck, ArrowRight, Zap,
} from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="border-b border-gray-800/60 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-green-400 font-extrabold text-xl tracking-tight">
            ⚡ SlotYourGame
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-gray-400 hover:text-white transition px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="text-sm bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-1.5 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <Zap size={12} />
          Built for cricket teams in India
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
          Stop managing cricket
          <br />
          <span className="text-green-400">on WhatsApp.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          SlotYourGame gives your team a proper home — fixtures, attendance,
          ground bookings, stats, and free agent recruiting. All in one place.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3.5 rounded-xl text-base transition"
          >
            Create your team <ArrowRight size={17} />
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition"
          >
            Sign In
          </Link>
        </div>

        {/* Role pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
          {['Players', 'Captains', 'Ground Admins', 'League Admins'].map((r) => (
            <span key={r} className="bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
              {r}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features grid ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Calendar,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
              title: 'Fixture Management',
              desc: 'Schedule matches, nets, and tournaments. Upcoming and past fixtures in separate tabs.',
            },
            {
              icon: CheckCircle2,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
              title: 'Attendance RSVP',
              desc: 'Players mark In / Can\'t Make It / Maybe for every fixture. Captains see the count instantly.',
            },
            {
              icon: MapPin,
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10',
              title: 'Ground Booking',
              desc: 'Browse grounds, pick a slot, and book in seconds. Ground admins approve or reject.',
            },
            {
              icon: BarChart2,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
              title: 'Player Stats',
              desc: 'Track runs, wickets, catches, and strike rates per match. Visual bar charts per season.',
            },
            {
              icon: UserSearch,
              color: 'text-pink-400',
              bg: 'bg-pink-500/10',
              title: 'Free Agent Board',
              desc: 'Players post availability by date and city. Captains find and contact them directly.',
            },
            {
              icon: Trophy,
              color: 'text-orange-400',
              bg: 'bg-orange-500/10',
              title: 'Leagues & Standings',
              desc: 'Full points tables with NRR, match results, and bracket tracking for your league.',
            },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 space-y-3 transition group"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={19} className={color} />
              </div>
              <h3 className="font-semibold text-white text-base">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role breakdown ──────────────────────────────────────────── */}
      <section className="border-t border-gray-800/60 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            One app, every role
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                role: 'Player',
                color: 'border-blue-700/40 bg-blue-500/5',
                badge: 'bg-blue-500/10 text-blue-400',
                perks: ['Mark match attendance', 'View your stats', 'Post free availability', 'Browse grounds'],
              },
              {
                role: 'Captain',
                color: 'border-green-700/40 bg-green-500/5',
                badge: 'bg-green-500/10 text-green-400',
                perks: ['Schedule fixtures', 'See squad RSVP', 'Book grounds', 'Recruit free agents'],
              },
              {
                role: 'Ground Admin',
                color: 'border-orange-700/40 bg-orange-500/5',
                badge: 'bg-orange-500/10 text-orange-400',
                perks: ['Approve/reject bookings', 'Manage slot calendar', 'Blacklist bad teams', 'View booking history'],
              },
              {
                role: 'League Admin',
                color: 'border-purple-700/40 bg-purple-500/5',
                badge: 'bg-purple-500/10 text-purple-400',
                perks: ['Create & manage leagues', 'Update standings', 'Schedule all matches', 'View all teams'],
              },
            ].map(({ role, color, badge, perks }) => (
              <div key={role} className={`border rounded-2xl p-5 space-y-4 ${color}`}>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}>
                  {role}
                </span>
                <ul className="space-y-2">
                  {perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-400">
                      <ShieldCheck size={13} className="text-gray-600 mt-0.5 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to organise your team?
          </h2>
          <p className="text-gray-400 text-lg">
            Free to use. No installs. Works on any device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/auth/register"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3.5 rounded-xl text-base transition"
            >
              Create a free account <ArrowRight size={17} />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800/60 py-8 px-6 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} SlotYourGame · Built for cricket teams
        </p>
      </footer>

    </div>
  )
}
