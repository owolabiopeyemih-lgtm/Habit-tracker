import { Router } from 'express'
import { Subscription } from '../models/Subscription'

const router = Router()

router.post('/subscribe', async (req, res) => {
  const { deviceId, habitId, subscription, reminderTime } = req.body
  await Subscription.findOneAndUpdate(
    { deviceId, habitId },
    { deviceId, habitId, subscription, reminderTime },
    { upsert: true, new: true },
  )
  res.json({ ok: true })
})

router.delete('/subscribe/:habitId', async (req, res) => {
  const deviceId = req.headers['x-device-id'] as string
  await Subscription.findOneAndDelete({ deviceId, habitId: req.params.habitId })
  res.json({ ok: true })
})

export default router
