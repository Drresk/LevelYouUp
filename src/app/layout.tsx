import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LevelUp',
  description: 'Assistente pessoal gamificado',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LevelUp',
  },
}

export const viewport: Viewport = {
  themeColor: '#1DB954',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-white min-h-screen">{children}</body>
    </html>
  )
}
