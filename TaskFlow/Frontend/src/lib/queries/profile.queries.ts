import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProfileById,
  createProfile,
  updateProfile,
} from '../../api/profile.api'

// 🔹 get profile
export function useProfile(id: number) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileById(id),
    enabled: !!id,
  })
}

// 🔹 create
export function useCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

// 🔹 update
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateProfile(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
