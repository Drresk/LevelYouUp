export const tokens = {
  colors: {
    bg: {
      base: '#0D0D1A',
      surface: '#13132A',
      elevated: '#1A1A3E',
    },
    brand: {
      purple: '#6B2FD4',
      purpleLight: '#8B5CF6',
      gold: '#F5A623',
      goldLight: '#FCD34D',
      cyan: '#00D4FF',
      emerald: '#00C875',
      crimson: '#FF3B5C',
    },
    clay: {
      shadowDark: 'rgba(0,0,0,0.5)',
      shadowInner: 'rgba(255,255,255,0.08)',
      glow: (color: string) => `0 0 20px ${color}40`,
    },
  },
  radius: {
    card: '24px',
    button: '16px',
    badge: '999px',
    avatar: '20px',
  },
  fonts: {
    display: "'Fredoka One', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  shadows: {
    clay: '8px 8px 20px rgba(0,0,0,0.6), -4px -4px 12px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)',
    clayHover: '12px 12px 28px rgba(0,0,0,0.7), -4px -4px 12px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1)',
    button: '4px 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.3)',
  },
} as const
