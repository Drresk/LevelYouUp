import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

const DAILY_GOAL_ML = 2000

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = format(new Date(), 'yyyy-MM-dd')
  const { data: logs } = await supabase
    .from('water_logs').select('amount_ml,logged_at')
    .eq('user_id', user.id).gte('logged_at', today)

  const totalMl = (logs || []).reduce((s, l) => s + l.amount_ml, 0)
  return NextResponse.json({ totalMl, goal: DAILY_GOAL_ML, logs: logs || [] })
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { amount_ml } = await req.json()

  await supabase.from('water_logs').insert({ user_id: user.id, amount_ml })

  // Check first water achievement
  await supabase.from('user_achievements').upsert(
    { user_id: user.id, achievement_key: 'water_first' },
    { onConflict: 'user_id,achievement_key' }
  )

  const today = format(new Date(), 'yyyy-MM-dd')
  const { data: logs } = await supabase.from('water_logs').select('amount_ml').eq('user_id', user.id).gte('logged_at', today)
  const totalMl = (logs || []).reduce((s, l) => s + l.amount_ml, 0)

  if (totalMl >= DAILY_GOAL_ML) {
    await supabase.from('user_achievements').upsert(
      { user_id: user.id, achievement_key: 'water_goal_1' },
      { onConflict: 'user_id,achievement_key' }
    )
  }

  return NextResponse.json({ ok: true, totalMl, goalReached: totalMl >= DAILY_GOAL_ML })
}
