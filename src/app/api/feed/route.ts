import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get friend IDs
  const { data: friends } = await supabase
    .from('friendships')
    .select('requester_id, addressee_id')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .eq('status', 'accepted')

  const friendIds = (friends || []).map((f) =>
    f.requester_id === user.id ? f.addressee_id : f.requester_id
  )
  const allIds = [user.id, ...friendIds]

  const { data: posts } = await supabase
    .from('feed_posts')
    .select('*, profile:profiles(name,username,title), achievement:achievements(title,description,icon,category), reactions:feed_reactions(*)')
    .in('user_id', allIds)
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json(posts || [])
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { post_id, emoji } = await req.json()

  const { data: existing } = await supabase.from('feed_reactions').select('id,emoji').eq('post_id', post_id).eq('user_id', user.id).single()
  if (existing) {
    if (existing.emoji === emoji) {
      await supabase.from('feed_reactions').delete().eq('id', existing.id)
    } else {
      await supabase.from('feed_reactions').update({ emoji }).eq('id', existing.id)
    }
  } else {
    await supabase.from('feed_reactions').insert({ post_id, user_id: user.id, emoji })
    await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'first_reaction' }, { onConflict: 'user_id,achievement_key' })
  }

  return NextResponse.json({ ok: true })
}
