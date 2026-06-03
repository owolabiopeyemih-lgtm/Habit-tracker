import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { ProgressStats } from '../types'

export function useProgress(period: 'week' | 'month' = 'week', habitId?: string) {
  return useQuery<ProgressStats>({
    queryKey: ['progress', period, habitId],
    queryFn: async () => {
      const params: Record<string, string> = { period }
      if (habitId) params.habitId = habitId
      const { data } = await api.get('/progress', { params })
      return data
    },
  })
}
