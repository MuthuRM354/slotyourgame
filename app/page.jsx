import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div>
          <h1 className="text-5xl font-extrabold text-green-400 tracking-tight">
            SlotYourGame
          </h1>
          <p className="mt-3 text-gray-400 text-lg">
            Cricket team management — ditch the WhatsApp chaos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            { emoji: '📅', title: 'Fixtures', desc: 'Create and manage matches, nets & tournaments.' },
            { emoji: '✅', title: 'Availability', desc: 'Players confirm availability. Captains see who\'s in.' },
            { emoji: '📊', title: 'Stats', desc: 'Track runs, wickets, and season performance.' },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="text-3xl mb-2">{f.emoji}</div>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition border border-gray-700"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  )
}
