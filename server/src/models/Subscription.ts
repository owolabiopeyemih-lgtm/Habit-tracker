import { Schema, model, Document } from 'mongoose'

export interface ISubscription extends Document {
  deviceId: string
  habitId: string
  subscription: object
  reminderTime: string
}

const SubscriptionSchema = new Schema<ISubscription>({
  deviceId:     { type: String, required: true },
  habitId:      { type: String, required: true },
  subscription: { type: Object, required: true },
  reminderTime: { type: String, required: true },
})

SubscriptionSchema.index({ deviceId: 1, habitId: 1 }, { unique: true })

export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema)
