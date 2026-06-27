import { Avatar, BASE_CHARACTERS } from '@/types'
import { cn } from '@/lib/utils/cn'

interface AvatarDisplayProps {
  avatar?: Avatar | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZE = { sm: 36, md: 56, lg: 80, xl: 120 }
const FONT = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl', xl: 'text-6xl' }
const OVERLAY = { sm: 'text-xs', md: 'text-sm', lg: 'text-xl', xl: 'text-3xl' }

export default function AvatarDisplay({ avatar, size = 'md', className }: AvatarDisplayProps) {
  const base = BASE_CHARACTERS.find((b) => b.key === (avatar?.base_character || 'warrior')) || BASE_CHARACTERS[0]
  const px = SIZE[size]

  return (
    <div
      className={cn('relative flex items-center justify-center rounded-2xl border-2 flex-shrink-0', className)}
      style={{
        width: px,
        height: px,
        background: `radial-gradient(circle, ${base.color}22 0%, #0e0e2690 100%)`,
        borderColor: base.color + '60',
        boxShadow: `0 0 16px ${base.color}30`,
      }}
    >
      {/* Base character */}
      <span className={FONT[size]}>{base.emoji}</span>

      {/* Cosmetic overlays */}
      {avatar?.head_item && (
        <span className={cn('absolute -top-1.5 left-1/2 -translate-x-1/2', OVERLAY[size])}>
          {getItemEmoji(avatar.head_item)}
        </span>
      )}
      {avatar?.face_item && (
        <span className={cn('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80', OVERLAY[size])}>
          {getItemEmoji(avatar.face_item)}
        </span>
      )}
      {avatar?.accessory_item && (
        <span className={cn('absolute -bottom-1.5 -right-1.5', OVERLAY[size])}>
          {getItemEmoji(avatar.accessory_item)}
        </span>
      )}
    </div>
  )
}

function getItemEmoji(itemKey: string): string {
  const map: Record<string, string> = {
    crown: '👑', wizard_hat: '🎩', helmet: '⛑️', laurel: '🌿',
    sunglasses: '😎', monocle: '🧐', mask: '🎭',
    armor: '🥋', robe: '🧥', cape: '🦸',
    sword: '⚔️', crystal: '🔮', scroll: '📜', shield_acc: '🛡️',
  }
  return map[itemKey] || '✨'
}
