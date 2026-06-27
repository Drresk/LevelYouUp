import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: friendships } = await supabase
    .from('friendships')
    .select('*, requester:profiles!friendships_requester_id_fkey(id,name,username,title,profile_score), addressee:profiles!friendships_addressee_id_fkey(id,name,username,title,profile_score)')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  return NextResponse.json(friendships || [])
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { username, action, friendship_id } = await req.json()

  if (action === 'send') {
    const { data: target } = await supabase.from('profiles').select('id').eq('username', username).single()
    if (!target) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    if (target.id === user.id) return NextResponse.json({ error: 'Não pode adicionar a si mesmo' }, { status: 400 })

    const { error } = await supabase.from('friendships').insert({
      requester_id: user.id,
      addressee_id: target.id,
      status: 'pending',
    })
    if (error) return NextResponse.json({ error: 'Solicitação já enviada' }, { status: 409 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'accept' && friendship_id) {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendship_id).eq('addressee_id', user.id)
    // Achievement
    const { count } = await supabase.from('friendships').select('*', { count: 'exact', head: true })
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`).eq('status', 'accepted')
    await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'first_friend' }, { onConflict: 'user_id,achievement_key' })
    if (count === 5) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'social_5' }, { onConflict: 'user_id,achievement_key' })
    return NextResponse.json({ ok: true })
  }

  if (action === 'decline' && friendship_id) {
    await supabase.from('friendships').delete().eq('id', friendship_id)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
