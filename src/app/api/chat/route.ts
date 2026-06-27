import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { classifyIntent, analyzeFinances } from '@/lib/claude/router'
import { format } from 'date-fns'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message } = await req.json()

  // Get user's API key from env
  const groqKey = process.env.GROQ_API_KEY || ''

  if (!groqKey) {
    return NextResponse.json({
      reply: '⚠️ Configure sua chave de API Groq em /configuracoes para usar o chat.',
      action: null,
    })
  }

  const haikuKey = groqKey
  const sonnetKey = groqKey

  let reply = ''
  let action: string | null = null

  try {
    const parsed = await classifyIntent(message, haikuKey)

    switch (parsed.intent) {
      case 'register_expense': {
        const { amount, category, description } = parsed.data as {
          amount: number
          category: string
          description: string
        }
        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'expense',
          amount,
          category: category.toUpperCase(),
          description: description || message,
        })
        reply = `✅ R$${amount.toFixed(2)} adicionado em ${category.toUpperCase()}`
        action = 'registered_expense'

        // Check budget alerts
        const now = new Date()
        const { data: monthExpenses } = await supabase
          .from('transactions')
          .select('amount, category')
          .eq('user_id', user.id)
          .eq('type', 'expense')
          .gte('created_at', format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd'))

        const { data: goals } = await supabase
          .from('financial_goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('category', category.toUpperCase())
          .single()

        if (goals && monthExpenses) {
          const catTotal = monthExpenses
            .filter((t) => t.category === category.toUpperCase())
            .reduce((s, t) => s + Number(t.amount), 0)
          const pct = (catTotal / goals.monthly_limit) * 100
          if (pct >= 100) {
            reply += `\n\n🚨 Você ultrapassou o limite de ${category.toUpperCase()} este mês!`
          } else if (pct >= 80) {
            reply += `\n\n⚠️ Você usou ${pct.toFixed(0)}% do limite de ${category.toUpperCase()}`
          }
        }
        break
      }

      case 'register_income': {
        const { amount, category, description } = parsed.data as {
          amount: number
          category: string
          description: string
        }
        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'income',
          amount,
          category: (category || 'FREELA').toUpperCase(),
          description: description || message,
        })
        reply = `✅ Entrada de R$${amount.toFixed(2)} registrada em ${(category || 'FREELA').toUpperCase()}`
        action = 'registered_income'
        break
      }

      case 'add_calendar_event': {
        const { title, date, time, type } = parsed.data as {
          title: string
          date: string
          time: string | null
          type: string
        }
        await supabase.from('calendar_events').insert({
          user_id: user.id,
          title,
          type: type || 'event',
          date,
          time,
          recurrence: 'none',
        })
        reply = `📅 Evento criado: "${title}" em ${date}${time ? ` às ${time}` : ''}`
        action = 'created_event'
        break
      }

      case 'add_shopping_item': {
        const { name, priority } = parsed.data as {
          name: string
          priority: string
        }
        await supabase.from('shopping_items').insert({
          user_id: user.id,
          name,
          priority: priority || 'medium',
        })
        reply = `🛒 "${name}" adicionado à lista de compras`
        action = 'added_shopping_item'
        break
      }

      case 'complex_query': {
        if (!groqKey) {
          reply = '⚠️ Configure sua chave do Groq em /configuracoes para análises financeiras.'
          break
        }
        // Gather financial context
        const now = new Date()
        const monthStart = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd')
        const prevMonthStart = format(new Date(now.getFullYear(), now.getMonth() - 1, 1), 'yyyy-MM-dd')

        const [{ data: thisMonth }, { data: lastMonth }, { data: goalsList }] = await Promise.all([
          supabase.from('transactions').select('type,amount,category').eq('user_id', user.id).gte('created_at', monthStart),
          supabase.from('transactions').select('type,amount,category').eq('user_id', user.id).gte('created_at', prevMonthStart).lt('created_at', monthStart),
          supabase.from('financial_goals').select('*').eq('user_id', user.id),
        ])

        const summarize = (txs: typeof thisMonth) => {
          if (!txs) return {}
          const inc = txs.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
          const exp = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
          const byCategory: Record<string, number> = {}
          txs.filter((t) => t.type === 'expense').forEach((t) => {
            byCategory[t.category] = (byCategory[t.category] || 0) + Number(t.amount)
          })
          return { income: inc, expenses: exp, balance: inc - exp, byCategory }
        }

        const ctx = `
Mês atual: ${JSON.stringify(summarize(thisMonth), null, 2)}
Mês anterior: ${JSON.stringify(summarize(lastMonth), null, 2)}
Metas por categoria: ${JSON.stringify(goalsList?.map((g) => ({ category: g.category, limit: g.monthly_limit })), null, 2)}
Hoje: ${now.toLocaleDateString('pt-BR')}
        `.trim()

        reply = await analyzeFinances(message, ctx, sonnetKey)
        action = 'complex_query'
        break
      }
    }
  } catch (err) {
    console.error('[chat]', err)
    reply = '❌ Erro ao processar. Verifique sua chave de API.'
  }

  // Save to history
  await supabase.from('chat_messages').insert([
    { user_id: user.id, role: 'user', content: message, action_taken: null },
    { user_id: user.id, role: 'assistant', content: reply, action_taken: action },
  ])

  return NextResponse.json({ reply, action })
}
