'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Check } from 'lucide-react'
import { Skill } from '@/types'
import LevelUpModal from '@/components/ui/LevelUpModal'
import XPBar from '@/components/ui/XPBar'
import { createClient } from '@/lib/supabase/client'

const DEFAULT_CONFIG = {
  session: 25,
  shortBreak: 5,
  longBreak: 15,
  interval: 4,
}

type Phase = 'focus' | 'shortBreak' | 'longBreak'

interface PomodoroTimerProps {
  initialSkillId?: string
}

export default function PomodoroTimer({ initialSkillId }: PomodoroTimerProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkillId, setSelectedSkillId] = useState<string>(initialSkillId || '')
  const [phase, setPhase] = useState<Phase>('focus')
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_CONFIG.session * 60)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const [elapsedMinutes, setElapsedMinutes] = useState(0)
  const [levelUpData, setLevelUpData] = useState<{ level: number; skillName: string } | null>(null)
  const [currentXP, setCurrentXP] = useState(0)
  const [config] = useState(DEFAULT_CONFIG)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const selectedSkill = skills.find((s) => s.id === selectedSkillId)

  useEffect(() => {
    loadSkills()
  }, [])

  async function loadSkills() {
    const res = await fetch('/api/skills')
    const data = await res.json()
    setSkills(data)
    if (initialSkillId && data.find((s: Skill) => s.id === initialSkillId)) {
      setSelectedSkillId(initialSkillId)
    }
  }

  const phaseLabel = { focus: 'Foco', shortBreak: 'Pausa curta', longBreak: 'Pausa longa' }
  const phaseColor = { focus: '#1DB954', shortBreak: '#3B82F6', longBreak: '#8B5CF6' }
  const totalSeconds = {
    focus: config.session * 60,
    shortBreak: config.shortBreak * 60,
    longBreak: config.longBreak * 60,
  }

  const progress = (totalSeconds[phase] - secondsLeft) / totalSeconds[phase]
  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const secs = (secondsLeft % 60).toString().padStart(2, '0')

  const acquireWakeLock = useCallback(async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      } catch { /* ignore */ }
    }
  }, [])

  const releaseWakeLock = useCallback(() => {
    wakeLockRef.current?.release()
    wakeLockRef.current = null
  }, [])

  async function handleSessionComplete(completed: boolean) {
    if (timerRef.current) clearInterval(timerRef.current)
    setRunning(false)
    releaseWakeLock()

    const durationMins = completed
      ? config.session
      : Math.floor((Date.now() - new Date(startedAt!).getTime()) / 60000)

    const res = await fetch('/api/pomodoro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skill_id: selectedSkillId || null,
        duration_minutes: Math.max(1, durationMins),
        completed,
        started_at: startedAt,
      }),
    })

    const data = await res.json()
    setCurrentXP(data.xpEarned)

    if (completed) {
      const newCycles = cycles + 1
      setCycles(newCycles)

      if (data.leveledUp) {
        setLevelUpData({ level: data.newLevel, skillName: data.skillName })
      }

      const nextPhase: Phase =
        newCycles % config.interval === 0 ? 'longBreak' : 'shortBreak'
      setPhase(nextPhase)
      setSecondsLeft(totalSeconds[nextPhase])
    } else {
      resetTimer()
    }

    setStartedAt(null)
    await loadSkills()
  }

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    setRunning(false)
    setPhase('focus')
    setSecondsLeft(config.session * 60)
    setStartedAt(null)
    setElapsedMinutes(0)
    releaseWakeLock()
  }

  function toggleTimer() {
    if (running) {
      setRunning(false)
      if (timerRef.current) clearInterval(timerRef.current)
      releaseWakeLock()
    } else {
      if (!startedAt) setStartedAt(new Date().toISOString())
      setRunning(true)
      acquireWakeLock()
    }
  }

  useEffect(() => {
    if (!running) return

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (phase === 'focus') {
            handleSessionComplete(true)
          } else {
            setPhase('focus')
            setSecondsLeft(config.session * 60)
            setRunning(false)
            releaseWakeLock()
          }
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [running, phase])

  async function handleLevelUpClose(reward: string) {
    if (reward && selectedSkillId) {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('level_rewards').insert({
          user_id: user.id,
          skill_id: selectedSkillId,
          level_reached: levelUpData!.level,
          reward_description: reward,
        })
        // Check first_reward achievement
        await supabase.from('user_achievements').upsert(
          { user_id: user.id, achievement_key: 'first_reward' },
          { onConflict: 'user_id,achievement_key' }
        )
      }
    }
    setLevelUpData(null)
  }

  return (
    <>
      {/* Level Up Modal */}
      <AnimatePresence>
        {levelUpData && (
          <LevelUpModal
            skillName={levelUpData.skillName}
            newLevel={levelUpData.level}
            onClose={handleLevelUpClose}
          />
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto px-4 py-6 flex flex-col items-center gap-6">
        {/* Skill selector */}
        <div className="w-full">
          <label className="text-xs text-text-muted mb-1.5 block">Skill vinculada</label>
          <select
            value={selectedSkillId}
            onChange={(e) => setSelectedSkillId(e.target.value)}
            disabled={running}
            className="w-full bg-surface border border-surface-3 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
          >
            <option value="">Sem skill</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name} — Nível {s.level}
              </option>
            ))}
          </select>
        </div>

        {/* Phase tabs */}
        <div className="flex bg-surface rounded-xl p-1 w-full">
          {(['focus', 'shortBreak', 'longBreak'] as Phase[]).map((p) => (
            <button
              key={p}
              onClick={() => { if (!running) { setPhase(p); setSecondsLeft(totalSeconds[p]); setStartedAt(null) } }}
              disabled={running}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-60 ${
                phase === p ? 'bg-surface-3 text-white' : 'text-text-muted'
              }`}
            >
              {phaseLabel[p]}
            </button>
          ))}
        </div>

        {/* Timer ring */}
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#2a2a2a" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={phaseColor[phase]}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress)}`}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white tabular-nums">{mins}:{secs}</span>
            <span className="text-sm text-text-muted mt-1">{phaseLabel[phase]}</span>
            {phase === 'focus' && currentXP > 0 && (
              <span className="text-xs text-primary mt-0.5 font-medium">+{currentXP} XP ganhos</span>
            )}
          </div>
        </div>

        {/* XP bar for selected skill */}
        {selectedSkill && (
          <div className="w-full">
            <XPBar
              currentXP={selectedSkill.current_xp}
              xpToNextLevel={selectedSkill.xp_to_next_level}
              level={selectedSkill.level}
              color={selectedSkill.color}
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="w-12 h-12 rounded-full bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-white flex items-center justify-center transition-all"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={toggleTimer}
            className="w-20 h-20 rounded-full flex items-center justify-center text-black font-bold transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: phaseColor[phase] }}
          >
            {running ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>

          {running && phase === 'focus' && (
            <button
              onClick={() => handleSessionComplete(false)}
              className="w-12 h-12 rounded-full bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-white flex items-center justify-center transition-all"
              title="Encerrar sessão"
            >
              <Check size={18} />
            </button>
          )}

          {!running && phase !== 'focus' && (
            <button
              onClick={() => { setPhase('focus'); setSecondsLeft(config.session * 60) }}
              className="w-12 h-12 rounded-full bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-white flex items-center justify-center transition-all"
              title="Pular para foco"
            >
              <Play size={18} />
            </button>
          )}
        </div>

        <p className="text-xs text-text-dim">Ciclo {cycles} · {cycles} sessão{cycles !== 1 ? 'ões' : ''} hoje</p>
      </div>
    </>
  )
}
