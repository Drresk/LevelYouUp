'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Timer, TrendingUp, TrendingDown, ArrowRight, Coins } from 'lucide-react'
import PixelIcon from '@/components/ui/PixelIcon'
import { motion } from 'framer-motion'
import XPBar from '@/components/ui/XPBar'
import StreakBadge from '@/components/ui/StreakBadge'
import WaterWidget from '@/components/ui/WaterWidget'
import CharacterCard from '@/components/profile/CharacterCard'
import { Skill, Transaction, CalendarEvent, UserAchievement, Profile, Avatar, UserWallet, WeeklyChallenge, ChallengePool } from '@/types'

function greeting(name: string): string {
  const h = new Date().getHours()
  const p = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  return `${p}, ${name?.split(' ')[0] || 'Herói'}`
}

export default function DashboardClient({ profile: initialProfile }: { profile: Profile | null }) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [avatar, setAvatar] = useState<Avatar | null>(null)
  const [wallet, setWallet] = useState<UserWallet | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [lastAchievement, setLastAchievement] = useState<UserAchievement | null>(null)
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const now = new Date()
    const monthStart = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd')
    const today = format(now, 'yyyy-MM-dd')

    const [{ data: sk }, { data: tx }, { data: ev }, { data: ach }, { data: av }, { data: wl }, chal] = await Promise.all([
      supabase.from('skills').select('*').order('created_at', { ascending: false }).limit(3),
      supabase.from('transactions').select('*').gte('created_at', monthStart),
      supabase.from('calendar_events').select('*').eq('completed', false).gte('date', today).order('date').limit(3),
      supabase.from('user_achievements').select('*, achievement:achievements(*)').order('unlocked_at', { ascending: false }).limit(1),
      supabase.from('avatars').select('*').eq('user_id', user.id).single(),
      supabase.from('user_wallet').select('*').eq('user_id', user.id).single(),
      fetch('/api/challenges').then((r) => r.json()),
    ])

    setSkills((sk || []) as Skill[])
    setTransactions((tx || []) as Transaction[])
    setEvents((ev || []) as CalendarEvent[])
    setLastAchievement(ach?.[0] as UserAchievement || null)
    setAvatar(av)
    setWallet(wl)
    setChallenges(chal || [])
    setLoading(false)
  }

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const balance = income - expenses
  const completedChallenges = challenges.filter((c) => c.completed).length

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {[1,2,3,4].map((i) => <div key={i} className="h-32 bg-surface rounded-2xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Greeting + Character Card */}
      <div>
        <p className="text-xs text-text-dim mb-1">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
        <h1 className="text-2xl font-black font-display text-text-base mb-4">{greeting(profile?.name || '')}</h1>
        <CharacterCard profile={profile} avatar={avatar} wallet={wallet} />
      </div>

      {/* Skills */}
      <div className="clay-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black font-display text-text-base flex items-center gap-2">
            <PixelIcon icon="sword" size={20} /> Skills
          </h2>
          <Link href="/skills" className="text-xs text-purple hover:underline flex items-center gap-1">Ver todas <ArrowRight size={11} /></Link>
        </div>
        {skills.length === 0 ? (
          <p className="text-text-dim text-sm text-center py-3">
            <Link href="/skills" className="text-purple">Criar primeira skill →</Link>
          </p>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span>{skill.icon}</span>
                    <span className="text-sm font-bold text-text-base">{skill.name}</span>
                    <span className="stat-num text-xs text-text-dim">Nv.{skill.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StreakBadge streak={skill.streak} size="sm" />
                    <button onClick={() => router.push(`/pomodoro?skill=${skill.id}`)}
                      className="flex items-center gap-1 text-xs bg-purple-muted text-purple px-2 py-1 rounded-lg hover:bg-purple/20 transition-all">
                      <Timer size={10} /> Focar
                    </button>
                  </div>
                </div>
                <XPBar currentXP={skill.current_xp} xpToNextLevel={skill.xp_to_next_level} level={skill.level} color={skill.color} showText={false} height={5} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Water */}
      <WaterWidget />

      {/* Challenges */}
      <div className="rpg-card-gold p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black font-display text-text-base flex items-center gap-2">
            <PixelIcon icon="scroll" size={20} /> Desafios da Semana
          </h2>
          <Link href="/challenges" className="text-xs text-gold hover:underline flex items-center gap-1">{completedChallenges}/3 <ArrowRight size={11} /></Link>
        </div>
        {challenges.length === 0 ? (
          <p className="text-text-dim text-sm">Nenhum desafio ainda.</p>
        ) : (
          <div className="space-y-2">
            {challenges.slice(0, 3).map((wc) => {
              const ch = wc.challenge as unknown as ChallengePool
              if (!ch) return null
              const pct = Math.min((wc.progress / ch.target_value) * 100, 100)
              return (
                <div key={wc.id} className="flex items-center gap-3">
                  <span className="text-lg">{ch.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={wc.completed ? 'text-gold font-bold' : 'text-text-muted'}>{ch.title}</span>
                      <span className="text-text-dim stat-num">{wc.progress}/{ch.target_value}</span>
                    </div>
                    <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: wc.completed ? '#f59e0b' : '#8b5cf6' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Financial */}
      <div className="clay-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black font-display text-text-base flex items-center gap-2">
            <PixelIcon icon="wallet" size={20} /> Financeiro
          </h2>
          <Link href="/financeiro" className="text-xs text-purple hover:underline flex items-center gap-1">Ver tudo <ArrowRight size={11} /></Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Entradas', value: income, lucide: TrendingUp, color: '#00C875' },
            { label: 'Saídas', value: expenses, lucide: TrendingDown, color: '#FF3B5C' },
            { label: 'Saldo', value: balance, lucide: Coins, color: balance >= 0 ? '#F5A623' : '#FF3B5C' },
          ].map(({ label, value, lucide: Icon, color }) => (
            <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Icon size={14} style={{ color }} className="mx-auto mb-1" />
              <p className="stat-num text-sm font-black" style={{ color }}>R${Math.abs(value).toFixed(0)}</p>
              <p className="text-[10px] text-text-dim">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="clay-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black font-display text-text-base flex items-center gap-2">
            <PixelIcon icon="calendar" size={20} /> Próximos
          </h2>
          <Link href="/calendario" className="text-xs text-purple hover:underline flex items-center gap-1">Ver todos <ArrowRight size={11} /></Link>
        </div>
        {events.length === 0 ? (
          <p className="text-text-dim text-sm text-center py-2">Sem eventos próximos</p>
        ) : (
          <div className="space-y-2">
            {events.map((e) => (
              <div key={e.id} className="flex items-center gap-2 py-1">
                <div className="w-1 h-6 rounded-full bg-cyan flex-shrink-0" />
                <p className="text-sm text-text-base flex-1 truncate">{e.title}</p>
                <p className="text-xs text-text-dim stat-num flex-shrink-0">
                  {format(new Date(e.date), 'd MMM', { locale: ptBR })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Last Achievement */}
      {lastAchievement?.achievement && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rpg-card p-4 border-l-4 border-l-gold">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{(lastAchievement.achievement as unknown as { icon: string }).icon}</span>
            <div className="flex-1">
              <p className="text-[10px] text-text-dim uppercase tracking-widest">Última conquista</p>
              <p className="text-sm font-bold text-text-base">{(lastAchievement.achievement as unknown as { title: string }).title}</p>
            </div>
            <Link href="/conquistas" className="text-xs text-gold hover:underline flex-shrink-0">Ver todas</Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
