import { Schema, model, Document } from 'mongoose'

export interface IHabit extends Document {
  deviceId: string
  name: string
  description: string
  category: string
  color: string
  icon: string
  frequency: 'daily' | 'weekdays' | 'weekends' | 'custom'
  customDays: number[]
  reminderEnabled: boolean
  reminderTime: string
  status: 'active' | 'paused' | 'archived'
}

const HabitSchema = new Schema<IHabit>(
  {
    deviceId:       { type: String, required: true, index: true },
    name:           { type: String, required: true, trim: true, maxlength: 100 },
    description:    { type: String, default: '', maxlength: 300 },
    category:       { type: String, required: true, default: 'health' },
    color:          { type: String, default: '#6366f1' },
    icon:           { type: String, default: '💪' },
    frequency:      { type: String, enum: ['daily', 'weekdays', 'weekends', 'custom'], default: 'daily' },
    customDays:     { type: [Number], default: [] },
    reminderEnabled:{ type: Boolean, default: false },
    reminderTime:   { type: String, default: '08:00' },
    status:         { type: String, enum: ['active', 'paused', 'archived'], default: 'active' },
  },
  { timestamps: true },
)

export const Habit = model<IHabit>('Habit', HabitSchema)
