import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import ChatBar from './ChatBar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#0D0D1A' }}>
      <Sidebar />
      {/* md:ml-60 for sidebar, pb-36 on mobile (nav 64px + chatbar ~90px) */}
      <main className="md:ml-60 pb-36 md:pb-20 min-h-screen">
        {children}
      </main>
      <ChatBar />
      <BottomNav />
    </div>
  )
}
