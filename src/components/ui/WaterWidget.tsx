'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Droplets } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

const DAILY_GOAL_ML = 2000

export default function WaterWidget() {
  const [totalMl, setTotalMl] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadToday() }, [])

  async function loadToday() {
    const supabase = createClient()
    const today = format(new Date(), 'yyyy-MM-dd')
    const { data } = await supabase
      .from('water_logs')
      .select('amount_ml')
      .gte('logged_at', today)
    const total = (data || []).reduce((s, r) => s + r.amount_ml, 0)
    setTotalMl(total)
    setLoading(false)
  }

  async function quickLog() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('water_logs').insert({ user_id: user.id, amount_ml: 250 })
    setTotalMl((p) => Math.min(p + 250, DAILY_GOAL_ML + 500))
  }

  const pct = Math.min((totalMl / DAILY_GOAL_ML) * 100, 100)
  const glasses = Math.floor(totalMl / 250)

  return (
    <div className="rpg-card p-4 flex items-center gap-4">
      {/* Glass fill */}
      <button onClick={quickLog} className="relative w-12 h-16 flex-shrink-0" title="Clique para +250ml">
        <div className="absolute inset-0 rounded-lg border border-cyan/30 bg-surface-3 overflow-hidden">
          <motion.div
            initial={{ height: '0%' }}
            animate={{ height: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 right-0 rounded-b-lg"
            style={{ background: 'linear-gradient(180deg, rgba(6,182,212,0.6) 0%, rgba(6,182,212,0.9) 100%)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplets size={18} className="text-cyan drop-shadow-sm" />
          </div>
        </div>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-text-base">Hidratação</p>
          <p className="stat-num text-xs text-cyan">{totalMl}ml / {DAILY_GOAL_ML}ml</p>
        </div>
        <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden mb-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #06b6d4, #0891b2)' }}
          />
        </div>
        <p className="text-[10px] text-text-dim">
          {loading ? '...' : pct >= 100
            ? '✅ Meta atingida!'
            : `${glasses} / 8 copos • toque no copo para +250ml`}
        </p>
      </div>
    </div>
  )
}
