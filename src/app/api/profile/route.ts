import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: profile }, { data: avatar }, { data: wallet }, { data: consumables }, { data: badges }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('avatars').select('*').eq('user_id', user.id).single(),
    supabase.from('user_wallet').select('*').eq('user_id', user.id).single(),
    supabase.from('user_consumables').select('*').eq('user_id', user.id).single(),
    supabase.from('user_badges').select('*, badge:badges(*)').eq('user_id', user.id).order('unlocked_at', { ascending: false }),
  ])

  return NextResponse.json({ profile, avatar, wallet, consumables, badges: badges || [] })
}

export async function PATCH(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  if (body.avatar) {
    const { data: existing } = await supabase.from('avatars').select('id').eq('user_id', user.id).single()
    if (existing) {
      await supabase.from('avatars').update({ ...body.avatar, updated_at: new Date().toISOString() }).eq('user_id', user.id)
    } else {
      await supabase.from('avatars').insert({ ...body.avatar, user_id: user.id })
    }
  }

  if (body.profile) {
    const { username } = body.profile
    if (username) {
      const { data: taken } = await supabase.from('profiles').select('id').eq('username', username).neq('id', user.id).single()
      if (taken) return NextResponse.json({ error: 'Username já em uso' }, { status: 409 })
    }
    await supabase.from('profiles').update(body.profile).eq('id', user.id)
  }

  if (body.active_badge) {
    await supabase.from('user_badges').update({ is_active: false }).eq('user_id', user.id)
    await supabase.from('user_badges').update({ is_active: true }).eq('user_id', user.id).eq('badge_key', body.active_badge)
    // Update title in profile
    const { data: badge } = await supabase.from('badges').select('title').eq('key', body.active_badge).single()
    if (badge) await supabase.from('profiles').update({ title: badge.title }).eq('id', user.id)
  }

  return NextResponse.json({ ok: true })
}
