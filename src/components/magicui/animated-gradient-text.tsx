import { cn } from '@/lib/utils'

interface AnimatedGradientTextProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn('animate-shimmer bg-clip-text text-transparent', className)}
      style={{
        backgroundImage: 'linear-gradient(90deg, #6B2FD4, #F5A623, #00D4FF, #6B2FD4)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s linear infinite',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  )
}
