import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('shopping_items')
    .select('*')
    .eq('user_id', user.id)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })

  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('shopping_items')
    .insert({ ...body, user_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { count } = await supabase
    .from('shopping_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count === 1) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'first_shopping' }, { onConflict: 'user_id,achievement_key' })

  const { count: activeCount } = await supabase
    .from('shopping_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('purchased', false)

  if (activeCount === 10) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'shopping_10_items' }, { onConflict: 'user_id,achievement_key' })

  if (body.url) {
    const { count: linkCount } = await supabase
      .from('shopping_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('url', 'is', null)

    if (linkCount === 10) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'shopping_10_links' }, { onConflict: 'user_id,achievement_key' })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...updates } = await req.json()
  if (updates.purchased) updates.purchased_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('shopping_items')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (updates.purchased) {
    const { count } = await supabase
      .from('shopping_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('purchased', true)

    if (count === 5) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'purchased_5' }, { onConflict: 'user_id,achievement_key' })
    if (count === 20) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'purchased_20' }, { onConflict: 'user_id,achievement_key' })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await supabase.from('shopping_items').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
