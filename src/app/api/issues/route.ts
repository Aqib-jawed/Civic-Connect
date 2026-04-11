import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS, only used server-side
const getServiceClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

// POST /api/issues — create a new issue (bypasses RLS via service role)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = getServiceClient()

    const {
      reported_by,
      category,
      title,
      description,
      latitude,
      longitude,
      address,
      images,
      severity,
      is_anonymous,
    } = body

    if (!reported_by || !category || !title || latitude == null || longitude == null) {
      return NextResponse.json(
        { error: 'Missing required fields: reported_by, category, title, latitude, longitude' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('issues')
      .insert({
        reported_by,
        category,
        title,
        description: description ?? null,
        latitude,
        longitude,
        address: address ?? null,
        images: images ?? [],
        severity: severity ?? 'medium',
        is_anonymous: is_anonymous ?? false,
        status: 'submitted',
      })
      .select()
      .single()

    if (error) {
      console.error('[API /issues POST] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err: any) {
    console.error('[API /issues POST] Unexpected error:', err)
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 })
  }
}

// GET /api/issues — fetch all issues (admin), or filter by ?userId=...
export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceClient()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    let query = supabase
      .from('issues')
      .select('*, profiles!issues_reported_by_fkey(full_name, phone, avatar_url)')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('reported_by', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('[API /issues GET] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (err: any) {
    console.error('[API /issues GET] Unexpected error:', err)
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 })
  }
}
