'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, DollarSign, Sword, Calendar, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { href: '/skills', icon: Sword, label: 'Skills' },
  { href: '/calendario', icon: Calendar, label: 'Agenda' },
  { href: '/compras', icon: ShoppingCart, label: 'Compras' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-surface-3 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all min-w-0',
                active ? 'text-primary' : 'text-text-muted'
              )}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
