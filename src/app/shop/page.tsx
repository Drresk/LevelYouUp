'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Coins } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import PixelIcon from '@/components/ui/PixelIcon'
import { ShopItem, UserWallet, RARITY_COLOR, Rarity } from '@/types'
import { cn } from '@/lib/utils/cn'

const TYPE_LABEL: Record<string, string> = {
  head: 'Cabeça', face: 'Rosto', body: 'Corpo', accessory: 'Acessório',
  streak_shield: 'Consumível', recovery_token: 'Consumível', xp_boost: 'Consumível',
}

const RARITY_LABEL: Record<Rarity, string> = { common: 'Comum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário' }

export default function ShopPage() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [ownedKeys, setOwnedKeys] = useState<string[]>([])
  const [wallet, setWallet] = useState<UserWallet | null>(null)
  const [buying, setBuying] = useState<string | null>(null)
  const [flash, setFlash] = useState<{ msg: string; ok: boolean } | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch('/api/shop')
    const data = await res.json()
    setItems(data.items || [])
    setOwnedKeys(data.ownedKeys || [])
    setWallet(data.wallet)
  }

  async function buy(item: ShopItem) {
    setBuying(item.key)
    const res = await fetch('/api/shop', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ item_key: item.key }) })
    const data = await res.json()
    if (res.ok) {
      setFlash({ msg: `${item.emoji} ${item.name} comprado!`, ok: true })
      setWallet((w) => w ? { ...w, coins: data.newBalance } : w)
      if (!['streak_shield','recovery_token','xp_boost'].includes(item.type)) {
        setOwnedKeys((k) => [...k, item.key])
      }
    } else {
      setFlash({ msg: data.error || 'Erro', ok: false })
    }
    setBuying(null)
    setTimeout(() => setFlash(null), 3000)
  }

  const filters = ['all', 'head', 'face', 'body', 'accessory', 'streak_shield', 'recovery_token', 'xp_boost']
  const displayed = filter === 'all' ? items : items.filter((i) => i.type === filter)

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black font-display text-text-base flex items-center gap-2">
              <PixelIcon icon="chest" size={24} /> Shop
            </h1>
            <p className="text-text-dim text-xs mt-0.5">Gaste suas moedas com sabedoria</p>
          </div>
          {wallet && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-clay-sm"
              style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)' }}>
              <PixelIcon icon="coin" size={18} />
              <span className="stat-num font-black text-gold text-lg">{wallet.coins.toLocaleString('pt-BR')}</span>
            </div>
          )}
        </div>

        {/* Flash */}
        <AnimatePresence>
          {flash && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={cn('mb-4 px-4 py-3 rounded-xl text-sm font-medium', flash.ok ? 'bg-green-muted text-green border border-green/30' : 'bg-danger-muted text-danger border border-danger/30')}>
              {flash.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0',
                filter === f ? 'bg-purple text-white' : 'bg-surface-2 text-text-muted hover:bg-surface-3')}>
              {f === 'all' ? 'Tudo' : TYPE_LABEL[f] || f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {displayed.map((item) => {
            const owned = ownedKeys.includes(item.key)
            const rarityColor = RARITY_COLOR[item.rarity]
            return (
              <motion.div key={item.key} layout
                className={cn('rounded-2xl p-4 border-2 relative overflow-hidden transition-all',
                  `border-rarity-${item.rarity}`,
                  item.rarity === 'legendary' && 'shimmer-bg')}
                style={{ background: `linear-gradient(135deg, #0e0e26, ${rarityColor}10)` }}>

                {/* Rarity badge */}
                <div className="absolute top-2 right-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: rarityColor + '30', color: rarityColor }}>
                    {RARITY_LABEL[item.rarity]}
                  </span>
                </div>

                <div className="text-4xl mb-3 mt-1">{item.emoji}</div>
                <p className="text-sm font-bold text-text-base leading-tight mb-1">{item.name}</p>
                <p className="text-[10px] text-text-dim mb-3 leading-relaxed">{item.description}</p>
                <p className="text-[10px] text-text-dim mb-3">{TYPE_LABEL[item.type]}</p>

                {owned ? (
                  <div className="flex items-center gap-1.5 text-xs text-green font-bold">
                    <span>✓</span> Possuído
                  </div>
                ) : (
                  <button onClick={() => buy(item)} disabled={buying === item.key || !wallet || wallet.coins < item.coin_cost}
                    className={cn('w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all',
                      wallet && wallet.coins >= item.coin_cost
                        ? 'hover:scale-105 active:scale-95'
                        : 'opacity-40 cursor-not-allowed')}
                    style={{ background: `linear-gradient(135deg, ${rarityColor}90, ${rarityColor}60)`, color: '#fff' }}>
                    {buying === item.key ? <Loader2 size={12} className="animate-spin" /> : <><Coins size={12} /> {item.coin_cost}</>}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>

        {displayed.length === 0 && (
          <p className="text-center text-text-dim py-16">Nenhum item nesta categoria.</p>
        )}
      </div>
    </AppShell>
  )
}
