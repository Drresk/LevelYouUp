'use client'

import { Profile, Avatar, UserWallet } from '@/types'
import AvatarDisplay from '@/components/avatar/AvatarDisplay'
import { Coins } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CharacterCardProps {
  profile: Profile | null
  avatar?: Avatar | null
  wallet?: UserWallet | null
  compact?: boolean
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(score / 1000, 1)
  const dash = circ * pct
  const color = score < 401 ? '#64748b' : score < 601 ? '#3b82f6' : score < 801 ? '#8b5cf6' : '#f59e0b'
  const ringClass = score < 401 ? 'score-ring-gray' : score < 601 ? 'score-ring-blue' : score < 801 ? 'score-ring-purple' : 'score-ring-gold'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#252560" strokeWidth="4" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className={ringClass}
        />
      </svg>
      <div className="text-center z-10">
        <p className="stat-num text-lg font-black leading-none" style={{ color }}>{score}</p>
        <p className="text-[9px] text-text-dim leading-none mt-0.5">SCORE</p>
      </div>
    </div>
  )
}

export default function CharacterCard({ profile, avatar, wallet, compact = false }: CharacterCardProps) {
  if (!profile) return null

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-2 border border-[rgba(139,92,246,0.2)]">
        <AvatarDisplay avatar={avatar} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-base truncate">{profile.name || 'Herói'}</p>
          <p className="text-[10px] text-purple truncate">{profile.title || 'Novato'}</p>
        </div>
        {wallet && (
          <div className="flex items-center gap-1 text-gold">
            <Coins size={12} />
            <span className="stat-num text-xs font-bold">{wallet.coins}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rpg-card-gold p-5 rounded-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-transparent to-gold/5 pointer-events-none" />

      <div className="flex items-center gap-4 relative">
        <AvatarDisplay avatar={avatar} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="text-xl font-black text-text-base truncate">{profile.name || 'Herói'}</p>
          <p className="text-sm text-purple font-medium mb-1">{profile.title || 'Novato'}</p>
          {profile.username && (
            <p className="text-xs text-text-dim">@{profile.username}</p>
          )}
          {wallet && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-1 bg-gold-muted border border-gold/20 px-2 py-0.5 rounded-full">
                <span className="text-sm">🪙</span>
                <span className="stat-num text-sm font-bold text-gold">{wallet.coins.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          )}
        </div>
        <ScoreRing score={profile.profile_score || 0} />
      </div>
    </div>
  )
}
