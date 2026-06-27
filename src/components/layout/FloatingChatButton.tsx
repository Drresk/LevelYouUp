'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatInterface from '@/components/chat/ChatInterface'

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-4 md:bottom-6 md:right-20 z-50 w-[90vw] max-w-md h-[60vh] max-h-[500px] bg-surface border border-surface-3 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-3">
              <span className="font-semibold text-white">Assistente IA</span>
              <button
                onClick={() => setOpen(false)}
                className="text-text-muted hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <ChatInterface compact />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 bg-primary hover:bg-primary-hover text-black rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Abrir chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </>
  )
}
