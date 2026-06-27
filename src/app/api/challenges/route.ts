import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format, startOfWeek } from 'date-fns'

function getWeekStart(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 0 }), 'yyyy-MM-dd')
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const weekStart = getWeekStart()

  let { data: challenges } = await supabase
    .from('weekly_challenges')
    .select('*, challenge:challenge_pool(*)')
    .eq('user_id', user.id)
    .eq('week_start', weekStart)

  // Auto-generate if none exist
  if (!challenges || challenges.length === 0) {
    const { data: pool } = await supabase.from('challenge_pool').select('key')
    if (pool && pool.length > 0) {
      const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 3)
      await supabase.from('weekly_challenges').insert(
        shuffled.map((c) => ({ user_id: user.id, challenge_key: c.key, week_start: weekStart }))
      )
      const { data: fresh } = await supabase
        .from('weekly_challenges')
        .select('*, challenge:challenge_pool(*)')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
      challenges = fresh
    }
  }

  return NextResponse.json(challenges || [])
}

export async function PATCH(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, progress } = await req.json()
  const { data: challenge } = await supabase
    .from('weekly_challenges')
    .select('*, challenge:challenge_pool(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!challenge) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const target = (challenge.challenge as { target_value: number }).target_value
  const completed = progress >= target
  const updates: Record<string, unknown> = { progress }
  if (completed && !challenge.completed) {
    updates.completed = true
    updates.completed_at = new Date().toISOString()

    // Award coins
    const coins = (challenge.challenge as { reward_coins: number }).reward_coins
    const { data: wallet } = await supabase.from('user_wallet').select('*').eq('user_id', user.id).single()
    if (wallet) {
      await supabase.from('user_wallet').update({ coins: wallet.coins + coins, total_earned: wallet.total_earned + coins }).eq('user_id', user.id)
    } else {
      await supabase.from('user_wallet').insert({ user_id: user.id, coins, total_earned: coins })
    }

    // Achievements
    await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'first_challenge' }, { onConflict: 'user_id,achievement_key' })

    const { count } = await supabase.from('weekly_challenges').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', true)
    if (count === 5) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'challenges_5' }, { onConflict: 'user_id,achievement_key' })
    if (count === 10) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'challenges_10' }, { onConflict: 'user_id,achievement_key' })

    const weekStart = getWeekStart()
    const { count: weekCompleted } = await supabase.from('weekly_challenges').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('week_start', weekStart).eq('completed', true)
    if (weekCompleted === 3) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'challenges_perfect' }, { onConflict: 'user_id,achievement_key' })
  }

  await supabase.from('weekly_challenges').update(updates).eq('id', id)
  return NextResponse.json({ ok: true, completed })
}
