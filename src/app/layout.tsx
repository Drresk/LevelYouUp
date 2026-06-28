import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'LevelYouUp',
  description: 'Level yourself up. Every single day.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LevelYouUp',
  },
}

export const viewport: Viewport = {
  themeColor: '#6B2FD4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={cn('font-sans', inter.variable)}>
      <body className="min-h-screen" style={{ background: '#0D0D1A', color: '#F0F0FF' }}>
        {children}
      </body>
    </html>
  )
}
