import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#080818',
        surface: '#0e0e26',
        'surface-2': '#181840',
        'surface-3': '#252560',
        border: 'rgba(139,92,246,0.2)',
        // Gold — XP, coins, rewards
        gold: '#f59e0b',
        'gold-light': '#fbbf24',
        'gold-muted': 'rgba(245,158,11,0.15)',
        // Cyan — streaks
        cyan: '#06b6d4',
        'cyan-muted': 'rgba(6,182,212,0.15)',
        // Green — finance positive
        green: '#10b981',
        'green-muted': 'rgba(16,185,129,0.15)',
        // Purple — magic, achievements
        purple: '#8b5cf6',
        'purple-muted': 'rgba(139,92,246,0.15)',
        // Red — danger, alerts
        danger: '#ef4444',
        'danger-muted': 'rgba(239,68,68,0.15)',
        // Orange — secondary accent
        orange: '#f97316',
        // Text
        'text-base': '#f1f5f9',
        'text-muted': '#94a3b8',
        'text-dim': '#475569',
        // Rarity
        'rarity-common': '#64748b',
        'rarity-rare': '#3b82f6',
        'rarity-epic': '#8b5cf6',
        'rarity-legendary': '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        gold: '0 0 20px rgba(245,158,11,0.3)',
        'gold-sm': '0 0 10px rgba(245,158,11,0.2)',
        cyan: '0 0 20px rgba(6,182,212,0.3)',
        purple: '0 0 20px rgba(139,92,246,0.3)',
        green: '0 0 20px rgba(16,185,129,0.3)',
        glow: '0 0 30px rgba(139,92,246,0.4)',
      },
      animation: {
        'xp-fill': 'xpFill 1s ease-out forwards',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'pulse-cyan': 'pulseCyan 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        xpFill: { '0%': { width: '0%' }, '100%': { width: 'var(--xp-width)' } },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 10px rgba(245,158,11,0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(245,158,11,0.5)' },
        },
        pulseCyan: {
          '0%,100%': { boxShadow: '0 0 10px rgba(6,182,212,0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(6,182,212,0.5)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
