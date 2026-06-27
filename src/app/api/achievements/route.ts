import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: unlocked }, { data: all }, { data: goals }] = await Promise.all([
    supabase.from('user_achievements').select('*').eq('user_id', user.id).order('unlocked_at', { ascending: false }),
    supabase.from('achievements').select('*').order('category'),
    supabase.from('personal_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return NextResponse.json({
    unlocked: unlocked || [],
    all: all || [],
    goals: goals || [],
  })
}
