'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PixelIcon from '@/components/ui/PixelIcon'
import { PixelIconKey } from '@/lib/pixel-icons'
import { cn } from '@/lib/utils/cn'

const NAV: { href: string; icon: PixelIconKey; label: string }[] = [
  { href: '/dashboard', icon: 'home', label: 'Home' },
  { href: '/skills', icon: 'sword', label: 'Skills' },
  { href: '/financeiro', icon: 'wallet', label: 'Finanças' },
  { href: '/friends', icon: 'person', label: 'Amigos' },
  { href: '/feed', icon: 'feed', label: 'Feed' },
  { href: '/shop', icon: 'chest', label: 'Shop' },
  { href: '/profile', icon: 'badge', label: 'Perfil' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30"
      style={{
        background: 'linear-gradient(180deg, #16163A 0%, #0D0D2A 100%)',
        borderTop: '1px solid rgba(107,47,212,0.15)',
      }}>
      {/* Scrollable tab bar */}
      <div className="flex overflow-x-auto scrollbar-none h-16 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center justify-center gap-0.5 px-3 min-w-[60px] flex-shrink-0 transition-all"
              style={active ? { color: '#9B7FE8' } : { color: '#44446A' }}>
              <div className={cn('p-1.5 rounded-xl transition-all', active ? 'rounded-xl' : '')}
                style={active ? {
                  background: 'rgba(107,47,212,0.2)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                } : {}}>
                <PixelIcon icon={icon} size={20} />
              </div>
              <span className="text-[9px] font-bold font-display whitespace-nowrap">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
