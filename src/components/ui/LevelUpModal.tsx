'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import PixelIcon from '@/components/ui/PixelIcon'

export interface LevelUpReward { coins: number; shields: number; tokens: number }

function getLevelReward(level: number): LevelUpReward {
  const r: LevelUpReward = { coins: 50, shields: 0, tokens: 0 }
  if (level === 5)  { r.shields = 1 }
  if (level === 10) { r.tokens = 1; r.coins = 150 }
  if (level === 15) { r.shields = 2; r.coins = 100 }
  if (level === 20) { r.tokens = 1; r.coins = 300 }
  if (level > 20 && level % 10 === 0) { r.tokens = 1; r.coins = 500 }
  return r
}

interface LevelUpModalProps {
  skillName: string
  newLevel: number
  onClose: () => void
}

export default function LevelUpModal({ skillName, newLevel, onClose }: LevelUpModalProps) {
  const reward = getLevelReward(newLevel)

  useEffect(() => {
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#F5A623', '#6B2FD4', '#FFFFFF', '#00D4FF'] })
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-full max-w-sm mx-4 overflow-hidden rounded-clay"
        style={{
          background: 'linear-gradient(145deg, #1E1E50, #0D0D2A)',
          border: '2px solid rgba(245,166,35,0.5)',
          boxShadow: '0 24px 64px rgba(245,166,35,0.3), 0 8px 32px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.1)',
        }}>
        {/* Gold bar */}
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #6B2FD4, #F5A623, #6B2FD4)' }} />

        <div className="p-7 text-center">
          <motion.div animate={{ rotate: [0,-15,15,-15,0], scale: [1,1.3,1] }} transition={{ duration: 0.7 }}
            className="flex justify-center mb-4">
            <PixelIcon icon="star" size={56} />
          </motion.div>

          <p className="font-display text-xs font-black tracking-widest uppercase mb-1" style={{ color: '#9B7FE8' }}>
            LEVEL UP!
          </p>
          <h2 className="font-display text-4xl font-black mb-1 animate-pulse-gold" style={{ color: '#F5A623' }}>
            Nível {newLevel}
          </h2>
          <p className="text-text-muted text-sm font-medium mb-6">{skillName}</p>

          {/* Rewards */}
          <div className="rounded-clay-sm p-4 mb-6 space-y-2.5"
            style={{ background: '#0D0D2A', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
            <p className="text-[10px] font-display font-black text-text-dim uppercase tracking-widest mb-3">Recompensas</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-text-muted font-medium">
                <PixelIcon icon="coin" size={18} /> Moedas
              </span>
              <span className="stat-num font-black" style={{ color: '#F5A623' }}>+{reward.coins}</span>
            </div>
            {reward.shields > 0 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-text-muted font-medium">
                  <PixelIcon icon="shield" size={18} /> Escudos
                </span>
                <span className="stat-num font-black" style={{ color: '#00D4FF' }}>+{reward.shields}</span>
              </div>
            )}
            {reward.tokens > 0 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-text-muted font-medium">
                  <PixelIcon icon="gem" size={18} /> Token
                </span>
                <span className="stat-num font-black" style={{ color: '#9B7FE8' }}>+{reward.tokens}</span>
              </div>
            )}
          </div>

          <button onClick={onClose}
            className="clay-btn clay-btn-gold w-full py-3.5 text-sm font-display font-black">
            ⚔️ Continuar Jornada
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export { getLevelReward }
