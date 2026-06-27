import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('calendar_events')
    .select('*, skill:skills(name, icon, color)')
    .eq('user_id', user.id)
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('calendar_events')
    .insert({ ...body, user_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Achievements
  const { count } = await supabase
    .from('calendar_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count === 1) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'first_event' }, { onConflict: 'user_id,achievement_key' })
  if (count === 10) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'ten_events' }, { onConflict: 'user_id,achievement_key' })

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...updates } = await req.json()
  const { data, error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (updates.completed) {
    await supabase.from('user_achievements').upsert(
      { user_id: user.id, achievement_key: 'first_completed' },
      { onConflict: 'user_id,achievement_key' }
    )
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await supabase.from('calendar_events').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
