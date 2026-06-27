'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import AppShell from '@/components/layout/AppShell'
import { FeedPost } from '@/types'

const REACTIONS = ['🔥', '👏', '💪', '⚡']
const RARITY_GLOW: Record<string, string> = {
  skills: 'rgba(245,158,11,0.15)',
  streaks: 'rgba(6,182,212,0.15)',
  pomodoro: 'rgba(239,68,68,0.15)',
  financial: 'rgba(16,185,129,0.15)',
  general: 'rgba(139,92,246,0.15)',
}

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch('/api/feed')
    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }

  async function react(postId: string, emoji: string) {
    await fetch('/api/feed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post_id: postId, emoji }) })
    load()
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-black text-text-base">👥 Feed</h1>
          <p className="text-text-dim text-xs mt-0.5">Conquistas dos seus amigos</p>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-28 rounded-2xl bg-surface animate-pulse" />)}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🌌</p>
            <p className="text-text-base font-bold mb-1">Feed vazio por enquanto</p>
            <p className="text-text-muted text-sm">Adicione amigos em 👥 Friends para ver as conquistas deles aqui!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const ach = post.achievement as unknown as { title: string; description: string; icon: string; category: string } | null
              const prof = post.profile as unknown as { name: string; username: string; title: string } | null
              const glow = RARITY_GLOW[ach?.category || 'general']
              const reactions = (post.reactions || []) as { emoji: string; user_id: string }[]
              const reactionCounts: Record<string, number> = {}
              reactions.forEach((r) => { reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1 })

              return (
                <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 border border-[rgba(139,92,246,0.2)]"
                  style={{ background: `linear-gradient(135deg, #0e0e26 0%, ${glow} 100%)` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center text-xl flex-shrink-0">
                      {ach?.icon || '🏆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-bold text-text-base">{prof?.name || 'Anônimo'}</span>
                        {prof?.title && <span className="text-[10px] text-purple bg-purple-muted px-1.5 py-0.5 rounded-full">{prof.title}</span>}
                      </div>
                      <p className="text-xs text-text-muted mb-1">desbloqueou <span className="text-text-base font-semibold">{ach?.title || 'uma conquista'}</span></p>
                      {ach?.description && <p className="text-[11px] text-text-dim">{ach.description}</p>}
                    </div>
                    <p className="text-[10px] text-text-dim flex-shrink-0">
                      {formatDistanceToNow(new Date(post.created_at), { locale: ptBR, addSuffix: true })}
                    </p>
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[rgba(139,92,246,0.1)]">
                    {REACTIONS.map((emoji) => (
                      <button key={emoji} onClick={() => react(post.id, emoji)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-2 hover:bg-surface-3 transition-all text-sm">
                        {emoji}
                        {reactionCounts[emoji] ? <span className="text-xs text-text-muted">{reactionCounts[emoji]}</span> : null}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
