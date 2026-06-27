'use client'

import { Transaction } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete?: (id: string) => void
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="text-text-muted text-sm text-center py-8">Nenhuma transação este mês.</p>
  }

  return (
    <div className="space-y-2">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 bg-surface border border-surface-3 rounded-xl px-4 py-3"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            t.type === 'income' ? 'bg-success/10' : 'bg-danger/10'
          }`}>
            {t.type === 'income'
              ? <TrendingUp size={14} className="text-success" />
              : <TrendingDown size={14} className="text-danger" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{t.description || t.category}</p>
            <p className="text-xs text-text-muted">
              {t.category} · {format(new Date(t.created_at), "d MMM", { locale: ptBR })}
            </p>
          </div>
          <div className="text-right flex-shrink-0 flex items-center gap-2">
            <span className={`font-bold text-sm ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
              {t.type === 'income' ? '+' : '-'}R${Number(t.amount).toFixed(2)}
            </span>
            {onDelete && (
              <button
                onClick={() => onDelete(t.id)}
                className="text-text-dim hover:text-danger transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
