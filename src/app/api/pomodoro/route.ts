import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { applyXP, xpForLevel } from '@/lib/utils/xp'
import { format } from 'date-fns'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { skill_id, duration_minutes, completed, started_at } = await req.json()
  const xpEarned = Math.floor(duration_minutes)
  const endedAt = new Date().toISOString()
  const hour = new Date().getHours()

  // Save session
  await supabase.from('pomodoro_sessions').insert({
    user_id: user.id,
    skill_id: skill_id || null,
    duration_minutes,
    xp_earned: xpEarned,
    completed,
    started_at,
    ended_at: endedAt,
  })

  let leveledUp = false
  let newLevel = 0
  let skillName = ''

  // Apply XP to skill
  if (skill_id && xpEarned > 0) {
    const { data: skill } = await supabase
      .from('skills')
      .select('*')
      .eq('id', skill_id)
      .eq('user_id', user.id)
      .single()

    if (skill) {
      const result = applyXP(skill.level, skill.current_xp, skill.total_xp, xpEarned)
      leveledUp = result.levelsGained > 0
      newLevel = result.newLevel
      skillName = skill.name

      const today = format(new Date(), 'yyyy-MM-dd')
      const newStreak = skill.last_activity_date === today
        ? skill.streak
        : skill.last_activity_date === format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')
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

      // Achievement checks
      const achievements: string[] = []
      if (result.newLevel >= 5) achievements.push('skill_level_5')
      if (result.newLevel >= 10) achievements.push('skill_level_10')
      if (result.newLevel >= 20) achievements.push('skill_level_20')
      if (result.newLevel >= 50) achievements.push('skill_level_50')
      if (result.newTotalXP >= 10000) achievements.push('total_xp_10000')
      if (completed && hour >= 0 && hour < 3) achievements.push('pomodoro_midnight')
      if (completed && hour < 7) achievements.push('pomodoro_early')

      for (const key of achievements) {
        await supabase.from('user_achievements').upsert(
          { user_id: user.id, achievement_key: key },
          { onConflict: 'user_id,achievement_key' }
        )
      }

      // Pomodoro count achievements
      const { count: pomCount } = await supabase
        .from('pomodoro_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true)

      if (pomCount === 1) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'first_pomodoro' }, { onConflict: 'user_id,achievement_key' })
      if (pomCount === 10) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'pomodoro_10' }, { onConflict: 'user_id,achievement_key' })
      if (pomCount === 50) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'pomodoro_50' }, { onConflict: 'user_id,achievement_key' })
      if (pomCount === 200) await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'pomodoro_200' }, { onConflict: 'user_id,achievement_key' })
    }
  }

  return NextResponse.json({ ok: true, xpEarned, leveledUp, newLevel, skillName })
}
