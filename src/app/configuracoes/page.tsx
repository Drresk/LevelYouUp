'use client'

import { useState, useEffect } from 'react'
import { Loader2, Save, Key } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/client'
import { EXPENSE_CATEGORIES } from '@/types'

export default function ConfiguracoesPage() {
  const [profile, setProfile] = useState({ name: '', avatar_url: '' })
  const [salary, setSalary] = useState('')
  const [limits, setLimits] = useState<Record<string, string>>({})
  const [pomodoro, setPomodoro] = useState({ session: '25', short: '5', long: '15', interval: '4' })
  const [apiKeys, setApiKeys] = useState({ haiku: '', sonnet: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: prof }, { data: goals }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('financial_goals').select('*').eq('user_id', user.id),
    ])

    if (prof) setProfile({ name: prof.name || '', avatar_url: prof.avatar_url || '' })
    if (goals) {
      const l: Record<string, string> = {}
      goals.forEach((g) => { l[g.category] = String(g.monthly_limit) })
      setLimits(l)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').update({ name: profile.name }).eq('id', user.id)

    // Upsert financial goals
    for (const cat of EXPENSE_CATEGORIES) {
      if (limits[cat] && parseFloat(limits[cat]) > 0) {
        await supabase.from('financial_goals').upsert({
          user_id: user.id,
          category: cat,
          monthly_limit: parseFloat(limits[cat]),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,category' })
      }
    }

    // Salary to monthly_income
    if (salary) {
      const now = new Date()
      await supabase.from('monthly_income').upsert({
        user_id: user.id,
        source: 'salary',
        amount: parseFloat(salary),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      }, { onConflict: 'user_id,source,month,year' })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppShell>
      <form onSubmit={handleSave} className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white">⚙️ Configurações</h1>
        </div>

        {/* Profile */}
        <section>
          <h2 className="text-base font-bold text-white mb-4">Perfil</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Nome</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                placeholder="Seu nome"
                className="w-full bg-surface border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>
        </section>

        {/* Financial */}
        <section>
          <h2 className="text-base font-bold text-white mb-4">💰 Financeiro</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Salário fixo mensal (R$)</label>
              <input type="number" step="0.01" min="0" value={salary} onChange={(e) => setSalary(e.target.value)}
                placeholder="3000.00"
                className="w-full bg-surface border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <p className="text-xs text-text-muted">Limites mensais por categoria</p>
            <div className="grid grid-cols-2 gap-3">
              {EXPENSE_CATEGORIES.map((cat) => (
                <div key={cat}>
                  <label className="text-xs text-text-muted mb-1 block">{cat}</label>
                  <input type="number" step="0.01" min="0" value={limits[cat] || ''}
                    onChange={(e) => setLimits(l => ({ ...l, [cat]: e.target.value }))}
                    placeholder="0.00"
                    className="w-full bg-surface border border-surface-3 rounded-xl px-3 py-2.5 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pomodoro */}
        <section>
          <h2 className="text-base font-bold text-white mb-4">🍅 Pomodoro</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'session', label: 'Sessão (min)' },
              { key: 'short', label: 'Pausa curta (min)' },
              { key: 'long', label: 'Pausa longa (min)' },
              { key: 'interval', label: 'Intervalo p/ pausa longa' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs text-text-muted mb-1 block">{label}</label>
                <input type="number" min="1" value={pomodoro[key as keyof typeof pomodoro]}
                  onChange={(e) => setPomodoro(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full bg-surface border border-surface-3 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* API Keys */}
        <section>
          <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Key size={16} className="text-primary" /> Chave de API Groq (gratuito)
          </h2>
          <p className="text-xs text-text-muted mb-4">Obtenha gratuitamente em <span className="text-primary">console.groq.com</span>. Usada para o chat com IA.</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Groq API Key</label>
              <input type="password" value={apiKeys.haiku} onChange={(e) => setApiKeys(k => ({ ...k, haiku: e.target.value }))}
                placeholder="gsk_..."
                className="w-full bg-surface border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>
        </section>

        <button type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-black font-bold transition-all hover:scale-[1.02] disabled:opacity-60">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saved ? '✓ Salvo!' : 'Salvar configurações'}
        </button>
      </form>
    </AppShell>
  )
}
