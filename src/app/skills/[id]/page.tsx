'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Timer, Gift } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import AppShell from '@/components/layout/AppShell'
import XPBar from '@/components/ui/XPBar'
import StreakBadge from '@/components/ui/StreakBadge'
import { Skill, PomodoroSession, LevelReward } from '@/types'
import { createClient } from '@/lib/supabase/client'

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [skill, setSkill] = useState<Skill | null>(null)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [rewards, setRewards] = useState<LevelReward[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    const supabase = createClient()
    const [{ data: sk }, { data: sess }, { data: rew }] = await Promise.all([
      supabase.from('skills').select('*').eq('id', id).single(),
      supabase.from('pomodoro_sessions').select('*').eq('skill_id', id).order('started_at', { ascending: false }).limit(50),
      supabase.from('level_rewards').select('*').eq('skill_id', id).order('created_at', { ascending: false }),
    ])
    setSkill(sk)
    setSessions((sess || []) as PomodoroSession[])
    setRewards((rew || []) as LevelReward[])
    setLoading(false)
  }

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="h-48 bg-surface rounded-2xl animate-pulse" />
        </div>
      </AppShell>
    )
  }

  if (!skill) return <AppShell><div className="p-6 text-text-muted">Skill não encontrada.</div></AppShell>

  const totalMinutes = sessions.filter((s) => s.completed).reduce((sum, s) => sum + s.duration_minutes, 0)

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Skill header */}
        <div className="bg-surface border border-surface-3 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: skill.color + '20', border: `2px solid ${skill.color}40` }}
            >
              {skill.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{skill.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-text-muted">Nível {skill.level}</span>
                <StreakBadge streak={skill.streak} />
              </div>
            </div>
          </div>

          <XPBar
            currentXP={skill.current_xp}
            xpToNextLevel={skill.xp_to_next_level}
            level={skill.level}
            color={skill.color}
            height={10}
          />

          <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-surface-3">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{skill.level}</p>
              <p className="text-xs text-text-muted">Nível</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">{skill.total_xp.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-text-muted">XP Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">{totalMinutes}</p>
              <p className="text-xs text-text-muted">Minutos</p>
            </div>
          </div>
        </div>

        {/* Start Pomodoro CTA */}
        <button
          onClick={() => router.push(`/pomodoro?skill=${skill.id}`)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-black font-bold transition-all mb-6 hover:scale-[1.02]"
        >
          <Timer size={18} />
          Iniciar Pomodoro
        </button>

        {/* Rewards */}
        {rewards.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Gift size={16} className="text-primary" />
              Recompensas "Se Mimar"
            </h2>
            <div className="space-y-2">
              {rewards.map((r) => (
                <div key={r.id} className="bg-surface border border-surface-3 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{r.reward_description}</p>
                    <p className="text-xs text-text-muted">Nível {r.level_reached}</p>
                  </div>
                  {r.redeemed && <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">Resgatada</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions */}
        <div>
          <h2 className="text-base font-bold text-white mb-3">Histórico de sessões</h2>
          {sessions.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">Nenhuma sessão ainda.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div key={s.id} className="bg-surface border border-surface-3 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">
                      {s.completed ? '✅' : '❌'} {s.duration_minutes} min
                    </p>
                    <p className="text-xs text-text-muted">
                      {format(new Date(s.started_at), "d 'de' MMM, HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-primary">+{s.xp_earned} XP</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
