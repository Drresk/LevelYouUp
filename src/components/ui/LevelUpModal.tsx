'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import confetti from 'canvas-confetti'

interface LevelUpModalProps {
  skillName: string
  newLevel: number
  onClose: (reward: string) => void
}

export default function LevelUpModal({ skillName, newLevel, onClose }: LevelUpModalProps) {
  const [reward, setReward] = useState('')

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1DB954', '#ffffff', '#ffd700'],
    })
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="bg-surface border border-surface-3 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="text-7xl mb-4"
        >
          🎉
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-1">LEVEL UP!</h2>
        <p className="text-text-muted mb-1">{skillName}</p>
        <div className="flex items-center justify-center gap-2 mb-6">
          <Star className="text-primary fill-primary" size={20} />
          <span className="text-3xl font-black text-primary">Nível {newLevel}</span>
          <Star className="text-primary fill-primary" size={20} />
        </div>

        <p className="text-sm text-text-muted mb-3">
          Você merece se mimar! Qual será sua recompensa?
        </p>
        <input
          type="text"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="Ex: Pedir pizza, assistir um filme..."
          className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm mb-4 focus:outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={() => onClose(reward)}
          className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 rounded-xl transition-all hover:scale-105"
        >
          {reward ? 'Resgatar recompensa! 🎁' : 'Pular por agora'}
        </button>
      </motion.div>
    </div>
  )
}
