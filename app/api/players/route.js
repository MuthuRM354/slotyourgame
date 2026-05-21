import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { hasPermission } from '@/lib/rbac'

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('team_id') ?? profile?.team_id

  let query = supabase.from('profiles').select('id, full_name, email, role, cricheroes_verified, avatar_url')
  if (profile?.role !== 'league_admin') {
    query = query.eq('team_id', teamId)
  } else if (teamId) {
    query = query.eq('team_id', teamId)
  }

  const { data, error } = await query.order('full_name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
