'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export function CountUp({ end, start = 0, duration = 1500, prefix = '', suffix = '', decimals = 0, className }: CountUpProps) {
  const [value, setValue] = useState(start)
  const frameRef = useRef<number>()
  const startTimeRef = useRef<number>()

  useEffect(() => {
    startTimeRef.current = undefined
    const startVal = start

    function animate(now: number) {
      if (!startTimeRef.current) startTimeRef.current = now
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(startVal + (end - startVal) * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [end, start, duration])

  return (
    <span className={cn('stat-num tabular-nums', className)}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  )
}
