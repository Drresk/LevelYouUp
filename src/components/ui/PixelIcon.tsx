import { PIXEL_ICONS, PixelIconKey } from '@/lib/pixel-icons'

interface PixelIconProps {
  icon: PixelIconKey
  size?: number   // display size in px (default 32)
  className?: string
}

export default function PixelIcon({ icon, size = 32, className = '' }: PixelIconProps) {
  const def = PIXEL_ICONS[icon]
  if (!def) return null

  const grid = def.pixels
  const cols = grid[0].length
  const rows = grid.length
  const cellSize = size / cols

  const colorMap: Record<number, string> = {
    0: 'transparent',
    1: def.primary,
    2: def.secondary || def.primary,
    3: def.white || '#FFFFFF',
    4: def.dark || '#1A1A2E',
  }

  return (
    <svg
      width={size}
      height={(size / cols) * rows}
      viewBox={`0 0 ${cols} ${rows}`}
      className={`pixel-icon ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {grid.map((row, y) =>
        row.map((pixel, x) => {
          if (pixel === 0) return null
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={colorMap[pixel] || 'transparent'}
            />
          )
        })
      )}
    </svg>
  )
}
