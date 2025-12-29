// src/api/profile.api.ts
import type { ProfilePayload } from '../@types/types'
import api from './api'



// جلب بروفايل حسب id (موجود حالياً)
export async function getProfileById(id: number): Promise<ProfilePayload> {
  const res = await api.get(`/profile/${id}`)
  return res.data
}

// انشاء بروفايل (FormData يسمح برفع الصور)
export async function createProfile(formData: FormData): Promise<ProfilePayload> {
  const res = await api.post('/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

// تحديث بروفايل (إذا الـ backend يستعمل PUT أو POST لنقطة مختلفة عدّل هنا)
export async function updateProfile(id: number, formData: FormData): Promise<ProfilePayload> {
  // افتراضياً: استخدام PUT إلى /profile/{id}
  const res = await api.put(`/profile/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
