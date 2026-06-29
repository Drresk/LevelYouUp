'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import SkillCard from '@/components/skills/SkillCard'
import SkillForm from '@/components/skills/SkillForm'
import PixelIcon from '@/components/ui/PixelIcon'
import { Skill } from '@/types'

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadSkills() }, [])

  async function loadSkills() {
    const res = await fetch('/api/skills')
    const data = await res.json()
    setSkills(data)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    await fetch('/api/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSkills((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black font-display text-text-base flex items-center gap-2">
              <PixelIcon icon="sword" size={24} /> Skills
            </h1>
            <p className="text-text-muted text-sm mt-0.5 stat-num">
              {skills.length} skill{skills.length !== 1 ? 's' : ''} · {skills.reduce((s, sk) => s + sk.total_xp, 0).toLocaleString('pt-BR')} XP total
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="clay-btn clay-btn-purple flex items-center gap-2 text-sm px-4 py-2.5"
          >
            <PixelIcon icon="star" size={14} />
            Nova
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <SkillForm
            onSuccess={() => { setShowForm(false); loadSkills() }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-surface border border-surface-3 rounded-2xl p-4 h-28 animate-pulse" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <div className="flex justify-center mb-4"><PixelIcon icon="sword" size={40} /></div>
            <p className="font-bold font-display text-text-base mb-1">Nenhuma skill ainda</p>
            <p className="text-sm">Crie sua primeira skill para começar a ganhar XP!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
