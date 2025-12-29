// src/api/tasks.api.ts
import type {  TaskPayload } from '../@types/types'
import api from './api'


// جلب كل التاسكات
export async function getTasks(): Promise<TaskPayload[]> {
  const res = await api.get('/tasks')
  return res.data
}

// إنشاء تاسك
export async function createTask(payload: {
  name?: string | null
  title: string
  description?: string | null
  priority?: 'low' | 'medium' | 'high' | null
}): Promise<TaskPayload> {
  const res = await api.post('/tasks', payload)
  return res.data
}

// تعديل تاسك
export async function updateTask(
  id: number,
  payload: {
    name?: string | null
    title: string
    description?: string | null
    priority?: 'low' | 'medium' | 'high' | null
  }
): Promise<TaskPayload> {
  const res = await api.put(`/tasks/${id}`, payload)
  return res.data
}


// حذف تاسك
export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`)
}


//Add To Favorites
export const toggleFavorite = async (taskId: number) => {
  const res = await api.post(`/task/${taskId}/favorite`);
  return res.data; // { task_id, is_favorite, favorites_count }
};

export const removeFavorite = async (taskId: number) => {
  const res = await api.delete(`/task/${taskId}/favorite`);
  return res.data; 
}

export const getFavoriteTasks = async (): Promise<TaskPayload[]> => {
  const res = await api.get('/favorites')
  return (res.data?.favorite_tasks ?? []) as TaskPayload[]
}