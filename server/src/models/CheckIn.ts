import { Schema, model, Document } from 'mongoose'

export interface ICheckIn extends Document {
  habitId: string
  deviceId: string
  date: string
  completedAt: Date
}

const CheckInSchema = new Schema<ICheckIn>({
  habitId:     { type: String, required: true, index: true },
  deviceId:    { type: String, required: true, index: true },
  date:        { type: String, required: true },
  completedAt: { type: Date, default: Date.now },
})

CheckInSchema.index({ habitId: 1, date: 1 }, { unique: true })

export const CheckIn = model<ICheckIn>('CheckIn', CheckInSchema)
