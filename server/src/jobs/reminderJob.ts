import cron from 'node-cron'
import webpush from 'web-push'
import { Subscription } from '../models/Subscription'
import { Habit } from '../models/Habit'
import { CheckIn } from '../models/CheckIn'
import { format } from 'date-fns'

export function startReminderJob() {
  // Run every minute, send reminders whose time matches
  cron.schedule('* * * * *', async () => {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const today = format(now, 'yyyy-MM-dd')

    const subs = await Subscription.find({ reminderTime: currentTime })
    for (const sub of subs) {
      const habit = await Habit.findById(sub.habitId)
      if (!habit || habit.status !== 'active' || !habit.reminderEnabled) continue

      const alreadyDone = await CheckIn.exists({ habitId: sub.habitId, date: today })
      if (alreadyDone) continue

      try {
        await webpush.sendNotification(
          sub.subscription as webpush.PushSubscription,
          JSON.stringify({
            title: `${habit.icon} Time for "${habit.name}"`,
            body: "Don't break your streak — check in now!",
            url: '/',
            tag: `reminder-${sub.habitId}`,
          }),
        )
      } catch {
        // subscription may be expired — clean it up
        await Subscription.findByIdAndDelete(sub._id)
      }
    }
  })
}
