'use client'

import { useState, useEffect } from 'react'
import { UserPlus, Check, X, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import AppShell from '@/components/layout/AppShell'
import { cn } from '@/lib/utils/cn'

interface FriendRow {
  id: string
  requester_id: string
  addressee_id: string
  status: string
  requester: { id: string; name: string; username: string; title: string; profile_score: number } | null
  addressee: { id: string; name: string; username: string; title: string; profile_score: number } | null
}

export default function FriendsPage() {
  const [friendships, setFriendships] = useState<FriendRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sending, setSending] = useState(false)
  const [flash, setFlash] = useState('')
  const [myId, setMyId] = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const { createClient } = await import('@/lib/supabase/client')
    const { data: { user } } = await createClient().auth.getUser()
    if (user) setMyId(user.id)
    const res = await fetch('/api/friends')
    setFriendships(await res.json())
    setLoading(false)
  }

  async function sendRequest() {
    if (!search.trim()) return
    setSending(true)
    const res = await fetch('/api/friends', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: search.trim(), action: 'send' }) })
    const data = await res.json()
    setFlash(res.ok ? '✅ Solicitação enviada!' : `❌ ${data.error}`)
    setSending(false); setSearch('')
    setTimeout(() => setFlash(''), 3000)
    loadAll()
  }

  async function respond(id: string, action: 'accept' | 'decline') {
    await fetch('/api/friends', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ friendship_id: id, action }) })
    loadAll()
  }

  const accepted = friendships.filter((f) => f.status === 'accepted')
  const pending = friendships.filter((f) => f.status === 'pending' && f.addressee_id === myId)
  const sent = friendships.filter((f) => f.status === 'pending' && f.requester_id === myId)

  function getFriend(f: FriendRow) {
    return f.requester_id === myId ? f.addressee : f.requester
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-black text-text-base">👥 Amigos</h1>
          <p className="text-text-dim text-xs mt-0.5">{accepted.length} amigo{accepted.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Add friend */}
        <div className="rpg-card p-4 mb-5">
          <p className="text-xs font-bold text-text-muted mb-3 uppercase tracking-widest">Adicionar amigo</p>
          <div className="flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="@username"
              onKeyDown={(e) => e.key === 'Enter' && sendRequest()}
              className="flex-1 bg-surface-2 border border-[rgba(139,92,246,0.2)] rounded-xl px-4 py-2.5 text-sm text-text-base placeholder:text-text-dim focus:outline-none focus:border-purple transition-colors" />
            <button onClick={sendRequest} disabled={sending || !search.trim()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff' }}>
              <UserPlus size={14} /> Adicionar
            </button>
          </div>
          {flash && <p className="text-xs mt-2 text-text-muted">{flash}</p>}
        </div>

        {/* Pending requests */}
        {pending.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gold uppercase tracking-widest mb-3">⚔️ Solicitações pendentes</p>
            <div className="space-y-2">
              {pending.map((f) => {
                const friend = getFriend(f)
                return (
                  <div key={f.id} className="flex items-center gap-3 bg-gold-muted border border-gold/20 rounded-xl px-4 py-3">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-text-base">{friend?.name || 'Desconhecido'}</p>
                      <p className="text-xs text-text-dim">@{friend?.username}</p>
                    </div>
                    <button onClick={() => respond(f.id, 'accept')} className="p-2 rounded-lg bg-green-muted text-green hover:bg-green/20 transition-all"><Check size={14} /></button>
                    <button onClick={() => respond(f.id, 'decline')} className="p-2 rounded-lg bg-danger-muted text-danger hover:bg-danger/20 transition-all"><X size={14} /></button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Friends list */}
        {loading ? (
          <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-16 bg-surface rounded-xl animate-pulse" />)}</div>
        ) : accepted.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="mx-auto mb-3 text-text-dim opacity-40" />
            <p className="text-text-base font-bold mb-1">Nenhum amigo ainda</p>
            <p className="text-text-dim text-sm">Adicione amigos pelo username para ver o feed deles!</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">🏆 Amigos</p>
            {accepted.map((f) => {
              const friend = getFriend(f)
              const score = friend?.profile_score || 0
              const scoreColor = score < 401 ? '#64748b' : score < 601 ? '#3b82f6' : score < 801 ? '#8b5cf6' : '#f59e0b'
              return (
                <motion.div key={f.id} layout className="flex items-center gap-3 bg-surface border border-[rgba(139,92,246,0.15)] rounded-xl px-4 py-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-lg flex-shrink-0">⚔️</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-base truncate">{friend?.name || 'Herói'}</p>
                    <p className="text-xs text-text-dim">@{friend?.username} · <span style={{ color: '#8b5cf6' }}>{friend?.title || 'Novato'}</span></p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="stat-num text-sm font-black" style={{ color: scoreColor }}>{score}</p>
                    <p className="text-[9px] text-text-dim">SCORE</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {sent.length > 0 && (
          <div className="mt-5">
            <p className="text-xs text-text-dim mb-2">Enviadas: {sent.map((f) => `@${f.addressee?.username}`).join(', ')}</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
