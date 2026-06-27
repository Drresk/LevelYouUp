import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') // YYYY-MM
  const category = searchParams.get('category')

  const now = new Date()
  const monthStr = month || format(now, 'yyyy-MM')
  const [year, mon] = monthStr.split('-').map(Number)
  const start = `${monthStr}-01`
  const end = format(new Date(year, mon, 0), 'yyyy-MM-dd') // last day of month

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', start)
    .lte('created_at', `${end}T23:59:59`)
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)

  const [{ data: transactions }, { data: goals }, { data: income }] = await Promise.all([
    query,
    supabase.from('financial_goals').select('*').eq('user_id', user.id),
    supabase.from('monthly_income').select('*').eq('user_id', user.id).eq('month', mon).eq('year', year),
  ])

  return NextResponse.json({ transactions: transactions || [], goals: goals || [], income: income || [] })
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, amount, category, description } = body

  const { data, error } = await supabase.from('transactions').insert({
    user_id: user.id,
    type,
    amount: Number(amount),
    category: category.toUpperCase(),
    description: description || '',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Check first_expense achievement
  if (type === 'expense') {
    const { count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', 'expense')

    if (count === 1) {
      await supabase.from('user_achievements').upsert(
        { user_id: user.id, achievement_key: 'first_expense' },
        { onConflict: 'user_id,achievement_key' }
      )
    }

    // Five freelances
    if (category === 'FREELA') {
      const { count: freelaCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'income')
        .eq('category', 'FREELA')

      if (freelaCount === 5) {
        await supabase.from('user_achievements').upsert(
          { user_id: user.id, achievement_key: 'five_freelances' },
          { onConflict: 'user_id,achievement_key' }
        )
      }
    }
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
