import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * POST /api/setup
 * Creates the very first super_admin account.
 * Blocked once any super_admin already exists.
 */
export async function POST(request) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to .env.local' },
      { status: 500 }
    )
  }

  // Admin client — bypasses RLS
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Guard: only run if no super_admin exists yet
  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('role', 'super_admin')
    .limit(1)
    .single()

  if (existing) {
    return NextResponse.json(
      { error: 'A super admin already exists. Use the regular login.' },
      { status: 409 }
    )
  }

  const { fullName, email, password } = await request.json()
  if (!fullName || !email || !password) {
    return NextResponse.json({ error: 'fullName, email and password are required' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  // Create auth user
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,          // skip email verification for the first admin
    user_metadata: { full_name: fullName, role: 'super_admin' },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Upsert profile with super_admin role (profile trigger may have already inserted it)
  const { error: profileError } = await admin
    .from('profiles')
    .upsert({
      id:        authData.user.id,
      email,
      full_name: fullName,
      role:      'super_admin',
    })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Super admin created successfully. You can now sign in.' })
}

/** GET /api/setup — check whether setup has already been done */
export async function GET() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return NextResponse.json({ ready: false, reason: 'no_service_key' })

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data } = await admin
    .from('profiles')
    .select('id')
    .eq('role', 'super_admin')
    .limit(1)
    .single()

  return NextResponse.json({ done: !!data })
}
