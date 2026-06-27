import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import FloatingChatButton from './FloatingChatButton'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <BottomNav />
      <FloatingChatButton />
    </div>
  )
}
