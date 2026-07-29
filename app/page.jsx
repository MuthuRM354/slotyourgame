import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar, MapPin, BarChart2, Trophy,
  UserSearch, ArrowRight, ChevronRight,
  Building2, Search, Clock,
} from 'lucide-react'

const TWINKLE_DOTS = [...Array(18)].map((_, i) => ({
  left: `${(i * 53) % 100}%`,
  top: `${(i * 19) % 40}%`,
  delay: `${(i % 6) * 0.5}s`,
  size: 2 + (i % 3),
}))

export const metadata = {
  title: 'SlotYourGame — Cricket Team Management',
  description: 'Schedule fixtures, book grounds, track stats. Built for grassroots cricket in India.',
}

const FEATURES = [
  {
    href:    '/grounds',
    icon:    MapPin,
    color:   'text-[#5eeaff]',
    bg:      'bg-[#00d4ff]/10 border-[#00d4ff]/25',
    title:   'Find & Book Grounds',
    desc:    'Browse verified cricket grounds, check slot availability, book instantly.',
    cta:     'Browse grounds',
  },
  {
    href:    '/dashboard/fixtures',
    icon:    Calendar,
    color:   'text-[#ff6b85]',
    bg:      'bg-[#ff3b5c]/10 border-[#ff3b5c]/25',
    title:   'Fixture Management',
    desc:    'Schedule T20s, nets & tournaments. Players RSVP with one tap.',
    cta:     'View fixtures',
  },
  {
    href:    '/dashboard/stats',
    icon:    BarChart2,
    color:   'text-[#ffd166]',
    bg:      'bg-[#cc9300]/10 border-[#cc9300]/25',
    title:   'Player Stats',
    desc:    'Track every run, wicket and match. See your career leaderboard.',
    cta:     'See stats',
  },
  {
    href:    '/dashboard/leagues',
    icon:    Trophy,
    color:   'text-[#5eeaff]',
    bg:      'bg-[#00d4ff]/10 border-[#00d4ff]/25',
    title:   'Leagues & Tournaments',
    desc:    'Organise multi-team leagues, track standings, log results.',
    cta:     'View leagues',
  },
  {
    href:    '/dashboard/marketplace',
    icon:    UserSearch,
    color:   'text-[#ff6b85]',
    bg:      'bg-[#ff3b5c]/10 border-[#ff3b5c]/25',
    title:   'Free Agent Board',
    desc:    'Players post availability. Captains find cover for missing squad members.',
    cta:     'Browse players',
  },
  {
    href:    '/dashboard/manage',
    icon:    Building2,
    color:   'text-[#ffd166]',
    bg:      'bg-[#cc9300]/10 border-[#cc9300]/25',
    title:   'Ground Management',
    desc:    'Ground admins manage slots, approve bookings, control blacklists.',
    cta:     'Manage ground',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060a12] text-[#f0f6fc] overflow-x-hidden">

      {/* ── Hero (photo background) ─────────────────────────────── */}
      <section className="relative h-[660px] sm:h-[720px] overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns">
          <Image
            src="/hero-cricket.jpg"
            alt="Cricket match under floodlights at sunset"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Floodlight glow, matched to the towers in the photo */}
        <div className="absolute left-[4%] top-[6%] w-48 h-48 rounded-full bg-[#5eeaff]/25 blur-3xl animate-pulse-glow" />
        <div className="absolute right-[8%] top-[10%] w-52 h-52 rounded-full bg-[#5eeaff]/20 blur-3xl animate-pulse-glow delay-300" />

        {/* Twinkle dots over the sky */}
        {TWINKLE_DOTS.map((d, i) => (
          <span key={i}
            className="absolute rounded-full bg-white animate-twinkle-dot"
            style={{ left: d.left, top: d.top, width: d.size, height: d.size, animationDelay: d.delay }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-[#060a12]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a12]/75 via-[#060a12]/5 to-transparent" />

        {/* Floating pill nav */}
        <nav className="absolute top-5 inset-x-5 z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full pl-4 pr-2 py-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo/SlotYourGame Logo v4 Booking-selection_mobile logo.png"
                alt="SlotYourGame"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="font-extrabold text-sm tracking-tight text-white">
                Slot<span className="text-[#5eeaff]">YourGame</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1">
              <Link href="/grounds"               className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-200 hover:bg-white/10 transition-colors">Grounds</Link>
              <Link href="/dashboard/leagues"     className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-200 hover:bg-white/10 transition-colors">Leagues</Link>
              <Link href="/dashboard/fixtures"    className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-200 hover:bg-white/10 transition-colors">Fixtures</Link>
              <Link href="/dashboard/marketplace" className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-200 hover:bg-white/10 transition-colors">Free Agents</Link>
            </div>

            <Link href="/auth/register"
              className="flex items-center gap-1.5 text-sm font-bold px-5 py-2 rounded-full bg-[#00d4ff] hover:bg-[#5eeaff] text-[#060a12] transition-colors">
              Get Started <ChevronRight size={14} />
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 h-full max-w-6xl mx-auto px-5 flex items-end pb-12 sm:pb-16">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 w-full items-end">

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-white leading-[1.05] mb-5">
                Find Your Ground.<br />
                <span className="text-[#5eeaff]">Play Your Game.</span>
              </h1>
              <p className="text-gray-300 max-w-md leading-relaxed mb-8">
                Book premium cricket grounds across the city, schedule fixtures, and
                track every run your team scores — with just a few taps.
              </p>

              {/* Social proof avatar stack */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {['#00d4ff', '#ff3b5c', '#ffb800', '#5eeaff'].map((c, i) => (
                    <div key={i}
                      style={{ background: c }}
                      className="w-9 h-9 rounded-full border-2 border-[#060a12] flex items-center justify-center text-[11px] font-bold text-[#060a12]">
                      {['RK','AS','VP','+'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">847+ Teams</p>
                  <p className="text-gray-400 text-xs">already playing on SlotYourGame</p>
                </div>
              </div>
            </div>

            {/* Quick-find booking widget */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-2xl">
              <p className="font-bold text-[#060a12] text-[15px] mb-0.5">Find your perfect ground</p>
              <p className="text-xs text-gray-500 mb-4">
                Discover and book grounds effortlessly with <span className="text-[#0099cc] font-semibold">SlotYourGame</span>.
              </p>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">City</span>
                  <div className="flex items-center gap-2 mt-1 border border-gray-200 rounded-lg px-3 py-2.5">
                    <MapPin size={15} className="text-gray-400" />
                    <input type="text" placeholder="Select your city" className="w-full text-sm text-[#060a12] placeholder-gray-400 outline-none" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Ground Type</span>
                  <div className="flex items-center gap-2 mt-1 border border-gray-200 rounded-lg px-3 py-2.5">
                    <Building2 size={15} className="text-gray-400" />
                    <input type="text" placeholder="Turf, matting, grass..." className="w-full text-sm text-[#060a12] placeholder-gray-400 outline-none" />
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Date</span>
                    <div className="flex items-center gap-2 mt-1 border border-gray-200 rounded-lg px-3 py-2.5">
                      <Calendar size={15} className="text-gray-400" />
                      <input type="text" placeholder="Choose date" className="w-full text-sm text-[#060a12] placeholder-gray-400 outline-none" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Time</span>
                    <div className="flex items-center gap-2 mt-1 border border-gray-200 rounded-lg px-3 py-2.5">
                      <Clock size={15} className="text-gray-400" />
                      <input type="text" placeholder="Choose time" className="w-full text-sm text-[#060a12] placeholder-gray-400 outline-none" />
                    </div>
                  </label>
                </div>

                <Link href="/grounds"
                  className="flex items-center justify-center gap-2 w-full bg-[#060a12] hover:bg-[#111826] text-white font-bold text-sm rounded-lg py-3 mt-2 transition-colors">
                  <Search size={15} /> Find Grounds Now
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Feature Pages Grid ───────────────────────────────────── */}
      <section className="py-20 px-5 border-t border-[#1d2942]/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#3e4a63] uppercase tracking-widest mb-3">Everything in one place</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Every tool your team needs
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ href, icon: Icon, color, bg, title, desc, cta }) => (
              <Link key={href} href={href}
                className="group bg-[#0d121c] border border-[#1d2942] hover:border-[#00d4ff]/30 rounded-2xl p-6 transition-all hover:bg-[#111826]">
                <div className={`w-11 h-11 rounded-xl ${bg} border flex items-center justify-center mb-4`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="font-bold text-[#f0f6fc] mb-2 group-hover:text-[#5eeaff] transition-colors">{title}</h3>
                <p className="text-sm text-[#5b6b8c] leading-relaxed mb-4">{desc}</p>
                <span className={`flex items-center gap-1.5 text-sm font-semibold ${color}`}>
                  {cta} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 px-5 border-t border-[#1d2942]/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to get serious<br />
            <span className="gradient-text">about your cricket?</span>
          </h2>
          <p className="text-[#5b6b8c] mb-8">
            Join 847+ teams already managing fixtures, grounds and stats on SlotYourGame.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register"
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base font-bold bg-[#00d4ff] hover:bg-[#5eeaff] text-white transition-colors">
              Create Your Team Free <ArrowRight size={18} />
            </Link>
            <Link href="/auth/login"
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base font-semibold bg-white/5 border border-white/10 hover:bg-white/8 transition-all text-[#aab8d6]">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-[#1d2942]/60 px-5 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo/SlotYourGame Logo v4 Booking-selection_mobile logo.png"
              alt="SlotYourGame"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="font-extrabold text-[14px]">Slot<span className="text-[#5eeaff]">YourGame</span></span>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#3e4a63]">
            <Link href="/grounds"               className="hover:text-[#f0f6fc] transition-colors">Grounds</Link>
            <Link href="/dashboard/fixtures"    className="hover:text-[#f0f6fc] transition-colors">Fixtures</Link>
            <Link href="/dashboard/leagues"     className="hover:text-[#f0f6fc] transition-colors">Leagues</Link>
            <Link href="/dashboard/marketplace" className="hover:text-[#f0f6fc] transition-colors">Free Agents</Link>
            <Link href="/auth/login"            className="hover:text-[#f0f6fc] transition-colors">Sign In</Link>
          </div>

          <p className="text-xs text-[#3e4a63]">Made in India 🇮🇳 · Free forever</p>
        </div>
      </footer>

    </div>
  )
}
