'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, DollarSign, Sword, Calendar, ShoppingCart, Trophy, Settings, LogOut, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { href: '/skills', icon: Sword, label: 'Skills' },
  { href: '/calendario', icon: Calendar, label: 'Calendário' },
  { href: '/compras', icon: ShoppingCart, label: 'Compras' },
  { href: '/conquistas', icon: Trophy, label: 'Conquistas' },
  { href: '/configuracoes', icon: Settings, label: 'Configurações' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-surface border-r border-surface-3 fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-surface-3">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <Zap size={20} className="text-black fill-black" />
        </div>
        <span className="text-xl font-bold text-white">LevelUp</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-primary-muted text-primary'
                  : 'text-text-muted hover:bg-surface-2 hover:text-white'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-surface-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-surface-2 hover:text-danger transition-all w-full"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
