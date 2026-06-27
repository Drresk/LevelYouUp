'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Zap, Mail, Lock, Loader2 } from 'lucide-react'

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
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        window.location.href = '/dashboard'
      }
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Conta criada! Verifique seu email para confirmar, ou entre já.' })
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Link enviado! Verifique seu email.' })
      }
    }

    setLoading(false)
  }

  const MODES: { key: Mode; label: string }[] = [
    { key: 'login', label: 'Entrar' },
    { key: 'signup', label: 'Criar conta' },
    { key: 'magic', label: 'Magic Link' },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Zap size={32} className="text-black fill-black" />
          </div>
          <h1 className="text-3xl font-black text-white">LevelUp</h1>
          <p className="text-text-muted text-sm mt-1">Seu assistente pessoal gamificado</p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-surface rounded-xl p-1 mb-6">
          {MODES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setMode(key); setMessage(null) }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                mode === key ? 'bg-surface-3 text-white' : 'text-text-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full bg-surface border border-surface-3 rounded-xl px-4 py-3 pl-9 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {mode !== 'magic' && (
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Senha (mín. 6 caracteres)' : 'Senha'}
                required
                minLength={6}
                className="w-full bg-surface border border-surface-3 rounded-xl px-4 py-3 pl-9 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          )}

          {message && (
            <p className={`text-sm px-3 py-2 rounded-lg ${
              message.type === 'error' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
            }`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Enviar link'}
          </button>
        </form>
      </div>
    </div>
  )
}
