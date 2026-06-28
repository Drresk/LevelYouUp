// Pixel art icons — 8×8 grids at 4× scale = 32px display
// 0 = transparent, 1 = primary, 2 = secondary, 3 = white highlight, 4 = dark shade

export type PixelIconKey =
  | 'sword' | 'shield' | 'coin' | 'star' | 'flame' | 'crown' | 'trophy'
  | 'pomodoro' | 'calendar' | 'wallet' | 'water_drop' | 'heart' | 'lightning'
  | 'scroll' | 'gem' | 'skull' | 'chest' | 'arrow_up' | 'person' | 'chat_bubble'
  | 'badge' | 'home' | 'feed' | 'lock' | 'check'

export interface PixelIconDef {
  pixels: number[][]   // 8×8 grid
  primary: string
  secondary: string
  white?: string
  dark?: string
}

const T = 0, P = 1, S = 2, W = 3, D = 4

export const PIXEL_ICONS: Record<PixelIconKey, PixelIconDef> = {
  coin: {
    pixels: [
      [T,T,P,P,P,P,T,T],
      [T,P,P,W,P,P,P,T],
      [P,P,W,P,P,P,P,P],
      [P,P,P,P,S,P,P,P],
      [P,P,P,S,P,P,P,P],
      [P,P,P,P,P,W,P,P],
      [T,P,P,P,P,P,P,T],
      [T,T,P,P,P,P,T,T],
    ],
    primary: '#F5A623', secondary: '#C97D0A', white: '#FFE8A0', dark: '#8B5500',
  },

  flame: {
    pixels: [
      [T,T,T,P,T,T,T,T],
      [T,T,P,P,P,T,T,T],
      [T,P,S,P,P,P,T,T],
      [P,P,S,S,P,P,P,T],
      [P,P,P,S,S,P,P,T],
      [T,P,P,P,P,P,T,T],
      [T,T,P,P,P,T,T,T],
      [T,T,T,P,T,T,T,T],
    ],
    primary: '#FF8C42', secondary: '#FFE000', white: '#FFFFFF',
  },

  sword: {
    pixels: [
      [T,T,T,T,T,T,W,P],
      [T,T,T,T,T,W,P,T],
      [T,T,T,S,P,P,T,T],
      [T,T,P,P,S,T,T,T],
      [T,P,P,S,T,T,T,T],
      [P,P,S,T,S,S,T,T],
      [P,S,T,T,T,S,T,T],
      [T,T,T,T,T,T,T,T],
    ],
    primary: '#E8E8F0', secondary: '#9898B8', white: '#FFFFFF',
  },

  shield: {
    pixels: [
      [T,P,P,P,P,P,T,T],
      [P,P,S,P,P,P,P,T],
      [P,S,P,P,P,S,P,T],
      [P,P,P,W,P,P,P,T],
      [P,P,P,P,P,P,P,T],
      [T,P,P,P,P,P,T,T],
      [T,T,P,P,P,T,T,T],
      [T,T,T,P,T,T,T,T],
    ],
    primary: '#6B2FD4', secondary: '#9B7FE8', white: '#FFFFFF',
  },

  star: {
    pixels: [
      [T,T,T,P,T,T,T,T],
      [T,T,T,P,T,T,T,T],
      [P,P,P,P,P,P,P,T],
      [T,P,P,P,P,P,T,T],
      [T,T,P,P,P,T,T,T],
      [T,P,P,T,P,P,T,T],
      [P,P,T,T,T,P,P,T],
      [T,T,T,T,T,T,T,T],
    ],
    primary: '#FFE000', secondary: '#F5A623', white: '#FFFFFF',
  },

  crown: {
    pixels: [
      [P,T,T,T,T,T,P,T],
      [P,P,T,P,T,P,P,T],
      [P,P,P,P,P,P,P,T],
      [P,S,P,S,P,S,P,T],
      [P,P,P,P,P,P,P,T],
      [P,P,P,P,P,P,P,T],
      [T,T,T,T,T,T,T,T],
      [T,T,T,T,T,T,T,T],
    ],
    primary: '#F5A623', secondary: '#C97D0A', white: '#FFE8A0',
  },

  trophy: {
    pixels: [
      [T,P,P,P,P,P,T,T],
      [P,P,W,P,P,P,P,T],
      [P,P,P,P,P,P,P,T],
      [T,P,P,P,P,P,T,T],
      [T,T,P,P,P,T,T,T],
      [T,T,T,P,T,T,T,T],
      [T,P,P,P,P,P,T,T],
      [T,T,T,T,T,T,T,T],
    ],
    primary: '#F5A623', secondary: '#C97D0A', white: '#FFE8A0',
  },

  pomodoro: {
    pixels: [
      [T,T,T,S,T,T,T,T],
      [T,T,S,S,T,T,T,T],
      [T,P,P,P,P,P,T,T],
      [P,P,W,P,P,P,P,T],
      [P,P,P,P,P,P,P,T],
      [P,P,P,P,P,P,P,T],
      [T,P,P,P,P,P,T,T],
      [T,T,P,P,P,T,T,T],
    ],
    primary: '#FF3B5C', secondary: '#00C875', white: '#FFB0BC',
  },

  calendar: {
    pixels: [
      [T,T,P,T,T,P,T,T],
      [P,P,P,P,P,P,P,T],
      [P,W,P,W,P,W,P,T],
      [P,P,P,P,P,P,P,T],
      [P,P,W,P,P,W,P,T],
      [P,P,P,P,P,P,P,T],
      [P,W,P,P,W,P,P,T],
      [P,P,P,P,P,P,P,T],
    ],
    primary: '#3B82F6', secondary: '#1D4ED8', white: '#FFFFFF',
  },

  wallet: {
    pixels: [
      [T,P,P,P,P,P,P,T],
      [P,P,P,P,P,P,P,P],
      [P,P,P,P,P,P,P,P],
      [P,P,T,S,S,T,P,P],
      [P,P,T,S,S,T,P,P],
      [P,P,P,P,P,P,P,P],
      [P,P,P,P,P,P,P,P],
      [T,P,P,P,P,P,P,T],
    ],
    primary: '#6B2FD4', secondary: '#F5A623', white: '#FFFFFF',
  },

  water_drop: {
    pixels: [
      [T,T,T,P,T,T,T,T],
      [T,T,P,P,P,T,T,T],
      [T,P,W,P,P,P,T,T],
      [P,P,P,P,P,P,P,T],
      [P,P,P,P,P,P,P,T],
      [P,P,P,P,P,P,P,T],
      [T,P,P,P,P,P,T,T],
      [T,T,T,P,T,T,T,T],
    ],
    primary: '#00D4FF', secondary: '#0099BB', white: '#AAFFFF',
  },

  heart: {
    pixels: [
      [T,P,P,T,P,P,T,T],
      [P,P,P,P,P,P,P,T],
      [P,W,P,P,P,P,P,T],
      [P,P,P,P,P,P,P,T],
      [T,P,P,P,P,P,T,T],
      [T,T,P,P,P,T,T,T],
      [T,T,T,P,T,T,T,T],
      [T,T,T,T,T,T,T,T],
    ],
    primary: '#FF3B5C', secondary: '#CC1A3A', white: '#FFB0BC',
  },

  lightning: {
    pixels: [
      [T,T,T,P,P,T,T,T],
      [T,T,P,P,P,T,T,T],
      [T,P,P,P,T,T,T,T],
      [P,P,P,P,P,P,T,T],
      [T,T,T,P,P,P,T,T],
      [T,T,T,T,P,P,T,T],
      [T,T,T,T,T,P,T,T],
      [T,T,T,T,T,T,T,T],
    ],
    primary: '#FFE000', secondary: '#F5A623', white: '#FFFFFF',
  },

  scroll: {
    pixels: [
      [S,P,P,P,P,P,P,S],
      [S,P,W,P,P,P,P,S],
      [S,P,P,P,P,P,P,S],
      [S,P,P,W,W,P,P,S],
      [S,P,P,P,P,P,P,S],
      [S,P,W,P,P,W,P,S],
      [S,P,P,P,P,P,P,S],
      [S,P,P,P,P,P,P,S],
    ],
    primary: '#F5CBA7', secondary: '#8B5E3C', white: '#FFFFFF',
  },

  gem: {
    pixels: [
      [T,T,P,P,P,P,T,T],
      [T,P,P,W,P,P,P,T],
      [P,P,P,P,P,P,P,P],
      [P,P,P,P,P,P,P,P],
      [T,P,P,P,P,P,P,T],
      [T,T,P,P,P,P,T,T],
      [T,T,T,P,P,T,T,T],
      [T,T,T,T,T,T,T,T],
    ],
    primary: '#00D4FF', secondary: '#0099BB', white: '#AAFFFF',
  },

  skull: {
    pixels: [
      [T,T,P,P,P,P,T,T],
      [T,P,P,W,P,P,P,T],
      [P,P,D,P,P,D,P,P],
      [P,P,D,P,P,D,P,P],
      [P,P,P,P,P,P,P,P],
      [T,P,P,P,P,P,P,T],
      [T,P,D,P,D,P,D,T],
      [T,T,P,T,P,T,T,T],
    ],
    primary: '#FFFFFF', secondary: '#CCCCCC', white: '#FFFFFF', dark: '#0D0D1A',
  },

  chest: {
    pixels: [
      [T,P,P,P,P,P,T,T],
      [P,P,S,S,S,P,P,T],
      [P,P,P,P,P,P,P,T],
      [P,S,P,S,P,S,P,T],
      [P,P,P,P,P,P,P,T],
      [P,P,S,P,S,P,P,T],
      [P,P,P,P,P,P,P,T],
      [T,P,P,P,P,P,T,T],
    ],
    primary: '#C97D0A', secondary: '#F5A623', white: '#FFE8A0',
  },

  arrow_up: {
    pixels: [
      [T,T,T,P,T,T,T,T],
      [T,T,P,P,P,T,T,T],
      [T,P,P,P,P,P,T,T],
      [P,P,P,P,P,P,P,T],
      [T,T,T,P,T,T,T,T],
      [T,T,T,P,T,T,T,T],
      [T,T,T,P,T,T,T,T],
      [T,T,T,P,T,T,T,T],
    ],
    primary: '#00C875', secondary: '#007A45', white: '#AAFFCC',
  },

  person: {
    pixels: [
      [T,T,P,P,P,T,T,T],
      [T,T,P,P,P,T,T,T],
      [T,T,P,P,P,T,T,T],
      [T,T,T,T,T,T,T,T],
      [T,P,P,P,P,P,T,T],
      [T,P,P,P,P,P,T,T],
      [T,T,P,T,P,T,T,T],
      [T,T,P,T,P,T,T,T],
    ],
    primary: '#9B7FE8', secondary: '#6B2FD4', white: '#FFFFFF',
  },

  chat_bubble: {
    pixels: [
      [T,P,P,P,P,P,T,T],
      [P,P,P,P,P,P,P,T],
      [P,P,W,P,W,P,P,T],
      [P,P,P,P,P,P,P,T],
      [P,P,W,W,W,P,P,T],
      [T,P,P,P,P,P,T,T],
      [T,T,P,T,T,T,T,T],
      [T,T,T,T,T,T,T,T],
    ],
    primary: '#00D4FF', secondary: '#0099BB', white: '#FFFFFF',
  },

  badge: {
    pixels: [
      [T,T,P,P,P,T,T,T],
      [T,P,P,S,P,P,T,T],
      [P,P,S,P,S,P,P,T],
      [P,P,P,P,P,P,P,T],
      [T,P,P,P,P,P,T,T],
      [T,T,P,P,P,T,T,T],
      [T,T,T,P,T,T,T,T],
      [T,T,T,P,T,T,T,T],
    ],
    primary: '#F5A623', secondary: '#C97D0A', white: '#FFE8A0',
  },

  home: {
    pixels: [
      [T,T,T,P,T,T,T,T],
      [T,T,P,P,P,T,T,T],
      [T,P,P,P,P,P,T,T],
      [P,P,P,P,P,P,P,T],
      [T,P,D,P,P,D,T,T],
      [T,P,D,P,P,D,T,T],
      [T,P,P,P,P,P,T,T],
      [T,P,P,P,P,P,T,T],
    ],
    primary: '#9B7FE8', secondary: '#6B2FD4', white: '#FFFFFF', dark: '#282870',
  },

  feed: {
    pixels: [
      [T,T,T,T,T,T,T,T],
      [P,P,P,P,P,P,T,T],
      [T,T,T,T,T,T,T,T],
      [P,P,P,P,T,T,T,T],
      [T,T,T,T,T,T,T,T],
      [P,P,P,P,P,P,P,T],
      [T,T,T,T,T,T,T,T],
      [P,P,P,T,T,T,T,T],
    ],
    primary: '#00D4FF', secondary: '#0099BB', white: '#FFFFFF',
  },

  lock: {
    pixels: [
      [T,T,P,P,P,T,T,T],
      [T,P,T,T,T,P,T,T],
      [T,P,T,T,T,P,T,T],
      [P,P,P,P,P,P,P,T],
      [P,P,P,W,P,P,P,T],
      [P,P,P,P,P,P,P,T],
      [P,P,P,P,P,P,P,T],
      [T,P,P,P,P,P,T,T],
    ],
    primary: '#F5A623', secondary: '#C97D0A', white: '#FFFFFF',
  },

  check: {
    pixels: [
      [T,T,T,T,T,T,T,T],
      [T,T,T,T,T,T,P,T],
      [T,T,T,T,T,P,P,T],
      [T,T,T,T,P,P,T,T],
      [P,T,T,P,P,T,T,T],
      [P,P,P,P,T,T,T,T],
      [T,P,P,T,T,T,T,T],
      [T,T,T,T,T,T,T,T],
    ],
    primary: '#00C875', secondary: '#007A45', white: '#AAFFCC',
  },
}
