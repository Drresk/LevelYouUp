import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Comida',       icon_key: 'food',      color: '#F5A623', is_income: false, sort_order: 0 },
  { name: 'Lazer',        icon_key: 'star',      color: '#8B5CF6', is_income: false, sort_order: 1 },
  { name: 'Passeios',     icon_key: 'heart',     color: '#FF3B5C', is_income: false, sort_order: 2 },
  { name: 'Roupa',        icon_key: 'chest',     color: '#00C875', is_income: false, sort_order: 3 },
  { name: 'Games',        icon_key: 'sword',     color: '#6B2FD4', is_income: false, sort_order: 4 },
  { name: 'Assinaturas',  icon_key: 'crown',     color: '#00D4FF', is_income: false, sort_order: 5 },
  { name: 'Uber',         icon_key: 'lightning', color: '#FCD34D', is_income: false, sort_order: 6 },
  { name: 'Avulso',       icon_key: 'coin',      color: '#94A3B8', is_income: false, sort_order: 7 },
]
const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salário',    icon_key: 'wallet', color: '#00C875', is_income: true, sort_order: 0 },
  { name: 'Freelance',  icon_key: 'star',   color: '#F5A623', is_income: true, sort_order: 1 },
]

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: cats } = await supabase
    .from('financial_categories')
    .select('*')
    .eq('user_id', user.id)
    .order('is_income')
    .order('sort_order')

  // Auto-seed on first visit
  if (!cats || cats.length === 0) {
    const toInsert = [
      ...DEFAULT_EXPENSE_CATEGORIES,
      ...DEFAULT_INCOME_CATEGORIES,
    ].map((c) => ({ ...c, user_id: user.id }))

    const { data: seeded } = await supabase
      .from('financial_categories')
      .insert(toInsert)
      .select()

    return NextResponse.json(seeded || [])
  }

  return NextResponse.json(cats)
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('financial_categories')
    .insert({ ...body, user_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...updates } = await req.json()
  const { data, error } = await supabase
    .from('financial_categories')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await supabase.from('financial_categories').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
