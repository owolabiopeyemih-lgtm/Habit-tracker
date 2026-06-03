import { Router } from 'express'
import { Habit } from '../models/Habit'
import { CheckIn } from '../models/CheckIn'
import { computeStreak } from '../utils/streaks'
import { format } from 'date-fns'

const router = Router()

router.get('/', async (req, res) => {
  const deviceId = req.headers['x-device-id'] as string
  const habits = await Habit.find({ deviceId }).sort({ createdAt: -1 })
  const today = format(new Date(), 'yyyy-MM-dd')

  const enriched = await Promise.all(habits.map(async (h) => {
    const allCheckins = await CheckIn.find({ habitId: h._id.toString() }).select('date')
    const dates = allCheckins.map((c) => c.date)
    const todayCheckin = dates.includes(today)

    // completion rate: last 7 days
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i)
      return format(d, 'yyyy-MM-dd')
    })
    const completedLast7 = dates.filter((d) => last7.includes(d)).length
    const completionRate = Math.round((completedLast7 / 7) * 100)

    return {
      ...h.toObject(),
      streak: computeStreak(dates),
      completedToday: todayCheckin,
      completionRate,
    }
  }))

  res.json(enriched)
})

router.post('/', async (req, res) => {
  const deviceId = req.headers['x-device-id'] as string
  const habit = await Habit.create({ ...req.body, deviceId })
  res.status(201).json({ ...habit.toObject(), streak: 0, completedToday: false, completionRate: 0 })
})

router.put('/:id', async (req, res) => {
  const deviceId = req.headers['x-device-id'] as string
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, deviceId },
    req.body,
    { new: true, runValidators: true },
  )
  if (!habit) return res.status(404).json({ error: 'Not found' })
  res.json(habit)
})

router.delete('/:id', async (req, res) => {
  const deviceId = req.headers['x-device-id'] as string
  await Habit.findOneAndDelete({ _id: req.params.id, deviceId })
  await CheckIn.deleteMany({ habitId: req.params.id })
  res.json({ ok: true })
})

export default router
