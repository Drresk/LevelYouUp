'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import TransactionList from '@/components/financial/TransactionList'
import CategoryBars from '@/components/financial/CategoryBars'
import DonutChart from '@/components/financial/DonutChart'
import { Transaction, FinancialGoal, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types'

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'expense', amount: '', category: 'COMIDA', description: '' })
  const [tab, setTab] = useState<'visao' | 'historico'>('visao')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const res = await fetch('/api/financial')
    const data = await res.json()
    setTransactions(data.transactions || [])
    setGoals(data.goals || [])
    setLoading(false)
  }

  async function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/financial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
    })
    setShowForm(false)
    setForm({ type: 'expense', amount: '', category: 'COMIDA', description: '' })
    loadData()
  }

  async function handleDelete(id: string) {
    await fetch('/api/financial', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const balance = income - expenses

  const cats = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">💰 Financeiro</h1>
            <p className="text-text-muted text-sm mt-0.5">{format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            <Plus size={16} />
            Registrar
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleAddTransaction} className="bg-surface border border-primary/30 rounded-2xl p-5 mb-6 space-y-3">
            <h3 className="font-bold text-white">Nova transação</h3>
            <div className="flex bg-surface-2 rounded-xl p-1">
              <button type="button" onClick={() => { setForm(f => ({ ...f, type: 'expense', category: 'COMIDA' })) }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.type === 'expense' ? 'bg-danger/20 text-danger' : 'text-text-muted'}`}>
                Gasto
              </button>
              <button type="button" onClick={() => { setForm(f => ({ ...f, type: 'income', category: 'SALARIO' })) }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.type === 'income' ? 'bg-success/20 text-success' : 'text-text-muted'}`}>
                Entrada
              </button>
            </div>
            <input
              type="number" step="0.01" min="0" placeholder="Valor (R$)" required
              value={form.amount} onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
              className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary"
            />
            <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary">
              {cats.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" placeholder="Descrição (opcional)"
              value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary"
            />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-2 text-text-muted hover:text-white text-sm font-medium transition-all">
                Cancelar
              </button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-black text-sm font-bold transition-all">
                Salvar
              </button>
            </div>
          </form>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Entradas', value: income, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Saídas', value: expenses, icon: TrendingDown, color: 'text-danger', bg: 'bg-danger/10' },
            { label: 'Saldo', value: balance, icon: Wallet, color: balance >= 0 ? 'text-primary' : 'text-danger', bg: 'bg-primary-muted' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-surface border border-surface-3 rounded-2xl p-4">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
                <Icon size={14} className={color} />
              </div>
              <p className={`text-lg font-black ${color}`}>R${Math.abs(value).toFixed(2)}</p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-surface rounded-xl p-1 mb-6">
          <button onClick={() => setTab('visao')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'visao' ? 'bg-surface-3 text-white' : 'text-text-muted'}`}>
            Visão geral
          </button>
          <button onClick={() => setTab('historico')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'historico' ? 'bg-surface-3 text-white' : 'text-text-muted'}`}>
            Histórico
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-16 bg-surface rounded-xl animate-pulse" />)}
          </div>
        ) : tab === 'visao' ? (
          <>
            <div className="bg-surface border border-surface-3 rounded-2xl p-5 mb-6">
              <h3 className="font-bold text-white mb-4">Distribuição de gastos</h3>
              <DonutChart transactions={transactions} />
            </div>
            <div className="bg-surface border border-surface-3 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">Progresso por categoria</h3>
              <CategoryBars transactions={transactions} goals={goals} />
            </div>
          </>
        ) : (
          <TransactionList transactions={transactions} onDelete={handleDelete} />
        )}
      </div>
    </AppShell>
  )
}
