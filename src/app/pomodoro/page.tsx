import { Suspense } from 'react'
import AppShell from '@/components/layout/AppShell'
import PomodoroTimerWrapper from './PomodoroTimerWrapper'

export default function PomodoroPage() {
  return (
    <AppShell>
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto mb-6">
          <h1 className="text-2xl font-black text-white">🍅 Pomodoro</h1>
          <p className="text-text-muted text-sm mt-0.5">Foque. Ganhe XP. Evolua.</p>
        </div>
        <Suspense>
          <PomodoroTimerWrapper />
        </Suspense>
      </div>
    </AppShell>
  )
}
