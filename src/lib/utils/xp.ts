export function xpForLevel(level: number): number {
  return Math.round(20 * Math.pow(level, 1.8))
}

export interface LevelUpResult {
  newLevel: number
  newCurrentXP: number
  newTotalXP: number
  newXpToNextLevel: number
  levelsGained: number
}

export function applyXP(
  currentLevel: number,
  currentXP: number,
  totalXP: number,
  xpGained: number
): LevelUpResult {
  let level = currentLevel
  let xp = currentXP + xpGained
  let total = totalXP + xpGained
  let levelsGained = 0

  let needed = xpForLevel(level)
  while (xp >= needed) {
    xp -= needed
    level++
    levelsGained++
    needed = xpForLevel(level)
  }

  return {
    newLevel: level,
    newCurrentXP: xp,
    newTotalXP: total,
    newXpToNextLevel: xpForLevel(level),
    levelsGained,
  }
}

export function xpProgress(currentXP: number, xpToNextLevel: number): number {
  return Math.min(100, Math.round((currentXP / xpToNextLevel) * 100))
}
