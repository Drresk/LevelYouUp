'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'
import PixelIcon from '@/components/ui/PixelIcon'
import { PixelIconKey } from '@/lib/pixel-icons'

const NAV: { href: string; icon: PixelIconKey; label: string }[] = [
  { href: '/dashboard', icon: 'home', label: 'Home' },
  { href: '/skills', icon: 'sword', label: 'Skills' },
  { href: '/financeiro', icon: 'wallet', label: 'Financeiro' },
  { href: '/friends', icon: 'person', label: 'Amigos' },
  { href: '/feed', icon: 'feed', label: 'Feed' },
  { href: '/shop', icon: 'chest', label: 'Shop' },
  { href: '/profile', icon: 'badge', label: 'Perfil' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await createClient().auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen fixed left-0 top-0 z-30"
      style={{
        background: 'linear-gradient(180deg, #16163A 0%, #0D0D2A 100%)',
        borderRight: '1px solid rgba(107,47,212,0.15)',
      }}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-5" style={{ borderBottom: '1px solid rgba(107,47,212,0.15)' }}>
        <div className="w-10 h-10 rounded-clay-sm flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(145deg, #7B3FE4, #5B1FC4)',
            boxShadow: '0 4px 12px rgba(107,47,212,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}>
          <PixelIcon icon="lightning" size={24} />
        </div>
        <div>
          <p className="font-display font-black text-base text-text-base leading-tight">LevelYouUp</p>
          <p className="text-[10px] text-text-dim">RPG do dia a dia</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-clay-sm text-sm font-bold font-display transition-all',
                active ? '' : 'text-text-dim hover:text-text-muted')}
              style={active ? {
                background: 'linear-gradient(145deg, rgba(107,47,212,0.25), rgba(107,47,212,0.1))',
                color: '#9B7FE8',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                border: '1px solid rgba(107,47,212,0.25)',
              } : {}}>
              <PixelIcon icon={icon} size={20} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3" style={{ borderTop: '1px solid rgba(107,47,212,0.15)' }}>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-clay-sm text-sm font-bold font-display text-text-dim hover:text-crimson transition-all w-full">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </aside>
  )
}
