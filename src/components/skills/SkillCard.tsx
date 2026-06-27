'use client'

import { motion } from 'framer-motion'
import { Timer, Trash2 } from 'lucide-react'
import { Skill } from '@/types'
import XPBar from '@/components/ui/XPBar'
import StreakBadge from '@/components/ui/StreakBadge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SkillCardProps {
  skill: Skill
  onDelete?: (id: string) => void
  showPomodoro?: boolean
}

export default function SkillCard({ skill, onDelete, showPomodoro = true }: SkillCardProps) {
  const router = useRouter()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-surface-3 rounded-2xl p-4 hover:border-surface-2 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <Link href={`/skills/${skill.id}`} className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: skill.color + '20', border: `1px solid ${skill.color}40` }}
          >
            {skill.icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">{skill.name}</h3>
            <p className="text-xs text-text-muted">Nível {skill.level}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <StreakBadge streak={skill.streak} size="sm" />
          {onDelete && (
            <button
              onClick={() => onDelete(skill.id)}
              className="text-text-dim hover:text-danger transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <XPBar
        currentXP={skill.current_xp}
        xpToNextLevel={skill.xp_to_next_level}
        level={skill.level}
        color={skill.color}
        height={6}
      />

      {showPomodoro && (
        <button
          onClick={() => router.push(`/pomodoro?skill=${skill.id}`)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-white text-xs font-medium transition-all"
        >
          <Timer size={13} />
          Iniciar Pomodoro
        </button>
      )}
    </motion.div>
  )
}
