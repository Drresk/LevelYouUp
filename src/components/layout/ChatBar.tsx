'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, X } from 'lucide-react'
import PixelIcon from '@/components/ui/PixelIcon'

const CHIPS = [
  { label: 'Gasto', prefix: 'gastei ', icon: 'coin' },
  { label: 'Estudei', prefix: 'estudei ', icon: 'sword' },
  { label: 'Água', prefix: 'bebi ', icon: 'water' },
  { label: 'Receita', prefix: 'recebi ', icon: 'wallet' },
  { label: 'Evento', prefix: 'evento ', icon: 'calendar' },
  { label: 'Pomodoro', prefix: 'fiz pomodoro de ', icon: 'pomodoro' },
]

interface Toast {
  id: string
  text: string
  type: 'success' | 'error' | 'info'
}

export default function ChatBar() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function prefill(prefix: string) {
    setInput(prefix)
    inputRef.current?.focus()
  }

  function showToast(text: string, type: Toast['type'] = 'success') {
    const id = Math.random().toString(36).slice(2)
    setToast({ id, text, type })
    setTimeout(() => setToast((t) => t?.id === id ? null : t), 4000)
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const msg = input.trim()
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      })
      const data = await res.json()
      showToast(data.reply, res.ok ? 'success' : 'error')
    } catch {
      showToast('Erro de conexão. Tente novamente.', 'error')
    }

    setLoading(false)
  }

  const toastColors = {
    success: { bg: 'rgba(0,200,117,0.15)', border: 'rgba(0,200,117,0.4)', text: '#00C875' },
    error:   { bg: 'rgba(255,59,92,0.15)', border: 'rgba(255,59,92,0.4)',  text: '#FF3B5C' },
    info:    { bg: 'rgba(0,212,255,0.15)', border: 'rgba(0,212,255,0.4)',  text: '#00D4FF' },
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-3 pb-2 md:left-60">
      {/* Toast response */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className="mb-2 rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{
              background: toastColors[toast.type].bg,
              border: `1px solid ${toastColors[toast.type].border}`,
              boxShadow: '8px 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <p className="text-sm flex-1 leading-relaxed" style={{ color: '#F0F0FF' }}>{toast.text}</p>
            <button onClick={() => setToast(null)} className="flex-shrink-0 mt-0.5 opacity-60 hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat bar */}
      <div className="clay-card overflow-hidden"
        style={{ boxShadow: '8px 8px 20px rgba(0,0,0,0.6), -4px -4px 12px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
        {/* Quick chips */}
        <div className="flex gap-2 px-3 pt-2.5 pb-1.5 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {CHIPS.map((chip) => (
            <button key={chip.label} onClick={() => prefill(chip.prefix)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0 text-xs font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#B0B0D0',
                boxShadow: '2px 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}>
              <PixelIcon icon={chip.icon} size={3} />
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input row */}
        <form onSubmit={handleSend} className="flex items-center gap-2.5 px-3 pb-3">
          <PixelIcon icon="chat" size={3} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="gastei 45 no almoço · estudei design 30min..."
            className="chat-bar-input flex-1"
            disabled={loading}
          />
          <button type="submit" disabled={!input.trim() || loading}
            className="clay-btn clay-btn-purple px-3 py-2 text-sm flex items-center gap-1.5 disabled:opacity-40"
            style={{ borderRadius: 12, minWidth: 40 }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </form>
      </div>
    </div>
  )
}
