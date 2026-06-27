export interface Profile {
  id: string
  email: string
  name: string
  avatar_url: string | null
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
  | 'COMIDA'
  | 'LAZER'
  | 'PASSEIOS'
  | 'ROUPA'
  | 'GAMES'
  | 'ASSINATURAS'
  | 'UBER'
  | 'AVULSO'
  | 'SALARIO'
  | 'FREELA'

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

export type Priority = 'low' | 'medium' | 'high'

export interface ShoppingItem {
  id: string
  user_id: string
  name: string
  estimated_price: number | null
  url: string | null
  priority: Priority
  notes: string | null
  purchased: boolean
  purchased_at: string | null
  created_at: string
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

export interface PomodoroConfig {
  session_minutes: number
  short_break_minutes: number
  long_break_minutes: number
  long_break_interval: number
}

export interface CategorySummary {
  category: TransactionCategory
  spent: number
  limit: number | null
  percentage: number
}
