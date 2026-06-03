export type HabitCategory =
  | 'health'
  | 'learning'
  | 'productivity'
  | 'wellness'
  | 'personal'
  | 'fitness'
  | 'nutrition'
  | 'mindfulness'

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom'

export type HabitStatus = 'active' | 'paused' | 'archived'

export interface Habit {
  _id: string
  deviceId: string
  name: string
  description?: string
  category: HabitCategory
  color: string
  icon: string
  frequency: HabitFrequency
  customDays?: number[] // 0=Sun … 6=Sat
  reminderEnabled: boolean
  reminderTime?: string // "HH:mm"
  status: HabitStatus
  createdAt: string
  updatedAt: string
}

export interface CheckIn {
  _id: string
  habitId: string
  deviceId: string
  date: string // "YYYY-MM-DD"
  completedAt: string
}

export interface HabitWithStreak extends Habit {
  streak: number
  completedToday: boolean
  completionRate: number // 0-100
}

export interface DailyProgress {
  date: string
  total: number
  completed: number
}

export interface ProgressStats {
  currentStreak: number
  longestStreak: number
  weeklyRate: number
  monthlyRate: number
  daily: DailyProgress[]
}

export interface PushSubscriptionPayload {
  deviceId: string
  habitId: string
  subscription: PushSubscriptionJSON
  reminderTime: string
}
