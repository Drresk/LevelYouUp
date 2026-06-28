'use client'

import { motion } from 'framer-motion'
import { xpProgress } from '@/lib/utils/xp'

interface XPBarProps {
  currentXP: number
  xpToNextLevel: number
  level: number
  showText?: boolean
  height?: number
  color?: string
}

export default function XPBar({ currentXP, xpToNextLevel, level, showText = true, height = 10, color = '#6B2FD4' }: XPBarProps) {
  const percent = xpProgress(currentXP, xpToNextLevel)

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-display font-bold text-text-muted">Nível {level}</span>
          <span className="stat-num text-text-dim">{currentXP}/{xpToNextLevel} XP</span>
        </div>
      )}
      <div className="clay-xp-bar w-full" style={{ height }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="h-full clay-xp-fill"
          style={{
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}80`,
            borderRadius: '100px',
          }}
        />
      </div>
    </div>
  )
}
