'use client'

import { Profile, Avatar, UserWallet } from '@/types'
import AvatarDisplay from '@/components/avatar/AvatarDisplay'
import PixelIcon from '@/components/ui/PixelIcon'

interface CharacterCardProps {
  profile: Profile | null
  avatar?: Avatar | null
  wallet?: UserWallet | null
  compact?: boolean
}

function ScoreRing({ score, size = 84 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * Math.min(score / 1000, 1)
  const ringClass = score < 401 ? 'score-ring-gray' : score < 601 ? 'score-ring-blue' : score < 801 ? 'score-ring-purple' : 'score-ring-gold'
  const color = score < 401 ? '#64748b' : score < 601 ? '#3b82f6' : score < 801 ? '#6B2FD4' : '#F5A623'

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(40,40,112,0.8)" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`} className={ringClass} />
      </svg>
      <div className="text-center z-10">
        <p className="stat-num font-black leading-none" style={{ fontSize: 17, color }}>{score}</p>
        <p className="text-[8px] font-bold text-text-dim leading-none mt-0.5 font-display">SCORE</p>
      </div>
    </div>
  )
}

export default function CharacterCard({ profile, avatar, wallet, compact = false }: CharacterCardProps) {
  if (!profile) return null

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-clay-sm"
        style={{ background: 'linear-gradient(145deg, #1E1E50, #16163A)', boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
        <AvatarDisplay avatar={avatar} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black font-display text-text-base truncate">{profile.name || 'Herói'}</p>
          <p className="text-[10px] font-bold" style={{ color: '#9B7FE8' }}>{profile.title || 'Novato'}</p>
        </div>
        {wallet && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.25)' }}>
            <PixelIcon icon="coin" size={14} />
            <span className="stat-num text-xs font-bold" style={{ color: '#F5A623' }}>{wallet.coins}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-clay p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #1E1E50 0%, #16163A 60%, #1A103A 100%)',
        boxShadow: '0 12px 32px rgba(107,47,212,0.3), 0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        border: '1px solid rgba(107,47,212,0.25)',
      }}>
      {/* Glow spot */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{ background: '#6B2FD4' }} />

      <div className="flex items-center gap-4 relative">
        <AvatarDisplay avatar={avatar} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="text-xl font-black font-display text-text-base truncate">{profile.name || 'Herói'}</p>
          <p className="text-sm font-bold mb-2" style={{ color: '#9B7FE8' }}>{profile.title || 'Novato'}</p>
          {profile.username && <p className="text-xs text-text-dim">@{profile.username}</p>}
          {wallet && (
            <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full w-fit"
              style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)' }}>
              <PixelIcon icon="coin" size={16} />
              <span className="stat-num text-sm font-black" style={{ color: '#F5A623' }}>
                {wallet.coins.toLocaleString('pt-BR')}
              </span>
            </div>
          )}
        </div>
        <ScoreRing score={profile.profile_score || 0} />
      </div>
    </div>
  )
}
