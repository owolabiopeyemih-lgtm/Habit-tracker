import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { Habit, HabitWithStreak } from '../types'

export function useHabits() {
  return useQuery<HabitWithStreak[]>({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data } = await api.get('/habits')
      return data
    },
  })
}

export function useCreateHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Habit>) => api.post('/habits', payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  })
}

export function useUpdateHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Habit> & { id: string }) =>
      api.put(`/habits/${id}`, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  })
}

export function useDeleteHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/habits/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] })
      qc.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}
