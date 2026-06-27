interface StreakBadgeProps {
  streak: number
  size?: 'sm' | 'md' | 'lg'
}

export default function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  if (streak === 0) return null

  const sizes = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 rounded-full font-semibold ${sizes[size]}`}
    >
      🔥 {streak}
    </span>
  )
}
