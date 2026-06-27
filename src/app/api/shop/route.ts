import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: items }, { data: inventory }, { data: wallet }] = await Promise.all([
    supabase.from('shop_items').select('*').order('coin_cost'),
    supabase.from('user_inventory').select('item_key').eq('user_id', user.id),
    supabase.from('user_wallet').select('*').eq('user_id', user.id).single(),
  ])

  return NextResponse.json({
    items: items || [],
    ownedKeys: (inventory || []).map((i) => i.item_key),
    wallet: wallet || { coins: 0, total_earned: 0 },
  })
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { item_key } = await req.json()

  const [{ data: item }, { data: wallet }] = await Promise.all([
    supabase.from('shop_items').select('*').eq('key', item_key).single(),
    supabase.from('user_wallet').select('*').eq('user_id', user.id).single(),
  ])

  if (!item) return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
  if (!wallet || wallet.coins < item.coin_cost) {
    return NextResponse.json({ error: 'Moedas insuficientes' }, { status: 400 })
  }

  // Deduct coins
  await supabase.from('user_wallet').update({ coins: wallet.coins - item.coin_cost }).eq('user_id', user.id)

  const consumableTypes = ['streak_shield', 'recovery_token', 'xp_boost']
  if (consumableTypes.includes(item.type)) {
    // Add to consumables
    const { data: cons } = await supabase.from('user_consumables').select('*').eq('user_id', user.id).single()
    const field = item.type === 'streak_shield' ? 'streak_shields' : item.type === 'recovery_token' ? 'recovery_tokens' : 'xp_boosts'
    if (cons) {
      await supabase.from('user_consumables').update({ [field]: (cons[field as keyof typeof cons] as number) + 1 }).eq('user_id', user.id)
    } else {
      await supabase.from('user_consumables').insert({ user_id: user.id, [field]: 1, streak_shields: 0, recovery_tokens: 0, xp_boosts: 0 })
    }
  } else {
    // Cosmetic — add to inventory
    await supabase.from('user_inventory').upsert({ user_id: user.id, item_key }, { onConflict: 'user_id,item_key' })
  }

  // Achievement: first_purchase
  await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'first_purchase' }, { onConflict: 'user_id,achievement_key' })

  // Check big_spender
  const { data: w2 } = await supabase.from('user_wallet').select('total_earned').eq('user_id', user.id).single()
  const spent = (w2?.total_earned || 0) - (wallet.coins - item.coin_cost)
  if (spent >= 1000) {
    await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'big_spender' }, { onConflict: 'user_id,achievement_key' })
  }

  return NextResponse.json({ ok: true, newBalance: wallet.coins - item.coin_cost })
}
