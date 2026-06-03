import { Router } from 'express'
import { Habit } from '../models/Habit'
import { CheckIn } from '../models/CheckIn'
import { computeStreak, computeLongestStreak, getDailyProgress } from '../utils/streaks'
import { subDays, format } from 'date-fns'

const router = Router()

router.get('/', async (req, res) => {
  const deviceId = req.headers['x-device-id'] as string
  const { period, habitId } = req.query as { period?: string; habitId?: string }
  const days = period === 'month' ? 30 : 7

  const habitQuery = habitId
    ? { _id: habitId, deviceId }
    : { deviceId, status: 'active' }

  const habits = await Habit.find(habitQuery)
  const habitIds = habits.map((h) => h._id.toString())

  const since = format(subDays(new Date(), days - 1), 'yyyy-MM-dd')
  const checkins = await CheckIn.find({
    habitId: { $in: habitIds },
    date: { $gte: since },
  }).select('habitId date')

  const allCheckins = await CheckIn.find({ habitId: { $in: habitIds } }).select('date')
  const allDates = allCheckins.map((c) => c.date)

  const streak = computeStreak(allDates)
  const longestStreak = computeLongestStreak(allDates)

  const daily = getDailyProgress(habitIds, checkins, days)
  const totalSlots = daily.reduce((sum, d) => sum + d.total, 0)
  const totalDone = daily.reduce((sum, d) => sum + d.completed, 0)
  const rate = totalSlots > 0 ? Math.round((totalDone / totalSlots) * 100) : 0

  res.json({
    currentStreak: streak,
    longestStreak,
    weeklyRate: period === 'month' ? rate : rate,
    monthlyRate: rate,
    daily,
  })
})

export default router
