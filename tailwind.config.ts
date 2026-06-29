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
        // Base
        background: '#0D0D1A',
        surface: '#16163A',
        'surface-2': '#1E1E50',
        'surface-3': '#282870',
        // Clay palette
        purple: '#6B2FD4',
        'purple-light': '#9B7FE8',
        'purple-muted': 'rgba(107,47,212,0.18)',
        gold: '#F5A623',
        'gold-light': '#FFD166',
        'gold-muted': 'rgba(245,166,35,0.18)',
        cyan: '#00D4FF',
        'cyan-muted': 'rgba(0,212,255,0.15)',
        emerald: '#00C875',
        'emerald-muted': 'rgba(0,200,117,0.15)',
        crimson: '#FF3B5C',
        'crimson-muted': 'rgba(255,59,92,0.15)',
        // Text
        'text-base': '#F0F0FF',
        'text-muted': '#8888BB',
        'text-dim': '#44446A',
      },
      fontFamily: {
        display: ['Fredoka One', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        clay: '24px',
        'clay-lg': '32px',
        'clay-sm': '16px',
      },
      boxShadow: {
        // Clay double-shadow system
        clay: '0 8px 24px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        'clay-sm': '0 4px 12px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        'clay-purple': '0 8px 24px rgba(107,47,212,0.4), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
        'clay-gold': '0 8px 24px rgba(245,166,35,0.35), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
        'clay-cyan': '0 8px 24px rgba(0,212,255,0.3), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
        'clay-emerald': '0 8px 24px rgba(0,200,117,0.3), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
        'clay-crimson': '0 8px 24px rgba(255,59,92,0.35), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
        'clay-pressed': '0 2px 6px rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.4)',
        // Glow
        glow: '0 0 30px rgba(107,47,212,0.4)',
        'glow-gold': '0 0 25px rgba(245,166,35,0.5)',
        'glow-cyan': '0 0 25px rgba(0,212,255,0.4)',
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'press': 'press 0.1s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
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
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 10px rgba(245,166,35,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(245,166,35,0.6)' },
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
