'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface GlowingCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function GlowingCard({ children, className, glowColor = 'rgba(107,47,212,0.4)' }: GlowingCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [glow, setGlow] = useState({ x: 0, y: 0, visible: false })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setGlow({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setGlow(g => ({ ...g, visible: false }))}
      className={cn('clay-card relative overflow-hidden', className)}
    >
      {glow.visible && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            background: `radial-gradient(400px circle at ${glow.x}px ${glow.y}px, ${glowColor}, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
