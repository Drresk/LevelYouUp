import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { xpForLevel } from '@/lib/utils/xp'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, icon, color } = body

  const { data, error } = await supabase
    .from('skills')
    .insert({
      user_id: user.id,
      name,
      icon: icon || '⚡',
      color: color || '#1DB954',
      level: 1,
      xp_to_next_level: xpForLevel(1),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Check first_skill achievement
  const { count } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count === 1) {
    await supabase.from('user_achievements').upsert({
      user_id: user.id,
      achievement_key: 'first_skill',
    }, { onConflict: 'user_id,achievement_key' })
  }
  if (count === 5) {
    await supabase.from('user_achievements').upsert({
      user_id: user.id,
      achievement_key: 'five_skills',
    }, { onConflict: 'user_id,achievement_key' })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...updates } = await req.json()
  const { data, error } = await supabase
    .from('skills')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await supabase.from('skills').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
