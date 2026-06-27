'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Transaction, EXPENSE_CATEGORIES } from '@/types'

const COLORS = ['#1DB954','#3B82F6','#8B5CF6','#F59E0B','#EF4444','#EC4899','#06B6D4','#84CC16']

interface DonutChartProps {
  transactions: Transaction[]
}

export default function DonutChart({ transactions }: DonutChartProps) {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const data = EXPENSE_CATEGORIES.map((cat, i) => {
    const value = expenses.filter((t) => t.category === cat).reduce((s, t) => s + Number(t.amount), 0)
    return { name: cat, value, color: COLORS[i % COLORS.length] }
  }).filter((d) => d.value > 0)

  if (data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-text-muted text-sm">Sem gastos este mês</div>
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`R$${value.toFixed(2)}`, '']}
          contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: 12 }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color: '#aaa' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ color: '#a0a0a0', fontSize: 11 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
