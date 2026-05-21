import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { hasPermission } from '@/lib/rbac'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  let query = supabase.from('fixtures').select('*').order('fixture_date', { ascending: true })
  if (profile?.role !== 'league_admin') {
    query = query.eq('team_id', profile?.team_id)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  if (!hasPermission(profile?.role, 'captain')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { team_id, opponent_name, fixture_date, start_time, end_time, ground_name, ground_address, fixture_type, notes } = body

  if (!opponent_name || !fixture_date) {
    return NextResponse.json({ error: 'opponent_name and fixture_date are required' }, { status: 400 })
  }

  const { data: fixture, error } = await supabase
    .from('fixtures')
    .insert({
      team_id: team_id ?? profile.team_id,
      opponent_name,
      fixture_date,
      start_time,
      end_time,
      ground_name,
      ground_address,
      fixture_type,
      notes,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fire n8n webhook
  const webhookUrl = process.env.N8N_FIXTURE_WEBHOOK_URL
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET ?? '',
      },
      body: JSON.stringify({ fixture, team_id: fixture.team_id }),
    }).catch(() => {})
  }

  return NextResponse.json(fixture, { status: 201 })
}
