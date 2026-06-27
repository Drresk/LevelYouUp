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

export default function XPBar({
  currentXP,
  xpToNextLevel,
  level,
  showText = true,
  height = 8,
  color = '#1DB954',
}: XPBarProps) {
  const percent = xpProgress(currentXP, xpToNextLevel)

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span>Nível {level}</span>
          <span>
            {currentXP}/{xpToNextLevel} XP
          </span>
        </div>
      )}
      <div
        className="w-full bg-surface-3 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}
