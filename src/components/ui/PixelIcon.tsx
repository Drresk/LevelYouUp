type PC = string | null // pixel color, null = transparent

const ICONS: Record<string, PC[][]> = {
  flame: [
    [null,null,null,'#FF6B00',null,null,null,null],
    [null,null,'#FF6B00','#FFB800','#FF6B00',null,null,null],
    [null,'#FF6B00','#FFB800','#FFE566','#FFB800','#FF6B00',null,null],
    ['#FF6B00','#FFB800','#FFE566','#FFFFFF','#FFE566','#FFB800','#FF6B00',null],
    ['#FF6B00','#FFB800','#FFE566','#FFE566','#FFB800','#FF6B00',null,null],
    [null,'#FF6B00','#FFB800','#FFB800','#FF6B00',null,null,null],
    [null,null,'#FF6B00','#FF6B00',null,null,null,null],
    [null,null,null,null,null,null,null,null],
  ],
  coin: [
    [null,null,'#F5A623','#F5A623','#F5A623','#F5A623',null,null],
    [null,'#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623',null],
    ['#F5A623','#FCD34D','#FCD34D','#B7791F','#B7791F','#FCD34D','#FCD34D','#F5A623'],
    ['#F5A623','#FCD34D','#B7791F','#FCD34D','#FCD34D','#B7791F','#FCD34D','#F5A623'],
    ['#F5A623','#FCD34D','#FCD34D','#B7791F','#B7791F','#FCD34D','#FCD34D','#F5A623'],
    ['#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623'],
    [null,'#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623',null],
    [null,null,'#F5A623','#F5A623','#F5A623','#F5A623',null,null],
  ],
  sword: [
    [null,null,null,null,null,null,'#C0C0C0','#E8E8E8'],
    [null,null,null,null,null,'#C0C0C0','#E8E8E8','#C0C0C0'],
    [null,null,null,null,'#C0C0C0','#E8E8E8','#C0C0C0',null],
    [null,null,'#F5A623','#F5A623','#E8E8E8','#C0C0C0',null,null],
    [null,'#F5A623','#E8E8E8','#E8E8E8','#F5A623',null,null,null],
    ['#8B6914','#8B6914','#F5A623',null,null,null,null,null],
    [null,'#8B6914',null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
  ],
  shield: [
    [null,'#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4',null],
    ['#6B2FD4','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#6B2FD4'],
    ['#6B2FD4','#8B5CF6','#FFFFFF','#8B5CF6','#8B5CF6','#FFFFFF','#8B5CF6','#6B2FD4'],
    ['#6B2FD4','#8B5CF6','#8B5CF6','#F5A623','#F5A623','#8B5CF6','#8B5CF6','#6B2FD4'],
    ['#6B2FD4','#8B5CF6','#8B5CF6','#F5A623','#F5A623','#8B5CF6','#8B5CF6','#6B2FD4'],
    [null,'#6B2FD4','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#6B2FD4',null],
    [null,null,'#6B2FD4','#8B5CF6','#8B5CF6','#6B2FD4',null,null],
    [null,null,null,'#6B2FD4','#6B2FD4',null,null,null],
  ],
  star: [
    [null,null,null,'#F5A623','#F5A623',null,null,null],
    [null,null,null,'#FCD34D','#FCD34D',null,null,null],
    ['#F5A623','#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623','#F5A623'],
    [null,'#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D',null],
    [null,null,'#F5A623','#FCD34D','#FCD34D','#F5A623',null,null],
    [null,'#F5A623','#F5A623',null,null,'#F5A623','#F5A623',null],
    ['#F5A623',null,null,null,null,null,null,'#F5A623'],
    [null,null,null,null,null,null,null,null],
  ],
  crown: [
    ['#F5A623',null,null,'#F5A623','#F5A623',null,null,'#F5A623'],
    ['#F5A623','#FCD34D',null,'#FCD34D','#FCD34D',null,'#FCD34D','#F5A623'],
    ['#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623'],
    ['#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623'],
    ['#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623'],
    ['#F5A623','#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623','#F5A623'],
    [null,null,'#F5A623','#F5A623','#F5A623','#F5A623',null,null],
    [null,null,null,null,null,null,null,null],
  ],
  water: [
    [null,null,null,'#00D4FF','#00D4FF',null,null,null],
    [null,null,'#00D4FF','#7FE9FF','#7FE9FF','#00D4FF',null,null],
    [null,'#00D4FF','#7FE9FF','#FFFFFF','#7FE9FF','#7FE9FF','#00D4FF',null],
    ['#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF'],
    ['#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF'],
    [null,'#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF',null],
    [null,null,'#00D4FF','#7FE9FF','#7FE9FF','#00D4FF',null,null],
    [null,null,null,'#00D4FF','#00D4FF',null,null,null],
  ],
  trophy: [
    [null,'#F5A623','#F5A623','#F5A623','#F5A623','#F5A623','#F5A623',null],
    ['#F5A623','#FCD34D','#FFFFFF','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623'],
    ['#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623'],
    [null,'#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623',null],
    [null,null,'#F5A623','#FCD34D','#FCD34D','#F5A623',null,null],
    [null,null,null,'#F5A623','#F5A623',null,null,null],
    [null,'#F5A623','#F5A623','#F5A623','#F5A623','#F5A623','#F5A623',null],
    [null,null,null,null,null,null,null,null],
  ],
  pomodoro: [
    [null,null,null,'#00C875','#00C875',null,null,null],
    [null,null,'#00C875','#00C875',null,null,null,null],
    [null,'#FF3B5C','#FF3B5C','#FF3B5C','#FF3B5C','#FF3B5C','#FF3B5C',null],
    ['#FF3B5C','#FF7088','#FFFFFF','#FF7088','#FF7088','#FF7088','#FF7088','#FF3B5C'],
    ['#FF3B5C','#FF7088','#FF7088','#FF7088','#FF7088','#FF7088','#FF7088','#FF3B5C'],
    ['#FF3B5C','#FF7088','#FF7088','#FF3B5C','#FF3B5C','#FF7088','#FF7088','#FF3B5C'],
    [null,'#FF3B5C','#FF7088','#FF7088','#FF7088','#FF7088','#FF3B5C',null],
    [null,null,'#FF3B5C','#FF3B5C','#FF3B5C','#FF3B5C',null,null],
  ],
  wallet: [
    [null,'#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4',null],
    ['#6B2FD4','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#6B2FD4'],
    ['#6B2FD4','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#6B2FD4'],
    ['#6B2FD4','#6B2FD4','#F5A623','#F5A623','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4'],
    ['#6B2FD4','#6B2FD4','#F5A623','#FCD34D','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4'],
    ['#6B2FD4','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#6B2FD4'],
    ['#6B2FD4','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#6B2FD4'],
    [null,'#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4',null],
  ],
  heart: [
    [null,'#FF3B5C','#FF3B5C',null,'#FF3B5C','#FF3B5C',null,null],
    ['#FF3B5C','#FF7088','#FF7088','#FF3B5C','#FF7088','#FF7088','#FF3B5C',null],
    ['#FF3B5C','#FF7088','#FFFFFF','#FF7088','#FF7088','#FF7088','#FF3B5C',null],
    ['#FF3B5C','#FF7088','#FF7088','#FF7088','#FF7088','#FF7088','#FF3B5C',null],
    [null,'#FF3B5C','#FF7088','#FF7088','#FF7088','#FF3B5C',null,null],
    [null,null,'#FF3B5C','#FF7088','#FF3B5C',null,null,null],
    [null,null,null,'#FF3B5C',null,null,null,null],
    [null,null,null,null,null,null,null,null],
  ],
  lightning: [
    [null,null,null,'#FCD34D','#FCD34D',null,null,null],
    [null,null,'#FCD34D','#FFFFFF','#FCD34D',null,null,null],
    [null,'#FCD34D','#FCD34D','#FCD34D',null,null,null,null],
    ['#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D',null,null],
    [null,null,null,'#FCD34D','#FCD34D','#FCD34D','#F5A623',null],
    [null,null,'#FCD34D','#FCD34D','#FCD34D',null,null,null],
    [null,'#F5A623','#FCD34D','#FCD34D',null,null,null,null],
    [null,null,null,null,null,null,null,null],
  ],
  chest: [
    [null,'#8B6914','#8B6914','#8B6914','#8B6914','#8B6914','#8B6914',null],
    ['#8B6914','#F5A623','#FCD34D','#8B6914','#8B6914','#FCD34D','#F5A623','#8B6914'],
    ['#8B6914','#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623','#8B6914'],
    ['#8B6914','#8B6914','#8B6914','#8B6914','#8B6914','#8B6914','#8B6914','#8B6914'],
    ['#8B6914','#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623','#8B6914'],
    ['#8B6914','#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623','#8B6914'],
    ['#8B6914','#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623','#8B6914'],
    [null,'#8B6914','#8B6914','#8B6914','#8B6914','#8B6914','#8B6914',null],
  ],
  gem: [
    [null,null,'#00D4FF','#00D4FF','#00D4FF','#00D4FF',null,null],
    [null,'#00D4FF','#7FE9FF','#FFFFFF','#7FE9FF','#00D4FF','#00D4FF',null],
    ['#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF',null],
    ['#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF',null],
    [null,'#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF',null,null],
    [null,null,'#00D4FF','#7FE9FF','#00D4FF',null,null,null],
    [null,null,null,'#00D4FF',null,null,null,null],
    [null,null,null,null,null,null,null,null],
  ],
  skull: [
    [null,null,'#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF',null,null],
    [null,'#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF',null],
    ['#FFFFFF','#FFFFFF','#13132A','#FFFFFF','#FFFFFF','#13132A','#FFFFFF','#FFFFFF'],
    ['#FFFFFF','#FFFFFF','#13132A','#FFFFFF','#FFFFFF','#13132A','#FFFFFF','#FFFFFF'],
    ['#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF'],
    [null,'#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF',null],
    [null,'#FFFFFF','#13132A','#FFFFFF','#13132A','#FFFFFF',null,null],
    [null,null,'#FFFFFF','#FFFFFF','#FFFFFF',null,null,null],
  ],
  check: [
    [null,null,null,null,null,null,'#00C875',null],
    [null,null,null,null,null,'#00C875','#00C875',null],
    [null,null,null,null,'#00C875','#7FD4A8',null,null],
    [null,'#00C875',null,'#00C875','#7FD4A8',null,null,null],
    ['#00C875','#7FD4A8','#00C875','#7FD4A8',null,null,null,null],
    [null,'#00C875','#00C875',null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
  ],
  lock: [
    [null,null,'#F5A623','#F5A623','#F5A623',null,null,null],
    [null,'#F5A623',null,null,null,'#F5A623',null,null],
    [null,'#F5A623',null,null,null,'#F5A623',null,null],
    ['#8B6914','#8B6914','#8B6914','#8B6914','#8B6914','#8B6914','#8B6914',null],
    ['#8B6914','#F5A623','#F5A623','#FCD34D','#F5A623','#F5A623','#8B6914',null],
    ['#8B6914','#F5A623','#F5A623','#F5A623','#F5A623','#F5A623','#8B6914',null],
    ['#8B6914','#F5A623','#F5A623','#F5A623','#F5A623','#F5A623','#8B6914',null],
    ['#8B6914','#8B6914','#8B6914','#8B6914','#8B6914','#8B6914','#8B6914',null],
  ],
  home: [
    [null,null,null,'#8B5CF6','#8B5CF6',null,null,null],
    [null,null,'#8B5CF6','#6B2FD4','#6B2FD4','#8B5CF6',null,null],
    [null,'#8B5CF6','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#8B5CF6',null],
    ['#8B5CF6','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#8B5CF6'],
    [null,'#6B2FD4','#6B2FD4','#13132A','#13132A','#6B2FD4','#6B2FD4',null],
    [null,'#6B2FD4','#6B2FD4','#13132A','#13132A','#6B2FD4','#6B2FD4',null],
    [null,'#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4',null],
    [null,'#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4','#6B2FD4',null],
  ],
  chat: [
    [null,'#00D4FF','#00D4FF','#00D4FF','#00D4FF','#00D4FF','#00D4FF',null],
    ['#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF'],
    ['#00D4FF','#7FE9FF','#FFFFFF','#7FE9FF','#FFFFFF','#7FE9FF','#7FE9FF','#00D4FF'],
    ['#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF'],
    ['#00D4FF','#7FE9FF','#FFFFFF','#FFFFFF','#FFFFFF','#7FE9FF','#7FE9FF','#00D4FF'],
    [null,'#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF',null],
    [null,null,'#00D4FF','#00D4FF',null,null,null,null],
    [null,null,null,null,null,null,null,null],
  ],
  person: [
    [null,null,'#8B5CF6','#8B5CF6','#8B5CF6',null,null,null],
    [null,'#8B5CF6','#C4B5FD','#C4B5FD','#C4B5FD','#8B5CF6',null,null],
    [null,'#8B5CF6','#C4B5FD','#FFFFFF','#C4B5FD','#8B5CF6',null,null],
    [null,null,'#8B5CF6','#8B5CF6','#8B5CF6',null,null,null],
    [null,'#6B2FD4','#8B5CF6','#8B5CF6','#8B5CF6','#6B2FD4',null,null],
    ['#6B2FD4','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#8B5CF6','#6B2FD4',null],
    [null,'#6B2FD4','#8B5CF6',null,'#8B5CF6','#6B2FD4',null,null],
    [null,'#6B2FD4','#8B5CF6',null,'#8B5CF6','#6B2FD4',null,null],
  ],
  badge: [
    [null,null,'#F5A623','#F5A623','#F5A623',null,null,null],
    [null,'#F5A623','#FCD34D','#FFFFFF','#FCD34D','#F5A623',null,null],
    ['#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623',null],
    ['#F5A623','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#FCD34D','#F5A623',null],
    [null,'#F5A623','#FCD34D','#FCD34D','#FCD34D','#F5A623',null,null],
    [null,null,'#F5A623','#FCD34D','#F5A623',null,null,null],
    [null,null,null,'#F5A623','#F5A623',null,null,null],
    [null,null,null,'#F5A623','#F5A623',null,null,null],
  ],
  feed: [
    ['#00D4FF','#00D4FF','#00D4FF','#00D4FF','#00D4FF','#00D4FF',null,null],
    [null,null,null,null,null,null,null,null],
    ['#00D4FF','#00D4FF','#00D4FF','#00D4FF',null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['#00D4FF','#00D4FF','#00D4FF','#00D4FF','#00D4FF','#00D4FF','#00D4FF',null],
    [null,null,null,null,null,null,null,null],
    ['#00D4FF','#00D4FF','#00D4FF',null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
  ],
  calendar: [
    [null,'#3B82F6',null,'#3B82F6',null,'#3B82F6',null,null],
    ['#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6'],
    ['#3B82F6','#FFFFFF','#3B82F6','#FFFFFF','#3B82F6','#FFFFFF','#3B82F6','#3B82F6'],
    ['#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6'],
    ['#3B82F6','#FFFFFF','#3B82F6','#FFFFFF','#3B82F6','#FFFFFF','#3B82F6','#3B82F6'],
    ['#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6'],
    ['#3B82F6','#FFFFFF','#3B82F6','#FFFFFF','#3B82F6',null,null,null],
    ['#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6',null,null,null],
  ],
  arrow_up: [
    [null,null,null,'#00C875','#00C875',null,null,null],
    [null,null,'#00C875','#7FD4A8','#00C875',null,null,null],
    [null,'#00C875','#7FD4A8','#7FD4A8','#7FD4A8','#00C875',null,null],
    ['#00C875','#7FD4A8','#7FD4A8','#7FD4A8','#7FD4A8','#7FD4A8','#00C875',null],
    [null,null,'#00C875','#7FD4A8','#00C875',null,null,null],
    [null,null,'#00C875','#7FD4A8','#00C875',null,null,null],
    [null,null,'#00C875','#7FD4A8','#00C875',null,null,null],
    [null,null,'#00C875','#00C875','#00C875',null,null,null],
  ],
  // Alias for water_drop
  water_drop: [
    [null,null,null,'#00D4FF','#00D4FF',null,null,null],
    [null,null,'#00D4FF','#7FE9FF','#7FE9FF','#00D4FF',null,null],
    [null,'#00D4FF','#7FE9FF','#FFFFFF','#7FE9FF','#7FE9FF','#00D4FF',null],
    ['#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF'],
    ['#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF'],
    [null,'#00D4FF','#7FE9FF','#7FE9FF','#7FE9FF','#7FE9FF','#00D4FF',null],
    [null,null,'#00D4FF','#7FE9FF','#7FE9FF','#00D4FF',null,null],
    [null,null,null,'#00D4FF','#00D4FF',null,null,null],
  ],
}

// Aliases
ICONS['food'] = ICONS['coin']
ICONS['wallet_icon'] = ICONS['wallet']

export type PixelIconKey = keyof typeof ICONS

interface PixelIconProps {
  icon: string
  size?: number // size per pixel in px, default 4
  className?: string
}

export default function PixelIcon({ icon, size = 4, className }: PixelIconProps) {
  const grid = ICONS[icon]
  if (!grid) return null
  const px = `${size}px`

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid[0].length}, ${px})`,
        imageRendering: 'pixelated',
        gap: 0,
        lineHeight: 0,
        flexShrink: 0,
      }}
    >
      {grid.flat().map((color, i) => (
        <div key={i} style={{ width: px, height: px, backgroundColor: color ?? 'transparent' }} />
      ))}
    </div>
  )
}
