'use client'

import { FinancialGoal, Transaction, EXPENSE_CATEGORIES, TransactionCategory } from '@/types'

interface CategoryBarsProps {
  transactions: Transaction[]
  goals: FinancialGoal[]
}

export default function CategoryBars({ transactions, goals }: CategoryBarsProps) {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const goalMap = Object.fromEntries(goals.map((g) => [g.category, g.monthly_limit]))

  const categories = EXPENSE_CATEGORIES.map((cat) => {
    const spent = expenses.filter((t) => t.category === cat).reduce((s, t) => s + Number(t.amount), 0)
    const limit = goalMap[cat] || null
    const pct = limit ? Math.min((spent / limit) * 100, 100) : null
    return { cat, spent, limit, pct }
  }).filter((c) => c.spent > 0 || c.limit)

  if (categories.length === 0) {
    return <p className="text-text-muted text-sm text-center py-4">Sem gastos ou metas configuradas.</p>
  }

  return (
    <div className="space-y-3">
      {categories.map(({ cat, spent, limit, pct }) => {
        const color = !pct ? '#1DB954' : pct >= 100 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#1DB954'
        return (
          <div key={cat}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-muted font-medium">{cat}</span>
              <span className="text-white">
                R${spent.toFixed(2)}{limit ? ` / R$${limit.toFixed(2)}` : ''}
                {pct !== null && <span style={{ color }} className="ml-1">({pct.toFixed(0)}%)</span>}
              </span>
            </div>
            <div className="w-full bg-surface-3 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct ?? 30}%`, backgroundColor: color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
