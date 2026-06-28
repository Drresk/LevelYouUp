'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface NumberTickerProps {
  value: number
  decimalPlaces?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function NumberTicker({ value, decimalPlaces = 0, className, prefix = '', suffix = '' }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let start = 0
    const end = value
    const duration = 1200
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * eased

      el!.textContent = `${prefix}${current.toFixed(decimalPlaces)}${suffix}`

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [value, decimalPlaces, prefix, suffix])

  return (
    <span ref={ref} className={cn('stat-num tabular-nums', className)}>
      {prefix}{value.toFixed(decimalPlaces)}{suffix}
    </span>
  )
}
