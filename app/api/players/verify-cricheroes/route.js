import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { cricheroes_id } = await request.json()
  if (!cricheroes_id) {
    return NextResponse.json({ error: 'cricheroes_id is required' }, { status: 400 })
  }

  // Save the ID optimistically
  await supabase
    .from('profiles')
    .update({ cricheroes_id })
    .eq('id', user.id)

  // Fire async n8n verification workflow
  const webhookUrl = process.env.N8N_FIXTURE_WEBHOOK_URL?.replace('fixture-created', 'cricheroes-verify')
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET ?? '',
      },
      body: JSON.stringify({ player_id: user.id, cricheroes_id }),
    }).catch(() => {})
  }

  return NextResponse.json({ message: 'Verification queued. Your profile will be updated shortly.' })
}
