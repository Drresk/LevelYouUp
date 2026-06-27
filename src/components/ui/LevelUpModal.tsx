'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coins, Shield, RefreshCw, Zap } from 'lucide-react'
import confetti from 'canvas-confetti'

export interface LevelUpReward {
  coins: number
  shields: number
  tokens: number
}

function getLevelReward(level: number): LevelUpReward {
  const base: LevelUpReward = { coins: 50, shields: 0, tokens: 0 }
  if (level === 5)  { base.shields = 1 }
  if (level === 10) { base.tokens = 1; base.coins = 150 }
  if (level === 15) { base.shields = 2; base.coins = 100 }
  if (level === 20) { base.tokens = 1; base.coins = 300 }
  if (level > 20 && level % 10 === 0) { base.tokens = 1; base.coins = 500 }
  return base
}

interface LevelUpModalProps {
  skillName: string
  newLevel: number
  onClose: () => void
}

export default function LevelUpModal({ skillName, newLevel, onClose }: LevelUpModalProps) {
  const reward = getLevelReward(newLevel)

  useEffect(() => {
    confetti({ particleCount: 180, spread: 80, origin: { y: 0.6 }, colors: ['#f59e0b', '#8b5cf6', '#ffffff', '#06b6d4'] })
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14 }}
        className="w-full max-w-sm mx-4 rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0e0e26, #1a0e3a)', border: '1px solid rgba(245,158,11,0.4)', boxShadow: '0 0 60px rgba(245,158,11,0.2)' }}
      >
        {/* Header glow bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #8b5cf6, #f59e0b, #8b5cf6)' }} />

        <div className="p-7 text-center">
          <motion.div animate={{ rotate: [0,-12,12,-12,0], scale: [1,1.2,1] }} transition={{ duration: 0.7 }}
            className="text-6xl mb-3">⚔️</motion.div>

          <p className="text-xs font-bold tracking-widest text-purple uppercase mb-1">Level Up!</p>
          <h2 className="text-3xl font-black text-gold glow-gold mb-1">Nível {newLevel}</h2>
          <p className="text-text-muted text-sm mb-6">{skillName}</p>

          {/* Rewards */}
          <div className="bg-surface-2 rounded-2xl p-4 mb-6 space-y-2">
            <p className="text-xs text-text-dim uppercase tracking-widest mb-3">Recompensas</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <Coins size={15} className="text-gold" /> Moedas
              </span>
              <span className="stat-num font-bold text-gold">+{reward.coins}</span>
            </div>
            {reward.shields > 0 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-text-muted">
                  <Shield size={15} className="text-cyan" /> Escudos de Streak
                </span>
                <span className="stat-num font-bold text-cyan">+{reward.shields}</span>
              </div>
            )}
            {reward.tokens > 0 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-text-muted">
                  <RefreshCw size={15} className="text-purple" /> Token de Recuperação
                </span>
                <span className="stat-num font-bold text-purple">+{reward.tokens}</span>
              </div>
            )}
          </div>

          <button onClick={onClose}
            className="w-full py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #f59e0b)', color: '#000' }}>
            Continuar Jornada ⚡
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export { getLevelReward }
