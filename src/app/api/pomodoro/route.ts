import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { applyXP } from '@/lib/utils/xp'
import { format } from 'date-fns'

function getLevelReward(level: number) {
  const base = { coins: 50, shields: 0, tokens: 0 }
  if (level === 5)  { base.shields = 1 }
  if (level === 10) { base.tokens = 1; base.coins = 150 }
  if (level === 15) { base.shields = 2; base.coins = 100 }
  if (level === 20) { base.tokens = 1; base.coins = 300 }
  if (level > 20 && level % 10 === 0) { base.tokens = 1; base.coins = 500 }
  return base
}

async function upsertWallet(supabase: ReturnType<typeof createClient>, userId: string, coinsToAdd: number) {
  const { data: existing } = await supabase
    .from('user_wallet')
    .select('coins, total_earned')
    .eq('user_id', userId)
    .single()

  if (existing) {
    await supabase.from('user_wallet').update({
      coins: existing.coins + coinsToAdd,
      total_earned: existing.total_earned + coinsToAdd,
    }).eq('user_id', userId)
  } else {
    await supabase.from('user_wallet').insert({
      user_id: userId,
      coins: coinsToAdd,
      total_earned: coinsToAdd,
    })
  }
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { skill_id, duration_minutes, completed, started_at } = await req.json()
  const xpEarned = Math.floor(duration_minutes)
  const hour = new Date().getHours()

  await supabase.from('pomodoro_sessions').insert({
    user_id: user.id,
    skill_id: skill_id || null,
    duration_minutes,
    xp_earned: xpEarned,
    completed,
    started_at,
    ended_at: new Date().toISOString(),
  })

  let leveledUp = false
  let newLevel = 0
  let skillName = ''
  let totalCoinsEarned = 0

  if (skill_id && xpEarned > 0) {
    const { data: skill } = await supabase.from('skills').select('*').eq('id', skill_id).eq('user_id', user.id).single()

    if (skill) {
      const result = applyXP(skill.level, skill.current_xp, skill.total_xp, xpEarned)
      leveledUp = result.levelsGained > 0
      newLevel = result.newLevel
      skillName = skill.name

      const today = format(new Date(), 'yyyy-MM-dd')
      const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')
      const newStreak = skill.last_activity_date === today
        ? skill.streak
        : skill.last_activity_date === yesterday
        ? skill.streak + 1
        : 1

      await supabase.from('skills').update({
        level: result.newLevel,
        current_xp: result.newCurrentXP,
        total_xp: result.newTotalXP,
        xp_to_next_level: result.newXpToNextLevel,
        streak: completed ? newStreak : skill.streak,
        last_activity_date: completed ? today : skill.last_activity_date,
      }).eq('id', skill_id)

      // Award coins + consumables per level gained
      if (leveledUp) {
        for (let l = skill.level + 1; l <= result.newLevel; l++) {
          const reward = getLevelReward(l)
          totalCoinsEarned += reward.coins

          if (reward.shields > 0 || reward.tokens > 0) {
            const { data: existing } = await supabase.from('user_consumables').select('*').eq('user_id', user.id).single()
            if (existing) {
              await supabase.from('user_consumables').update({
                streak_shields: existing.streak_shields + reward.shields,
                recovery_tokens: existing.recovery_tokens + reward.tokens,
              }).eq('user_id', user.id)
            } else {
              await supabase.from('user_consumables').insert({
                user_id: user.id,
                streak_shields: reward.shields,
                recovery_tokens: reward.tokens,
                xp_boosts: 0,
              })
            }
          }
        }
        await upsertWallet(supabase, user.id, totalCoinsEarned)
      }

      // Achievements
      const achieves: string[] = []
      if (result.newLevel >= 5) achieves.push('skill_level_5')
      if (result.newLevel >= 10) achieves.push('skill_level_10')
      if (result.newLevel >= 20) achieves.push('skill_level_20')
      if (result.newLevel >= 50) achieves.push('skill_level_50')
      if (result.newTotalXP >= 10000) achieves.push('total_xp_10000')
      if (result.newTotalXP >= 50000) achieves.push('xp_total_50000')
      if (completed && hour >= 0 && hour < 3) achieves.push('pomodoro_midnight')
      if (completed && hour < 7) achieves.push('pomodoro_early')

      for (const key of achieves) {
        await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: key }, { onConflict: 'user_id,achievement_key' })
      }

      const { count: pomCount } = await supabase.from('pomodoro_sessions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', true)
      const pomMilestones: Record<number, string> = { 1: 'first_pomodoro', 10: 'pomodoro_10', 50: 'pomodoro_50', 100: 'pomodoro_100', 200: 'pomodoro_200', 365: 'pomodoro_365' }
      if (pomCount && pomMilestones[pomCount]) {
        await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: pomMilestones[pomCount] }, { onConflict: 'user_id,achievement_key' })
      }
    }
  }

  return NextResponse.json({ ok: true, xpEarned, leveledUp, newLevel, skillName, coinsEarned: totalCoinsEarned })
}
