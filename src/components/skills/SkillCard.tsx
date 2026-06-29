'use client'

import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { Skill } from '@/types'
import XPBar from '@/components/ui/XPBar'
import StreakBadge from '@/components/ui/StreakBadge'
import PixelIcon from '@/components/ui/PixelIcon'
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
      className="clay-card p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <Link href={`/skills/${skill.id}`} className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-11 h-11 rounded-clay-sm flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: `linear-gradient(145deg, ${skill.color}30, ${skill.color}15)`,
              border: `1px solid ${skill.color}50`,
              boxShadow: `0 4px 12px ${skill.color}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
            }}
          >
            {skill.icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold font-display text-text-base truncate">{skill.name}</h3>
            <p className="text-xs text-text-muted stat-num">Nv.{skill.level}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <StreakBadge streak={skill.streak} size="sm" />
          {onDelete && (
            <button
              onClick={() => onDelete(skill.id)}
              className="text-text-dim hover:text-crimson transition-colors p-1"
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
          className="clay-btn clay-btn-dark mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs"
        >
          <PixelIcon icon="pomodoro" size={14} />
          Iniciar Pomodoro
        </button>
      )}
    </motion.div>
  )
}
