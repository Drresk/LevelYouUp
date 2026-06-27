'use client'

import { useSearchParams } from 'next/navigation'
import PomodoroTimer from '@/components/pomodoro/PomodoroTimer'

export default function PomodoroTimerWrapper() {
  const params = useSearchParams()
  const skillId = params.get('skill') || undefined
  return <PomodoroTimer initialSkillId={skillId} />
}
