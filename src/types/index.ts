export interface Profile {
  id: string
  email: string
  name: string | null
  username: string | null
  avatar_url: string | null
  bio: string | null
  title: string | null
  profile_score: number
  score_updated_at: string | null
  created_at: string
}

export interface Skill {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  level: number
  total_xp: number
  current_xp: number
  xp_to_next_level: number
  streak: number
  last_activity_date: string | null
  created_at: string
}

export interface PomodoroSession {
  id: string
  user_id: string
  skill_id: string | null
  duration_minutes: number
  xp_earned: number
  completed: boolean
  started_at: string
  ended_at: string | null
  skill?: Skill
}

export interface LevelReward {
  id: string
  user_id: string
  skill_id: string
  level_reached: number
  reward_description: string
  redeemed: boolean
  created_at: string
}

export type TransactionCategory =
  | 'COMIDA' | 'LAZER' | 'PASSEIOS' | 'ROUPA'
  | 'GAMES' | 'ASSINATURAS' | 'UBER' | 'AVULSO'
  | 'SALARIO' | 'FREELA'

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'COMIDA', 'LAZER', 'PASSEIOS', 'ROUPA', 'GAMES', 'ASSINATURAS', 'UBER', 'AVULSO',
]
export const INCOME_CATEGORIES: TransactionCategory[] = ['SALARIO', 'FREELA']

export type TransactionType = 'expense' | 'income'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  category: TransactionCategory
  description: string
  created_at: string
}

export interface FinancialGoal {
  id: string
  user_id: string
  category: TransactionCategory
  monthly_limit: number
  updated_at: string
}

export interface MonthlyIncome {
  id: string
  user_id: string
  source: 'salary' | 'freelance'
  amount: number
  month: number
  year: number
}

export type EventType = 'task' | 'reminder' | 'event'
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly'

export interface CalendarEvent {
  id: string
  user_id: string
  title: string
  type: EventType
  date: string
  time: string | null
  recurrence: RecurrenceType
  notify_before: number | null
  skill_id: string | null
  completed: boolean
  created_at: string
  skill?: Skill
}

export interface Achievement {
  key: string
  title: string
  description: string
  icon: string
  category: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_key: string
  unlocked_at: string
  achievement?: Achievement
}

export type GoalStatus = 'planning' | 'in_progress' | 'achieved'

export interface PersonalGoal {
  id: string
  user_id: string
  title: string
  description: string
  status: GoalStatus
  achieved_at: string | null
  created_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  action_taken: string | null
  created_at: string
}

// ---- NEW v2 ----

export interface UserWallet {
  id: string
  user_id: string
  coins: number
  total_earned: number
}

export interface UserConsumables {
  id: string
  user_id: string
  streak_shields: number
  recovery_tokens: number
  xp_boosts: number
}

export interface Avatar {
  id: string
  user_id: string
  base_character: string
  head_item: string | null
  face_item: string | null
  body_item: string | null
  accessory_item: string | null
  updated_at: string
}

export type ShopItemType = 'head' | 'face' | 'body' | 'accessory' | 'streak_shield' | 'recovery_token' | 'xp_boost'
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface ShopItem {
  id: string
  key: string
  name: string
  description: string | null
  type: ShopItemType
  coin_cost: number
  rarity: Rarity
  emoji: string
}

export interface UserInventoryItem {
  id: string
  user_id: string
  item_key: string
  acquired_at: string
  item?: ShopItem
}

export type FriendshipStatus = 'pending' | 'accepted' | 'blocked'

export interface Friendship {
  id: string
  requester_id: string
  addressee_id: string
  status: FriendshipStatus
  created_at: string
}

export interface FeedPost {
  id: string
  user_id: string
  type: string
  achievement_key: string | null
  badge_key: string | null
  created_at: string
  profile?: Profile
  achievement?: Achievement
  reactions?: FeedReaction[]
}

export interface FeedReaction {
  id: string
  post_id: string
  user_id: string
  emoji: string
  created_at: string
}

export interface Badge {
  key: string
  title: string
  description: string
  icon: string
  requirement_type: string
  requirement_value: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_key: string
  unlocked_at: string
  is_active: boolean
  badge?: Badge
}

export interface WaterLog {
  id: string
  user_id: string
  amount_ml: number
  logged_at: string
}

export interface ChallengePool {
  id: string
  key: string
  title: string
  description: string
  type: string
  target_value: number
  reward_coins: number
  icon: string
}

export interface WeeklyChallenge {
  id: string
  user_id: string
  challenge_key: string
  week_start: string
  progress: number
  completed: boolean
  completed_at: string | null
  challenge?: ChallengePool
}

export const BASE_CHARACTERS = [
  { key: 'warrior', label: 'Guerreiro', emoji: '⚔️', color: '#ef4444' },
  { key: 'mage', label: 'Mago', emoji: '🧙', color: '#8b5cf6' },
  { key: 'archer', label: 'Arqueiro', emoji: '🏹', color: '#10b981' },
  { key: 'rogue', label: 'Ladino', emoji: '🗡️', color: '#06b6d4' },
  { key: 'paladin', label: 'Paladino', emoji: '🛡️', color: '#f59e0b' },
]

export const RARITY_COLOR: Record<Rarity, string> = {
  common: '#64748b',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b',
}
