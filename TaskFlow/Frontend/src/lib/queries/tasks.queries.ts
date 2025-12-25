// src/lib/queries/tasks.queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  toggleFavorite as toggleFavoriteApi, 
  type TaskPayload,
  getFavoriteTasks,
  removeFavorite
} from '../../api/tasks.api'
import toast from 'react-hot-toast'

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

// delete task
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previous = queryClient.getQueryData<TaskPayload[]>(['tasks'])
      queryClient.setQueryData<TaskPayload[]>(['tasks'], old =>
        (old ?? []).filter(t => t.id !== id)
      )
      return { previous }
    },
    onError: (_err: any, _id, context: any) => {
      // rollback
      if (context?.previous) {
        queryClient.setQueryData(['tasks'], context.previous)
      }

      // رسالة خطأ مفهومة
      toast.error("Cannot delete this task because it is added to favorites.")
    },
    onSuccess: () => {
      // رسالة نجاح
      toast.success("Task deleted successfully.")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}
// --------------------------------------
// toggle favorite
// --------------------------------------
export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => toggleFavoriteApi(id), // هذه الدالة من api/tasks.api.ts
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previous = queryClient.getQueryData<TaskPayload[]>(['tasks'])

      queryClient.setQueryData<TaskPayload[]>(['tasks'], old =>
        (old ?? []).map(task =>
          task.id === id
            ? {
                ...task,
                is_favorite: !task.is_favorite,
                favorites_count: (task.favorites_count ?? 0) + (task.is_favorite ? -1 : 1),
              }
            : task
        )
      )

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

// favorite tasks hook
export function useFavoriteTasks() {
  return useQuery<TaskPayload[]>({
    queryKey: ['favoriteTasks'],
    queryFn: getFavoriteTasks,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })
}


// remove favorite hook
export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => removeFavorite(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['favoriteTasks'] })
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      const previousFavorites = queryClient.getQueryData<TaskPayload[]>(['favoriteTasks'])
      const previousTasks = queryClient.getQueryData<TaskPayload[]>(['tasks'])

      // optimistic: remove from favoriteTasks
      queryClient.setQueryData<TaskPayload[]>(['favoriteTasks'], old => (old ?? []).filter(t => t.id !== id))

      // optimistic: set is_favorite = false in tasks list if present
      if (previousTasks) {
        queryClient.setQueryData<TaskPayload[]>(['tasks'], old =>
          (old ?? []).map(t => (t.id === id ? { ...t, is_favorite: false } : t))
        )
      }

      return { previousFavorites, previousTasks }
    },

    onError: (err: any, _id, context: any) => {
      // rollback
      if (context?.previousFavorites) queryClient.setQueryData(['favoriteTasks'], context.previousFavorites)
      if (context?.previousTasks) queryClient.setQueryData(['tasks'], context.previousTasks)

      const message = err?.response?.data?.message ?? 'Failed to remove from favorites'
      toast.error(message)
    },

    onSuccess: () => {
      toast.success('Removed from favorites')
      // optionally use server data to patch caches (data may contain task_id / message)
      // invalidate minimal keys to keep others consistent
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['favoriteTasks'] })
    },

    // no further onSettled required (we already invalidated onSuccess)
  })
}
