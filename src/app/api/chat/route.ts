import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { classifyIntent, analyzeFinances } from '@/lib/claude/router'
import { format } from 'date-fns'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message } = await req.json()
  const groqKey = process.env.GROQ_API_KEY || ''

  if (!groqKey) {
    return NextResponse.json({ reply: '⚠️ Configure sua chave Groq em /configuracoes.', action: null })
  }

  let reply = ''
  let action: string | null = null

  try {
    const parsed = await classifyIntent(message, groqKey)

    switch (parsed.intent) {
      case 'register_expense': {
        const { amount, category, description } = parsed.data as { amount: number; category: string; description: string }
        await supabase.from('transactions').insert({ user_id: user.id, type: 'expense', amount, category: category.toUpperCase(), description: description || message })

        // Budget alert
        const now = new Date()
        const monthStart = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd')
        const [{ data: monthTx }, { data: goal }] = await Promise.all([
          supabase.from('transactions').select('amount,category').eq('user_id', user.id).eq('type', 'expense').gte('created_at', monthStart),
          supabase.from('financial_goals').select('monthly_limit').eq('user_id', user.id).eq('category', category.toUpperCase()).single(),
        ])
        reply = `✅ R$${Number(amount).toFixed(2)} em ${category.toUpperCase()}`
        if (goal && monthTx) {
          const total = monthTx.filter((t) => t.category === category.toUpperCase()).reduce((s, t) => s + Number(t.amount), 0)
          const pct = (total / goal.monthly_limit) * 100
          if (pct >= 100) reply += `\n\n🚨 Limite de ${category.toUpperCase()} ultrapassado!`
          else if (pct >= 80) reply += `\n\n⚠️ ${pct.toFixed(0)}% do limite de ${category.toUpperCase()} usado`
        }
        action = 'registered_expense'

        await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'first_expense' }, { onConflict: 'user_id,achievement_key' })
        break
      }

      case 'register_income': {
        const { amount, category, description } = parsed.data as { amount: number; category: string; description: string }
        await supabase.from('transactions').insert({ user_id: user.id, type: 'income', amount, category: (category || 'FREELA').toUpperCase(), description: description || message })
        reply = `✅ Entrada de R$${Number(amount).toFixed(2)} em ${(category || 'FREELA').toUpperCase()}`
        action = 'registered_income'
        break
      }

      case 'add_calendar_event': {
        const { title, date, time, type } = parsed.data as { title: string; date: string; time: string | null; type: string }
        await supabase.from('calendar_events').insert({ user_id: user.id, title, type: type || 'event', date, time, recurrence: 'none' })
        reply = `📅 "${title}" criado${time ? ` às ${time}` : ''} em ${date}`
        action = 'created_event'
        break
      }

      case 'log_water': {
        const { amount_ml } = parsed.data as { amount_ml: number }
        const ml = Math.max(50, Math.min(amount_ml || 250, 2000))
        await supabase.from('water_logs').insert({ user_id: user.id, amount_ml: ml })

        const today = format(new Date(), 'yyyy-MM-dd')
        const { data: logs } = await supabase.from('water_logs').select('amount_ml').eq('user_id', user.id).gte('logged_at', today)
        const total = (logs || []).reduce((s, l) => s + l.amount_ml, 0)
        reply = `💧 +${ml}ml registrado! Hoje: ${total}ml / 2000ml`
        if (total >= 2000) reply += '\n\n✅ Meta diária atingida! 🎉'
        action = 'logged_water'
        await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'water_first' }, { onConflict: 'user_id,achievement_key' })
        break
      }

      case 'complex_query': {
        const now = new Date()
        const monthStart = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd')
        const prevStart = format(new Date(now.getFullYear(), now.getMonth() - 1, 1), 'yyyy-MM-dd')

        const [{ data: thisMonth }, { data: lastMonth }, { data: goals }] = await Promise.all([
          supabase.from('transactions').select('type,amount,category').eq('user_id', user.id).gte('created_at', monthStart),
          supabase.from('transactions').select('type,amount,category').eq('user_id', user.id).gte('created_at', prevStart).lt('created_at', monthStart),
          supabase.from('financial_goals').select('*').eq('user_id', user.id),
        ])

        const summarize = (txs: typeof thisMonth) => {
          if (!txs) return {}
          const byCategory: Record<string, number> = {}
          txs.filter((t) => t.type === 'expense').forEach((t) => { byCategory[t.category] = (byCategory[t.category] || 0) + Number(t.amount) })
          return {
            income: txs.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
            expenses: txs.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
            byCategory,
          }
        }

        const ctx = `Mês atual: ${JSON.stringify(summarize(thisMonth))}\nMês anterior: ${JSON.stringify(summarize(lastMonth))}\nMetas: ${JSON.stringify(goals?.map((g) => ({ category: g.category, limit: g.monthly_limit })))}\nHoje: ${now.toLocaleDateString('pt-BR')}`
        reply = await analyzeFinances(message, ctx, groqKey)
        action = 'complex_query'
        await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_key: 'first_analysis' }, { onConflict: 'user_id,achievement_key' })
        break
      }
    }
  } catch (err) {
    console.error('[chat]', err)
    reply = '❌ Erro ao processar. Verifique sua chave de API.'
  }

  await supabase.from('chat_messages').insert([
    { user_id: user.id, role: 'user', content: message, action_taken: null },
    { user_id: user.id, role: 'assistant', content: reply, action_taken: action },
  ])

  return NextResponse.json({ reply, action })
}
