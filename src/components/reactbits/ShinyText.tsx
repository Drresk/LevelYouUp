'use client'

import { cn } from '@/lib/utils'

interface ShinyTextProps {
  children: React.ReactNode
  className?: string
  speed?: number // seconds for one cycle
  color?: string
}

export function ShinyText({ children, className, speed = 2, color = '#ffffff' }: ShinyTextProps) {
  return (
    <span
      className={cn('relative inline-block', className)}
      style={{
        background: `linear-gradient(90deg, ${color}60 0%, ${color} 40%, #ffffff 50%, ${color} 60%, ${color}60 100%)`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: `shimmer ${speed}s linear infinite`,
      }}
    >
      {children}
    </span>
  )
}
