'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { Timer, TrendingUp, TrendingDown, Calendar, ShoppingCart, Trophy, ArrowRight } from 'lucide-react'
import XPBar from '@/components/ui/XPBar'
import StreakBadge from '@/components/ui/StreakBadge'
import { Skill, Transaction, CalendarEvent, ShoppingItem, UserAchievement } from '@/types'
import { Profile } from '@/types'
import { useRouter } from 'next/navigation'

function greeting(name: string): string {
  const h = new Date().getHours()
  const period = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  const firstName = name?.split(' ')[0] || 'você'
  return `${period}, ${firstName} 👋`
}

interface DashboardClientProps {
  profile: Profile | null
}

export default function DashboardClient({ profile }: DashboardClientProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const [lastAchievement, setLastAchievement] = useState<UserAchievement | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    const supabase = createClient()
    const now = new Date()
    const monthStart = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd')

    const [
      { data: sk },
      { data: tx },
      { data: ev },
      { data: sh },
      { data: ach },
    ] = await Promise.all([
      supabase.from('skills').select('*').order('created_at', { ascending: false }).limit(3),
      supabase.from('transactions').select('*').gte('created_at', monthStart),
      supabase.from('calendar_events').select('*').eq('completed', false).gte('date', format(now, 'yyyy-MM-dd')).order('date').limit(3),
      supabase.from('shopping_items').select('*').eq('purchased', false).eq('priority', 'high').limit(4),
      supabase.from('user_achievements').select('*, achievement:achievements(*)').order('unlocked_at', { ascending: false }).limit(1),
    ])

    setSkills((sk || []) as Skill[])
    setTransactions((tx || []) as Transaction[])
    setEvents((ev || []) as CalendarEvent[])
    setShoppingItems((sh || []) as ShoppingItem[])
    setLastAchievement(ach?.[0] as UserAchievement || null)
    setLoading(false)
  }

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const balance = income - expenses

  const generalStreak = skills.length > 0 ? Math.max(...skills.map((s) => s.streak)) : 0

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {[1,2,3,4].map((i) => <div key={i} className="h-32 bg-surface rounded-2xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">{greeting(profile?.name || '')}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StreakBadge streak={generalStreak} />
            <span className="text-xs text-text-muted">streak geral</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">{format(new Date(), "EEEE", { locale: ptBR })}</p>
          <p className="text-sm font-medium text-white">{format(new Date(), "d 'de' MMM", { locale: ptBR })}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-surface border border-surface-3 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white flex items-center gap-2">⚔️ Skills</h2>
          <Link href="/skills" className="text-xs text-primary hover:underline flex items-center gap-1">
            Ver todas <ArrowRight size={12} />
          </Link>
        </div>
        {skills.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4">Nenhuma skill. <Link href="/skills" className="text-primary hover:underline">Criar agora →</Link></p>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{skill.icon}</span>
                    <span className="text-sm font-medium text-white">{skill.name}</span>
                    <span className="text-xs text-text-muted">Nv. {skill.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StreakBadge streak={skill.streak} size="sm" />
                    <button
                      onClick={() => router.push(`/pomodoro?skill=${skill.id}`)}
                      className="flex items-center gap-1 text-xs bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-white px-2 py-1 rounded-lg transition-all"
                    >
                      <Timer size={11} /> Focar
                    </button>
                  </div>
                </div>
                <XPBar currentXP={skill.current_xp} xpToNextLevel={skill.xp_to_next_level} level={skill.level} color={skill.color} showText={false} height={5} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial */}
      <div className="bg-surface border border-surface-3 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white">💰 Financeiro</h2>
          <Link href="/financeiro" className="text-xs text-primary hover:underline flex items-center gap-1">
            Detalhes <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Entradas', value: income, icon: TrendingUp, color: 'text-success' },
            { label: 'Saídas', value: expenses, icon: TrendingDown, color: 'text-danger' },
            { label: 'Saldo', value: balance, icon: TrendingUp, color: balance >= 0 ? 'text-primary' : 'text-danger' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center">
              <Icon size={14} className={`${color} mx-auto mb-1`} />
              <p className={`text-sm font-black ${color}`}>R${Math.abs(value).toFixed(0)}</p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-surface border border-surface-3 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Calendar size={16} className="text-primary" /> Próximos eventos
          </h2>
          <Link href="/calendario" className="text-xs text-primary hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-3">Sem eventos próximos</p>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className="flex items-center gap-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <p className="text-sm text-white flex-1 truncate">{event.title}</p>
                <p className="text-xs text-text-muted flex-shrink-0">
                  {format(new Date(event.date), 'd MMM', { locale: ptBR })}
                  {event.time && ` ${event.time.slice(0, 5)}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shopping */}
      {shoppingItems.length > 0 && (
        <div className="bg-surface border border-surface-3 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <ShoppingCart size={16} className="text-primary" /> Alta prioridade
            </h2>
            <Link href="/compras" className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver lista <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-1.5">
            {shoppingItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <p className="text-sm text-white truncate">{item.name}</p>
                {item.estimated_price && <p className="text-xs text-primary flex-shrink-0 ml-2">R${Number(item.estimated_price).toFixed(2)}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Achievement */}
      {lastAchievement?.achievement && (
        <div className="bg-surface border border-primary/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Trophy size={16} className="text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-muted">Última conquista</p>
              <p className="text-sm font-bold text-white truncate">{(lastAchievement.achievement as unknown as { title: string }).title}</p>
            </div>
            <Link href="/conquistas" className="text-xs text-primary hover:underline flex-shrink-0">
              Ver todas
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
