import { subDays, format, eachDayOfInterval, parseISO, startOfDay, isToday, isYesterday } from 'date-fns'

export function computeStreak(dates: string[]): number {
  if (!dates.length) return 0
  const sorted = [...new Set(dates)].sort().reverse()
  const first = parseISO(sorted[0])

  if (!isToday(first) && !isYesterday(first)) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const curr = parseISO(sorted[i])
    const prev = parseISO(sorted[i - 1])
    const diff = Math.round((startOfDay(prev).getTime() - startOfDay(curr).getTime()) / 86400000)
    if (diff === 1) streak++
    else break
  }
  return streak
}

export function computeLongestStreak(dates: string[]): number {
  if (!dates.length) return 0
  const sorted = [...new Set(dates)].sort()
  let longest = 1
  let current = 1
  for (let i = 1; i < sorted.length; i++) {
    const curr = parseISO(sorted[i])
    const prev = parseISO(sorted[i - 1])
    const diff = Math.round((startOfDay(curr).getTime() - startOfDay(prev).getTime()) / 86400000)
    if (diff === 1) { current++; longest = Math.max(longest, current) }
    else current = 1
  }
  return longest
}

export function getDailyProgress(
  habitIds: string[],
  checkIns: Array<{ habitId: string; date: string }>,
  days: number,
): Array<{ date: string; total: number; completed: number }> {
  const end = new Date()
  const start = subDays(end, days - 1)
  const interval = eachDayOfInterval({ start, end })

  return interval.map((d) => {
    const dateStr = format(d, 'yyyy-MM-dd')
    const completed = checkIns.filter((c) => c.date === dateStr).length
    return { date: dateStr, total: habitIds.length, completed }
  })
}
