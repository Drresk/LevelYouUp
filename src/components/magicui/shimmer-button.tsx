'use client'

import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  background?: string
  children: React.ReactNode
  className?: string
}

export function ShimmerButton({
  shimmerColor = 'rgba(255,255,255,0.2)',
  shimmerSize = '0.05em',
  borderRadius = '100px',
  background = 'linear-gradient(145deg, #7B3FE4, #5B1FC4)',
  children,
  className,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        'group relative cursor-pointer overflow-hidden font-display font-black transition-all',
        'active:translate-y-0.5',
        className
      )}
      style={{
        borderRadius,
        background,
        boxShadow: '0 6px 20px rgba(107,47,212,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
      }}
      {...props}
    >
      {/* Shimmer overlay */}
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <span
          className="absolute inset-0 animate-shimmer"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
            backgroundSize: '200% 100%',
          }}
        />
      </span>

      <span className="relative z-10 flex items-center justify-center gap-2 px-6 py-3">
        {children}
      </span>
    </button>
  )
}
