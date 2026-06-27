'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coins, Trophy } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { WeeklyChallenge, ChallengePool } from '@/types'
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch('/api/challenges')
    const data = await res.json()
    setChallenges(data)
    setLoading(false)
  }

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 })
  const completed = challenges.filter((c) => c.completed).length

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-black text-text-base">🎯 Desafios da Semana</h1>
          <p className="text-text-dim text-xs mt-0.5">
            {format(weekStart, "d 'de' MMM", { locale: ptBR })} – {format(weekEnd, "d 'de' MMM", { locale: ptBR })}
          </p>
        </div>

        {/* Progress */}
        <div className="rpg-card-gold p-4 rounded-2xl mb-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gold-muted border border-gold/30 flex items-center justify-center">
            <Trophy size={24} className="text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-text-base mb-1">{completed} / 3 completos</p>
            <div className="w-full bg-surface-3 rounded-full h-2 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(completed / 3) * 100}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
            </div>
          </div>
          {completed === 3 && <span className="text-2xl animate-bounce">🎉</span>}
        </div>

        {/* Challenges */}
        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-28 bg-surface rounded-2xl animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {challenges.map((wc) => {
              const ch = wc.challenge as unknown as ChallengePool
              if (!ch) return null
              const pct = Math.min((wc.progress / ch.target_value) * 100, 100)

              return (
                <motion.div key={wc.id} layout
                  className={`rounded-2xl p-5 border-2 transition-all ${wc.completed ? 'border-gold bg-gold-muted' : 'border-[rgba(139,92,246,0.2)] bg-surface'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ch.icon}</span>
                      <div>
                        <p className="font-bold text-text-base text-sm">{ch.title}</p>
                        <p className="text-xs text-text-muted">{ch.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gold flex-shrink-0 ml-2">
                      <Coins size={13} />
                      <span className="stat-num text-sm font-bold">+{ch.reward_coins}</span>
                    </div>
                  </div>

                  <div className="w-full bg-surface-3 rounded-full h-2 mb-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: wc.completed ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#8b5cf6,#6d28d9)' }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="stat-num text-xs text-text-muted">{wc.progress} / {ch.target_value}</p>
                    {wc.completed
                      ? <span className="text-xs font-bold text-gold">✓ Completo!</span>
                      : <span className="text-xs text-text-dim">{pct.toFixed(0)}%</span>}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <p className="text-center text-xs text-text-dim mt-6">Novos desafios todo domingo à meia-noite</p>
      </div>
    </AppShell>
  )
}
