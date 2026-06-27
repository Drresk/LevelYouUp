'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const ICONS = ['⚡', '🎸', '💻', '🎨', '📚', '🏋️', '🧠', '🎯', '🌱', '🎵', '🚀', '✍️', '🔬', '🎭', '🍳']
const COLORS = ['#1DB954', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16']

interface SkillFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function SkillForm({ onSuccess, onCancel }: SkillFormProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⚡')
  const [color, setColor] = useState('#1DB954')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), icon, color }),
    })

    setLoading(false)
    onSuccess()
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-surface border border-primary/30 rounded-2xl p-5 mb-6"
    >
      <h3 className="font-bold text-white mb-4">Nova Skill</h3>

      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da skill..."
          className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary transition-colors"
          autoFocus
        />
      </div>

      <div className="mb-4">
        <p className="text-xs text-text-muted mb-2">Ícone</p>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIcon(i)}
              className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                icon === i ? 'bg-primary/20 ring-1 ring-primary' : 'bg-surface-2 hover:bg-surface-3'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs text-text-muted mb-2">Cor</p>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full transition-all ${
                color === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-surface-2 text-text-muted hover:text-white text-sm font-medium transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-black text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Criar
        </button>
      </div>
    </motion.form>
  )
}
