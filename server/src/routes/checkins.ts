import { Router } from 'express'
import { CheckIn } from '../models/CheckIn'

const router = Router()

router.post('/', async (req, res) => {
  const deviceId = req.headers['x-device-id'] as string
  const { habitId, date } = req.body
  const checkin = await CheckIn.findOneAndUpdate(
    { habitId, date },
    { habitId, deviceId, date, completedAt: new Date() },
    { upsert: true, new: true },
  )
  res.status(201).json(checkin)
})

router.delete('/:habitId/:date', async (req, res) => {
  const { habitId, date } = req.params
  await CheckIn.findOneAndDelete({ habitId, date })
  res.json({ ok: true })
})

export default router
