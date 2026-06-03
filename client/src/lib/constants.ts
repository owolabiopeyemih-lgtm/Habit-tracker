import type { HabitCategory } from '../types'

export const CATEGORY_META: Record<HabitCategory, { label: string; color: string; bg: string }> = {
  health:       { label: 'Health',       color: '#ef4444', bg: '#fef2f2' },
  fitness:      { label: 'Fitness',      color: '#f97316', bg: '#fff7ed' },
  nutrition:    { label: 'Nutrition',    color: '#84cc16', bg: '#f7fee7' },
  learning:     { label: 'Learning',     color: '#3b82f6', bg: '#eff6ff' },
  productivity: { label: 'Productivity', color: '#6366f1', bg: '#eef2ff' },
  wellness:     { label: 'Wellness',     color: '#a855f7', bg: '#faf5ff' },
  mindfulness:  { label: 'Mindfulness',  color: '#06b6d4', bg: '#ecfeff' },
  personal:     { label: 'Personal',     color: '#ec4899', bg: '#fdf2f8' },
}

export const HABIT_COLORS = [
  '#6366f1', '#ec4899', '#f97316', '#ef4444',
  '#84cc16', '#22c55e', '#06b6d4', '#3b82f6',
  '#a855f7', '#f59e0b',
]

export const HABIT_ICONS = [
  '💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '✍️',
  '🎯', '🧠', '🌱', '🎵', '🏋️', '🚴', '🛁', '💊',
]
