'use client'

import { useState, useEffect } from 'react'
import { Plus, Trophy, Check, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from '@/components/layout/AppShell'
import { Achievement, UserAchievement, PersonalGoal, GoalStatus } from '@/types'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'
import confetti from 'canvas-confetti'

const STATUS_LABEL: Record<GoalStatus, string> = { planning: 'Planejando', in_progress: 'Em progresso', achieved: 'Conquistado' }
const STATUS_COLOR: Record<GoalStatus, string> = { planning: 'text-text-muted bg-surface-3', in_progress: 'text-warning bg-warning/10', achieved: 'text-primary bg-primary-muted' }

const CATEGORIES = ['skills', 'streaks', 'pomodoro', 'financial', 'shopping', 'calendar', 'general']
const CAT_LABEL: Record<string, string> = {
  skills: '⚔️ Skills', streaks: '🔥 Streaks', pomodoro: '🍅 Pomodoro',
  financial: '💰 Financeiro', shopping: '🛒 Compras', calendar: '📅 Calendário', general: '🌐 Geral',
}

export default function ConquistasPage() {
  const [unlocked, setUnlocked] = useState<UserAchievement[]>([])
  const [all, setAll] = useState<Achievement[]>([])
  const [goals, setGoals] = useState<PersonalGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'achievements' | 'goals'>('achievements')
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [goalForm, setGoalForm] = useState({ title: '', description: '', status: 'planning' as GoalStatus })
  const [savingGoal, setSavingGoal] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const res = await fetch('/api/achievements')
    const data = await res.json()
    setUnlocked(data.unlocked || [])
    setAll(data.all || [])
    setGoals(data.goals || [])
    setLoading(false)
  }

  const unlockedKeys = new Set(unlocked.map((u) => u.achievement_key))

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault()
    setSavingGoal(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('personal_goals').insert({ ...goalForm, user_id: user.id })
    setGoalForm({ title: '', description: '', status: 'planning' })
    setShowGoalForm(false)
    setSavingGoal(false)
    loadData()
  }

  async function updateGoalStatus(id: string, status: GoalStatus) {
    const supabase = createClient()
    const updates: Partial<PersonalGoal> = { status }
    if (status === 'achieved') {
      updates.achieved_at = new Date().toISOString()
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 }, colors: ['#1DB954', '#fff', '#ffd700'] })
    }
    await supabase.from('personal_goals').update(updates).eq('id', id)
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, ...updates } : g))
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">🏆 Conquistas</h1>
            <p className="text-text-muted text-sm mt-0.5">
              {unlockedKeys.size} / {all.length} desbloqueadas
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-surface border border-surface-3 rounded-2xl p-4 mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-text-muted">Progresso total</span>
            <span className="text-primary font-bold">{Math.round((unlockedKeys.size / Math.max(all.length, 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-surface-3 rounded-full h-2">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(unlockedKeys.size / Math.max(all.length, 1)) * 100}%` }} />
          </div>
        </div>

        <div className="flex bg-surface rounded-xl p-1 mb-6">
          <button onClick={() => setTab('achievements')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'achievements' ? 'bg-surface-3 text-white' : 'text-text-muted'}`}>Conquistas</button>
          <button onClick={() => setTab('goals')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'goals' ? 'bg-surface-3 text-white' : 'text-text-muted'}`}>Objetivos pessoais</button>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 bg-surface rounded-xl animate-pulse" />)}</div>
        ) : tab === 'achievements' ? (
          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const catAchievements = all.filter((a) => a.category === cat)
              if (catAchievements.length === 0) return null
              return (
                <div key={cat}>
                  <h2 className="text-sm font-bold text-text-muted mb-3">{CAT_LABEL[cat]}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {catAchievements.map((achievement) => {
                      const isUnlocked = unlockedKeys.has(achievement.key)
                      const unlock = unlocked.find((u) => u.achievement_key === achievement.key)
                      return (
                        <div key={achievement.key} className={cn('border rounded-xl p-3 flex items-center gap-3 transition-all', isUnlocked ? 'bg-surface border-primary/30' : 'bg-surface border-surface-3 opacity-50')}>
                          <span className="text-2xl">{achievement.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{achievement.title}</p>
                            <p className="text-xs text-text-muted truncate">{achievement.description}</p>
                          </div>
                          {isUnlocked && <Check size={14} className="text-primary flex-shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowGoalForm((v) => !v)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105">
                <Plus size={16} /> Novo objetivo
              </button>
            </div>

            {showGoalForm && (
              <form onSubmit={handleAddGoal} className="bg-surface border border-primary/30 rounded-2xl p-5 mb-4 space-y-3">
                <input type="text" placeholder="Título do objetivo" required
                  value={goalForm.title} onChange={(e) => setGoalForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary" />
                <textarea placeholder="Descrição (opcional)" rows={3}
                  value={goalForm.description} onChange={(e) => setGoalForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary resize-none" />
                <select value={goalForm.status} onChange={(e) => setGoalForm(f => ({ ...f, status: e.target.value as GoalStatus }))}
                  className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary">
                  <option value="planning">Planejando</option>
                  <option value="in_progress">Em progresso</option>
                  <option value="achieved">Conquistado</option>
                </select>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowGoalForm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-2 text-text-muted text-sm font-medium hover:text-white transition-all">Cancelar</button>
                  <button type="submit" disabled={savingGoal}
                    className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-black text-sm font-bold transition-all flex items-center justify-center gap-2">
                    {savingGoal && <Loader2 size={14} className="animate-spin" />} Criar
                  </button>
                </div>
              </form>
            )}

            {goals.length === 0 ? (
              <div className="text-center py-16 text-text-muted">
                <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium text-white">Sem objetivos ainda</p>
                <p className="text-sm">Defina metas de vida para acompanhar!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-surface border border-surface-3 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-white">{goal.title}</p>
                        {goal.description && <p className="text-sm text-text-muted mt-0.5">{goal.description}</p>}
                        {goal.achieved_at && <p className="text-xs text-primary mt-1">Conquistado em {new Date(goal.achieved_at).toLocaleDateString('pt-BR')}</p>}
                      </div>
                      <span className={cn('text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap', STATUS_COLOR[goal.status])}>
                        {STATUS_LABEL[goal.status]}
                      </span>
                    </div>
                    {goal.status !== 'achieved' && (
                      <div className="flex gap-2 mt-3">
                        {goal.status === 'planning' && (
                          <button onClick={() => updateGoalStatus(goal.id, 'in_progress')}
                            className="text-xs px-3 py-1.5 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-all">
                            Iniciar
                          </button>
                        )}
                        <button onClick={() => updateGoalStatus(goal.id, 'achieved')}
                          className="text-xs px-3 py-1.5 rounded-lg bg-primary-muted text-primary hover:bg-primary/20 transition-all">
                          Marcar como conquistado 🎉
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
