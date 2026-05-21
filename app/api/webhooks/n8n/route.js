import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  const secret = request.headers.get('x-webhook-secret')
  if (secret !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { event, data } = body

  const supabase = await createClient()

  if (event === 'fixture_created') {
    // Create availability rows for every team member
    const { data: players } = await supabase
      .from('profiles')
      .select('id')
      .eq('team_id', data.team_id)

    if (players?.length) {
      const rows = players.map((p) => ({
        fixture_id: data.fixture_id,
        player_id: p.id,
        status: 'pending',
      }))
      await supabase.from('availability').upsert(rows, { onConflict: 'fixture_id,player_id' })
    }
    return NextResponse.json({ message: 'Availability rows created', count: players?.length })
  }

  if (event === 'cricheroes_verified') {
    await supabase
      .from('profiles')
      .update({ cricheroes_verified: true })
      .eq('id', data.player_id)
    return NextResponse.json({ message: 'Profile updated' })
  }

  return NextResponse.json({ message: 'Event received', event })
}
