'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sword, Users, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/skills', icon: Sword, label: 'Skills' },
  { href: '/feed', icon: Users, label: 'Feed' },
  { href: '/shop', icon: ShoppingBag, label: 'Shop' },
  { href: '/profile', icon: User, label: 'Perfil' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-[rgba(139,92,246,0.15)]">
      <div className="flex items-center justify-around h-16">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={cn('flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all',
                active ? 'text-purple' : 'text-text-dim')}>
              <Icon size={21} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
