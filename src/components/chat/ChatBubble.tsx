import { motion } from 'framer-motion'
import { ChatMessage } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ChatBubbleProps {
  message: ChatMessage
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
          isUser
            ? 'bg-primary text-black rounded-br-sm font-medium'
            : 'bg-surface-2 text-white rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p className={`text-[10px] mt-1 ${isUser ? 'text-black/60' : 'text-text-dim'}`}>
          {format(new Date(message.created_at), 'HH:mm', { locale: ptBR })}
        </p>
      </div>
    </motion.div>
  )
}
