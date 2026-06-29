'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import PixelIcon from '@/components/ui/PixelIcon'

type Mode = 'login' | 'signup' | 'magic'

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage({ type: 'error', text: error.message })
      else window.location.href = '/dashboard'
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage({ type: 'error', text: error.message })
      else setMessage({ type: 'success', text: 'Conta criada! Verifique seu email para confirmar, ou entre já.' })
    } else {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) setMessage({ type: 'error', text: error.message })
      else setMessage({ type: 'success', text: '✨ Link enviado! Verifique seu email.' })
    }

    setLoading(false)
  }

  const MODES: { key: Mode; label: string }[] = [
    { key: 'login', label: 'Entrar' },
    { key: 'signup', label: 'Criar conta' },
    { key: 'magic', label: 'Magic Link' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(107,47,212,0.25) 0%, #0D0D1A 60%)',
      }}>
      {/* Background decorative orbs */}
      <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: '#6B2FD4' }} />
      <div className="absolute bottom-20 right-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl"
        style={{ background: '#00D4FF' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 animate-float">
            <div className="w-20 h-20 rounded-clay flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, #7B3FE4, #5B1FC4)',
                boxShadow: '0 12px 32px rgba(107,47,212,0.6), inset 0 2px 0 rgba(255,255,255,0.25)',
              }}>
              <PixelIcon icon="lightning" size={40} />
            </div>
          </div>

          <h1 className="font-display text-4xl font-black mb-1"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #C8A8FF 50%, #F5A623 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(0 2px 8px rgba(107,47,212,0.4))',
            }}>
            LevelYouUp
          </h1>
          <p className="text-text-muted text-sm font-medium">Level yourself up. Every single day.</p>
        </div>

        {/* Card */}
        <div className="clay-card p-6">
          {/* Mode toggle */}
          <div className="flex p-1 mb-5 rounded-clay-sm" style={{ background: '#0D0D2A' }}>
            {MODES.map(({ key, label }) => (
              <button key={key} onClick={() => { setMode(key); setMessage(null) }}
                className="flex-1 py-2 rounded-xl text-xs font-bold font-display transition-all"
                style={mode === key ? {
                  background: 'linear-gradient(145deg, #7B3FE4, #5B1FC4)',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(107,47,212,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                } : { color: '#8888BB' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-text-muted font-medium mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" required
                className="w-full text-sm text-text-base placeholder:text-text-dim px-4 py-3 rounded-clay-sm focus:outline-none transition-all"
                style={{
                  background: '#0D0D2A',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.04)',
                  border: '1px solid rgba(107,47,212,0.2)',
                }} />
            </div>

            {mode !== 'magic' && (
              <div>
                <label className="text-xs text-text-muted font-medium mb-1.5 block">Senha</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Mín. 6 caracteres' : 'Sua senha'} required minLength={6}
                  className="w-full text-sm text-text-base placeholder:text-text-dim px-4 py-3 rounded-clay-sm focus:outline-none transition-all"
                  style={{
                    background: '#0D0D2A',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.04)',
                    border: '1px solid rgba(107,47,212,0.2)',
                  }} />
              </div>
            )}

            {message && (
              <div className="px-4 py-3 rounded-clay-sm text-sm font-medium"
                style={message.type === 'error'
                  ? { background: 'rgba(255,59,92,0.15)', color: '#FF3B5C', border: '1px solid rgba(255,59,92,0.3)' }
                  : { background: 'rgba(0,200,117,0.15)', color: '#00C875', border: '1px solid rgba(0,200,117,0.3)' }}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="clay-btn clay-btn-purple w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : <PixelIcon icon={mode === 'login' ? 'sword' : mode === 'signup' ? 'star' : 'lightning'} size={14} />
              }
              {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Enviar link'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-dim mt-4">
          Feito para quem quer evoluir todo dia.
        </p>
      </div>
    </div>
  )
}
