'use client'

import { useState, useEffect } from 'react'
import { Plus, ExternalLink, Check, Trash2, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from '@/components/layout/AppShell'
import { ShoppingItem, Priority } from '@/types'
import { cn } from '@/lib/utils/cn'

const PRIORITY_LABEL: Record<Priority, string> = { low: 'Baixa', medium: 'Média', high: 'Alta' }
const PRIORITY_COLOR: Record<Priority, string> = { low: 'text-text-muted bg-surface-3', medium: 'text-warning bg-warning/10', high: 'text-danger bg-danger/10' }

export default function ComprasPage() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState<'want' | 'bought'>('want')
  const [form, setForm] = useState({ name: '', estimated_price: '', url: '', priority: 'medium' as Priority, notes: '' })

  useEffect(() => { loadItems() }, [])

  async function loadItems() {
    const res = await fetch('/api/shopping')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/shopping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        estimated_price: form.estimated_price ? parseFloat(form.estimated_price) : null,
        url: form.url || null,
        notes: form.notes || null,
      }),
    })
    setShowForm(false)
    setForm({ name: '', estimated_price: '', url: '', priority: 'medium', notes: '' })
    loadItems()
  }

  async function togglePurchased(item: ShoppingItem) {
    await fetch('/api/shopping', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, purchased: !item.purchased }),
    })
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, purchased: !i.purchased } : i))
  }

  async function handleDelete(id: string) {
    await fetch('/api/shopping', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const wantItems = items.filter((i) => !i.purchased)
  const boughtItems = items.filter((i) => i.purchased)
  const displayed = tab === 'want' ? wantItems : boughtItems
  const totalEstimated = wantItems.reduce((s, i) => s + (i.estimated_price || 0), 0)

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-black text-white">🛒 Compras</h1>
            <p className="text-text-muted text-sm mt-0.5">{wantItems.length} itens · estimado R${totalEstimated.toFixed(2)}</p>
          </div>
          <button onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105">
            <Plus size={16} /> Adicionar
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-surface border border-primary/30 rounded-2xl p-5 my-4 space-y-3">
            <h3 className="font-bold text-white">Novo item</h3>
            <input type="text" placeholder="Nome do produto" required
              value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="0.01" min="0" placeholder="Preço estimado (R$)"
                value={form.estimated_price} onChange={(e) => setForm(f => ({ ...f, estimated_price: e.target.value }))}
                className="bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary" />
              <select value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                className="bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary">
                <option value="low">Baixa prioridade</option>
                <option value="medium">Média prioridade</option>
                <option value="high">Alta prioridade</option>
              </select>
            </div>
            <input type="url" placeholder="URL do produto (opcional)"
              value={form.url} onChange={(e) => setForm(f => ({ ...f, url: e.target.value }))}
              className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary" />
            <input type="text" placeholder="Notas (opcional)"
              value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary" />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-2 text-text-muted text-sm font-medium transition-all hover:text-white">Cancelar</button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-black text-sm font-bold transition-all">Adicionar</button>
            </div>
          </form>
        )}

        <div className="flex bg-surface rounded-xl p-1 my-4">
          <button onClick={() => setTab('want')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'want' ? 'bg-surface-3 text-white' : 'text-text-muted'}`}>
            Quero comprar ({wantItems.length})
          </button>
          <button onClick={() => setTab('bought')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'bought' ? 'bg-surface-3 text-white' : 'text-text-muted'}`}>
            Já comprei ({boughtItems.length})
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 bg-surface rounded-xl animate-pulse" />)}</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-white">{tab === 'want' ? 'Lista vazia' : 'Nenhum item comprado ainda'}</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {displayed.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-surface border border-surface-3 rounded-xl px-4 py-3 flex items-center gap-3">
                  <button onClick={() => togglePurchased(item)}
                    className={cn('w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0', item.purchased ? 'bg-primary border-primary' : 'border-surface-3 hover:border-primary')}>
                    {item.purchased && <Check size={12} className="text-black" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium truncate', item.purchased ? 'text-text-muted line-through' : 'text-white')}>{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.estimated_price && <span className="text-xs text-primary">R${Number(item.estimated_price).toFixed(2)}</span>}
                      {item.notes && <span className="text-xs text-text-dim truncate max-w-[120px]">{item.notes}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', PRIORITY_COLOR[item.priority])}>
                      {PRIORITY_LABEL[item.priority]}
                    </span>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">
                        <ExternalLink size={13} />
                      </a>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="text-text-dim hover:text-danger transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </AppShell>
  )
}
