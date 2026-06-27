'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import ChatBubble from './ChatBubble'
import { ChatMessage } from '@/types'
import { createClient } from '@/lib/supabase/client'

interface ChatInterfaceProps {
  compact?: boolean
}

export default function ChatInterface({ compact = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages() {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(compact ? 20 : 100)

    if (data) setMessages(data as ChatMessage[])
    setFetching(false)
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      user_id: '',
      role: 'user',
      content: input.trim(),
      action_taken: null,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      })

      const data = await res.json()

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        user_id: '',
        role: 'assistant',
        content: data.reply,
        action_taken: data.action || null,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          user_id: '',
          role: 'assistant',
          content: '❌ Erro ao processar mensagem. Tente novamente.',
          action_taken: null,
          created_at: new Date().toISOString(),
        },
      ])
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {fetching ? (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-text-muted" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-text-muted text-sm py-8">
            <p className="text-2xl mb-2">💬</p>
            <p>Olá! Me diga o que você gastou,</p>
            <p>ou me faça uma pergunta financeira.</p>
          </div>
        ) : (
          messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
        )}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-surface-2 px-4 py-2.5 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ delay: i * 0.1, repeat: Infinity, duration: 0.6 }}
                    className="w-1.5 h-1.5 bg-text-muted rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 border-t border-surface-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Gastei R$50 no mercado..."
            className="flex-1 bg-surface-2 rounded-xl px-4 py-2 text-sm text-white placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-primary hover:bg-primary-hover text-black rounded-xl px-3 disabled:opacity-40 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}
