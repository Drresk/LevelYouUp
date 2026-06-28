'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from '@/components/layout/AppShell'
import PixelIcon from '@/components/ui/PixelIcon'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  icon_key: string
  color: string
  monthly_limit: number | null
  is_income: boolean
  sort_order: number
}

const COLORS = ['#F5A623','#8B5CF6','#FF3B5C','#00C875','#6B2FD4','#00D4FF','#FCD34D','#94A3B8','#F97316','#EC4899']
const ICONS = ['coin','sword','shield','star','crown','heart','flame','lightning','chest','gem','wallet','calendar','pomodoro','trophy','water','person','badge']

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', icon_key: 'coin', color: '#F5A623', monthly_limit: '', is_income: false })
  const router = useRouter()

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch('/api/financial/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  function openNew() { setEditing(null); setForm({ name: '', icon_key: 'coin', color: '#F5A623', monthly_limit: '', is_income: false }); setShowForm(true) }
  function openEdit(cat: Category) { setEditing(cat); setForm({ name: cat.name, icon_key: cat.icon_key, color: cat.color, monthly_limit: cat.monthly_limit?.toString() || '', is_income: cat.is_income }); setShowForm(true) }

  async function handleSave() {
    const payload = { ...form, monthly_limit: form.monthly_limit ? parseFloat(form.monthly_limit) : null }
    if (editing) {
      await fetch('/api/financial/categories', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...payload }) })
    } else {
      await fetch('/api/financial/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    }
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    await fetch('/api/financial/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const expense = categories.filter(c => !c.is_income)
  const income = categories.filter(c => c.is_income)

  function Section({ title, cats }: { title: string; cats: Category[] }) {
    return (
      <div className="mb-6">
        <p className="text-xs font-display font-bold text-text-dim uppercase tracking-widest mb-3">{title}</p>
        <div className="space-y-2">
          {cats.map(cat => (
            <motion.div key={cat.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="clay-card flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: cat.color + '20', border: `1px solid ${cat.color}40` }}>
                <PixelIcon icon={cat.icon_key} size={4} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-bold text-text-base">{cat.name}</p>
                {cat.monthly_limit && (
                  <p className="text-xs text-text-dim">Limite: R${cat.monthly_limit.toFixed(2)}/mês</p>
                )}
              </div>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }} />
              <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-dim hover:text-text-base transition-all">
                <Edit2 size={13} />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-crimson/10 text-text-dim hover:text-crimson transition-all">
                <Trash2 size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-white/5 text-text-dim transition-all">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold text-text-base">Categorias</h1>
            <p className="text-xs text-text-dim">Personalize suas categorias financeiras</p>
          </div>
          <button onClick={openNew} className="clay-btn clay-btn-purple flex items-center gap-2 px-4 py-2.5 text-sm">
            <Plus size={15} /> Nova
          </button>
        </div>

        {/* Bottom sheet form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="clay-card p-5 mb-6">
              <h3 className="font-display font-bold text-text-base mb-4">{editing ? 'Editar' : 'Nova'} categoria</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-dim mb-1.5 block">Nome</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ex: Saúde, Educação..."
                    className="chat-bar-input w-full" />
                </div>

                {/* Type toggle */}
                <div className="flex rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <button onClick={() => setForm(f => ({ ...f, is_income: false }))}
                    className={`flex-1 py-2 text-xs font-display font-bold transition-all ${!form.is_income ? 'clay-btn-crimson rounded-l-xl' : 'text-text-dim'}`}>
                    Despesa
                  </button>
                  <button onClick={() => setForm(f => ({ ...f, is_income: true }))}
                    className={`flex-1 py-2 text-xs font-display font-bold transition-all ${form.is_income ? 'clay-btn-emerald rounded-r-xl' : 'text-text-dim'}`}>
                    Receita
                  </button>
                </div>

                {/* Color */}
                <div>
                  <label className="text-xs text-text-dim mb-2 block">Cor</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                        className="w-7 h-7 rounded-full transition-all hover:scale-110"
                        style={{ background: c, boxShadow: form.color === c ? `0 0 0 3px #fff, 0 0 0 5px ${c}` : 'none' }} />
                    ))}
                  </div>
                </div>

                {/* Icon */}
                <div>
                  <label className="text-xs text-text-dim mb-2 block">Ícone</label>
                  <div className="flex gap-2 flex-wrap">
                    {ICONS.map(ic => (
                      <button key={ic} onClick={() => setForm(f => ({ ...f, icon_key: ic }))}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={form.icon_key === ic
                          ? { background: form.color + '30', border: `2px solid ${form.color}` }
                          : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <PixelIcon icon={ic} size={4} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly limit */}
                {!form.is_income && (
                  <div>
                    <label className="text-xs text-text-dim mb-1.5 block">Limite mensal (opcional)</label>
                    <input type="number" step="0.01" min="0" value={form.monthly_limit}
                      onChange={e => setForm(f => ({ ...f, monthly_limit: e.target.value }))}
                      placeholder="R$ 0.00"
                      className="chat-bar-input w-full" />
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setShowForm(false)} className="flex-1 clay-btn clay-btn-dark py-2.5 text-sm">Cancelar</button>
                  <button onClick={handleSave} disabled={!form.name.trim()} className="flex-1 clay-btn clay-btn-purple py-2.5 text-sm disabled:opacity-50">
                    {editing ? 'Salvar' : 'Criar'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: '#13132A' }} />)}</div>
        ) : (
          <>
            <Section title="Despesas" cats={expense} />
            <Section title="Receitas" cats={income} />
          </>
        )}
      </div>
    </AppShell>
  )
}
