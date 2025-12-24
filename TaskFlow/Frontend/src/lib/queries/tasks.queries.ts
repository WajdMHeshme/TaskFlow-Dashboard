// src/lib/queries/tasks.queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, getTasks, updateTask, type TaskPayload } from '../../api/tasks.api'

// fetch all tasks
export function useTasks() {
  return useQuery<TaskPayload[]>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: 1000 * 60, // cache 1 minute
    refetchOnWindowFocus: false,
  })
}

// create task
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name?: string | null; title: string; description?: string | null; priority?: string | null }) =>
      createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

// update task
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string | null; title: string; description?: string | null; priority?: string | null } }) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}


export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previous = queryClient.getQueryData<TaskPayload[]>(['tasks'])
      queryClient.setQueryData<TaskPayload[]>(['tasks'], old => (old ?? []).filter(t => t.id !== id))
      return { previous }
    },
    onError: (_err, _id, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['tasks'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}
