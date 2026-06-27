'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, Check } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import CharacterCard from '@/components/profile/CharacterCard'
import AvatarDisplay from '@/components/avatar/AvatarDisplay'
import { Profile, Avatar, UserWallet, UserBadge, BASE_CHARACTERS } from '@/types'
import { cn } from '@/lib/utils/cn'

const RARITY_BORDER: Record<string, string> = {
  common: 'border-rarity-common',
  rare: 'border-rarity-rare',
  epic: 'border-rarity-epic',
  legendary: 'border-rarity-legendary',
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [avatar, setAvatar] = useState<Avatar | null>(null)
  const [wallet, setWallet] = useState<UserWallet | null>(null)
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [tab, setTab] = useState<'profile' | 'avatar' | 'badges'>('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', bio: '' })
  const [localAvatar, setLocalAvatar] = useState<Partial<Avatar>>({})

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const res = await fetch('/api/profile')
    const data = await res.json()
    setProfile(data.profile)
    setAvatar(data.avatar)
    setWallet(data.wallet)
    setBadges(data.badges || [])
    if (data.profile) setForm({ name: data.profile.name || '', username: data.profile.username || '', bio: data.profile.bio || '' })
    if (data.avatar) setLocalAvatar(data.avatar)
  }

  async function saveProfile() {
    setSaving(true)
    await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile: form }) })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    loadData()
  }

  async function saveAvatar() {
    setSaving(true)
    await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ avatar: localAvatar }) })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    loadData()
  }

  async function setActiveBadge(key: string) {
    await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active_badge: key }) })
    loadData()
  }

  const previewAvatar = { ...avatar, ...localAvatar } as Avatar

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-black text-text-base mb-4">👤 Perfil</h1>

        <CharacterCard profile={profile} avatar={avatar} wallet={wallet} />

        {/* Tabs */}
        <div className="flex bg-surface rounded-xl p-1 my-5">
          {(['profile','avatar','badges'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                tab === t ? 'bg-purple text-white' : 'text-text-dim hover:text-text-muted')}>
              {t === 'profile' ? '📋 Dados' : t === 'avatar' ? '🎮 Avatar' : '🏅 Badges'}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {[
              { label: 'Nome de exibição', key: 'name', placeholder: 'Seu nome' },
              { label: 'Username', key: 'username', placeholder: '@seuusername' },
              { label: 'Bio', key: 'bio', placeholder: 'Conte sua história...' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-text-muted mb-1.5 block font-medium">{label}</label>
                <input value={form[key as keyof typeof form]}
                  onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-surface-2 border border-[rgba(139,92,246,0.2)] rounded-xl px-4 py-3 text-text-base placeholder:text-text-dim text-sm focus:outline-none focus:border-purple transition-colors" />
              </div>
            ))}
            <button onClick={saveProfile} disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff' }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? 'Salvo!' : 'Salvar perfil'}
            </button>
          </motion.div>
        )}

        {tab === 'avatar' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Preview */}
            <div className="flex justify-center">
              <AvatarDisplay avatar={previewAvatar} size="xl" className="animate-float" />
            </div>

            {/* Base character */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Personagem base</p>
              <div className="grid grid-cols-5 gap-2">
                {BASE_CHARACTERS.map((b) => (
                  <button key={b.key} onClick={() => setLocalAvatar(a => ({ ...a, base_character: b.key }))}
                    className={cn('p-3 rounded-xl border-2 text-2xl transition-all hover:scale-105',
                      localAvatar.base_character === b.key || (!localAvatar.base_character && b.key === 'warrior')
                        ? 'border-purple bg-purple-muted' : 'border-surface-3 bg-surface-2')}>
                    {b.emoji}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={saveAvatar} disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff' }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : '💾 Salvar Avatar'}
            </button>
            <p className="text-xs text-text-dim text-center">Cosméticos adicionais disponíveis na 🏪 Shop</p>
          </motion.div>
        )}

        {tab === 'badges' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {badges.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🏅</p>
                <p className="text-text-muted">Nenhum badge ainda. Continue usando o app!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {badges.map((ub) => {
                  const b = ub.badge as unknown as { key: string; title: string; description: string; icon: string }
                  if (!b) return null
                  return (
                    <button key={ub.id} onClick={() => setActiveBadge(b.key)}
                      className={cn('p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.02]',
                        ub.is_active ? 'border-gold bg-gold-muted shadow-gold' : 'border-[rgba(139,92,246,0.2)] bg-surface-2')}>
                      <p className="text-2xl mb-2">{b.icon}</p>
                      <p className="text-sm font-bold text-text-base">{b.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{b.description}</p>
                      {ub.is_active && <span className="text-xs text-gold font-bold mt-1 block">✓ Ativo</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AppShell>
  )
}
