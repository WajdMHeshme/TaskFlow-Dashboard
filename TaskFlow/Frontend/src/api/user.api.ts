// src/api/user.api.ts
import api from './api'

export type ProfilePayload = {
  id: number
  name?: string | null
  bio?: string | null
  info?: string | null
  image?: string | null
  date?: string | null
}

export type CurrentUserPayload = {
  id: number
  name: string
  email: string
  registration_date?: string
  profile?: ProfilePayload | null
}

/**
 * Get the current authenticated user.
 * This function normalizes different axios response shapes:
 * - axios returns: res.data.data  (common)
 * - or res.data
 * - or the API helper might already return the payload
 */
export async function getCurrentUser(): Promise<CurrentUserPayload> {
  const res = await api.get('/user')
  // Normalize response: try res.data.data -> res.data -> res
  const payload = (res && (res.data?.data ?? res.data)) ? (res.data?.data ?? res.data) : res
  // if payload itself wraps another { data: {...} }, unwrap one more time
  const final = (payload && (payload.data ?? payload)) ? (payload.data ?? payload) : payload

  // final should now be the user object
  return final as CurrentUserPayload
}

/**
 * Convenience: fetch the current user and cache into localStorage (useful after login)
 */
export async function fetchAndCacheCurrentUser(): Promise<CurrentUserPayload> {
  const user = await getCurrentUser()
  try {
    localStorage.setItem('user', JSON.stringify(user))
  } catch {
    // ignore storage errors
  }
  return user
}
