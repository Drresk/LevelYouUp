import AppShell from '@/components/layout/AppShell'
import ChatInterface from '@/components/chat/ChatInterface'

export default function ChatPage() {
  return (
    <AppShell>
      <div className="h-screen flex flex-col">
        <div className="px-6 py-4 border-b border-surface-3 bg-surface">
          <h1 className="text-xl font-bold text-white">💬 Assistente IA</h1>
          <p className="text-xs text-text-muted mt-0.5">Registre gastos, eventos e faça perguntas em linguagem natural</p>
        </div>
        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>
      </div>
    </AppShell>
  )
}
