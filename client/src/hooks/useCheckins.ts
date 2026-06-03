import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { format } from 'date-fns'

export function useToggleCheckin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      const date = format(new Date(), 'yyyy-MM-dd')
      if (completed) {
        return api.delete(`/checkins/${habitId}/${date}`).then((r) => r.data)
      }
      return api.post('/checkins', { habitId, date }).then((r) => r.data)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] })
      qc.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}
