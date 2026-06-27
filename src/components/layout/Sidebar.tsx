'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Sword, Users, ShoppingBag, User, LogOut, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/skills', icon: Sword, label: 'Skills' },
  { href: '/feed', icon: Users, label: 'Feed' },
  { href: '/shop', icon: ShoppingBag, label: 'Shop' },
  { href: '/profile', icon: User, label: 'Perfil' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await createClient().auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-surface border-r border-[rgba(139,92,246,0.15)] fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-[rgba(139,92,246,0.15)]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple to-gold flex items-center justify-center shadow-purple">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <span className="text-base font-black text-text-base tracking-tight">LevelYouUp</span>
          <p className="text-[10px] text-text-dim leading-none">RPG do dia a dia</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-purple-muted text-purple border border-[rgba(139,92,246,0.3)] shadow-purple/20'
                  : 'text-text-muted hover:bg-surface-2 hover:text-text-base')}>
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[rgba(139,92,246,0.15)]">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-dim hover:bg-surface-2 hover:text-danger transition-all w-full">
          <LogOut size={17} /> Sair
        </button>
      </div>
    </aside>
  )
}
