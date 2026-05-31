import { Link } from 'react-router-dom'
import { MapPin, Zap, Shield, Trophy } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'

const FEATURES = [
  {
    icon: MapPin,
    title: 'Find Nearby Turfs',
    desc: 'GPS-powered search shows cricket grounds within 10 km of you.',
  },
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'Pick a slot, pay via Razorpay, get a confirmation in seconds.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'HMAC-verified transactions. Your money is safe, always.',
  },
  {
    icon: Trophy,
    title: 'Join Tournaments',
    desc: 'Register your team, track live scores, win prizes.',
  },
]

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero-bg pt-24 pb-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-2 rounded-full mb-8">
            <Zap size={14} />
            Instant slot booking · No calls needed
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            Where grassroots cricket
            <br />
            <span className="gradient-text">gets serious.</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Book cricket turfs, track your stats, run tournaments — all in one place.
            Built for serious players.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.TURFS}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
            >
              Find a Turf
            </Link>
            {!isAuthenticated && (
              <Link
                to={ROUTES.REGISTER}
                className="glass hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to play
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-6 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to hit the pitch?</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of cricketers who book their games on SlotYourGame.
          </p>
          <Link
            to={isAuthenticated ? ROUTES.TURFS : ROUTES.REGISTER}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-xl transition-colors text-lg inline-block"
          >
            {isAuthenticated ? 'Browse Turfs' : 'Join Now — It\'s Free'}
          </Link>
        </div>
      </section>
    </div>
  )
}
