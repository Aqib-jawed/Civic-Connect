import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role admin client — can create users and upsert profiles
const getAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const admin = getAdminClient()

    // ─── Profile-only upsert (called by useAuth when trigger didn't fire) ───
    if (body._upsert_profile_only && body.userId) {
      const { error: profileError } = await admin
        .from('profiles')
        .upsert(
          {
            id:        body.userId,
            full_name: body.full_name ?? 'User',
            phone:     body.phone ?? null,
            role:      'citizen',
          },
          { onConflict: 'id' }
        )

      if (profileError) {
        console.error('[register] profile-only upsert error:', profileError)
        return NextResponse.json({ error: profileError.message }, { status: 500 })
      }

      return NextResponse.json({ ok: true }, { status: 200 })
    }

    // ─── Normal registration ─────────────────────────────────────────────────
    const { email, password, full_name, phone } = body

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'email, password and full_name are required' },
        { status: 400 }
      )
    }

    // Step 1 — Create auth user via admin API (bypasses email confirmation)
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,          // auto-confirm so user can login immediately
      user_metadata: {
        full_name,
        phone: phone ?? null,
        role: 'citizen',
      },
    })

    if (authError) {
      console.error('[register] auth.admin.createUser error:', authError)
      // If user already exists, return friendly message
      if (authError.message?.includes('already been registered') || authError.code === 'email_exists') {
        return NextResponse.json({ error: 'An account with this email already exists. Please login.' }, { status: 409 })
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'User created but no ID returned' }, { status: 500 })
    }

    // Step 2 — Upsert profile (in case the trigger already ran, or didn't)
    const { error: profileError } = await admin
      .from('profiles')
      .upsert(
        {
          id:        userId,
          full_name,
          phone:     phone ?? null,
          role:      'citizen',
        },
        { onConflict: 'id' }
      )

    if (profileError) {
      console.error('[register] profile upsert error:', profileError)
      // Don't fail — trigger may have already inserted it
    }

    return NextResponse.json({ userId }, { status: 201 })
  } catch (err: any) {
    console.error('[register] Unexpected error:', err)
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 })
  }
}
