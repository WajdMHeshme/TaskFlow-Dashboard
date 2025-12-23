// src/pages/Dashboard/ProfileViewPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getCurrentUser } from '../../api/user.api'

type UserProfile = {
  id: number
  name: string
  email: string
  registration_date: string
  profile?: {
    id: number
    name: string
    bio: string
    image?: string
    date?: string
  }
}

export default function ProfileViewPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // state for the resolved (working) image URL
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      setLoading(true)
      try {
        const res = await getCurrentUser()
        const payload = res && (res.data ?? res) ? (res.data ?? res) : res
        const final = payload?.data ?? payload
        if (!final) throw new Error('Empty user payload')
        setUser(final)
      } catch (err: any) {
        console.error('Failed to load current user:', err)
        setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load user')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

// داخل الملف ProfileViewPage.tsx — تحديث useEffect الذي يحلّل رابط الصورة
useEffect(() => {
  if (!user?.profile?.image) {
    setResolvedImageUrl(null)
    return
  }

  setResolvedImageUrl(null)
  setImageError(null)

  const raw = user.profile.image // e.g. "photos/xxx.webp"
  const apiBaseEnv = (import.meta.env.VITE_API_BASE as string) || ''
  // ensure absolute API host like "http://127.0.0.1:8000"
  const apiHost = apiBaseEnv ? apiBaseEnv.replace(/\/api\/?$/, '') : 'http://127.0.0.1:8000'

  const cleanPath = raw.replace(/^\//, '') // remove leading slash if any

  const candidates: string[] = []
  // if server already returned full http(s) URL
  if (/^https?:\/\//i.test(raw)) candidates.push(raw)

  // Try the common working URL you reported (storage)
  candidates.push(`${apiHost}/storage/${cleanPath}`)
  // Try photos directly (if served from public/photos)
  candidates.push(`${apiHost}/${cleanPath}`)
  // Fallback absolute root (in case)
  candidates.push(`/${cleanPath}`)

  let cancelled = false
  let tried = 0

  function tryNext() {
    if (cancelled) return
    if (tried >= candidates.length) {
      setImageError('Unable to load image (checked multiple URLs). Open Network tab to inspect response.')
      return
    }
    const url = candidates[tried++]
    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      setResolvedImageUrl(url)
    }
    img.onerror = () => {
      tryNext()
    }
    img.src = url
  }

  tryNext()

  return () => {
    cancelled = true
  }
}, [user?.profile?.image])


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6 pt-24">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6 pt-24">
        <p className="text-red-400">{error || 'User not found'}</p>
      </div>
    )
  }

  const profile = user.profile

  return (
    <div className="flex justify-center items-start p-6 pt-24">
      <div className="w-full max-w-md">
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow border border-[var(--bg-side)]">
          <div className="flex items-start justify-between mb-4">
            <div className="text-left">
              <h2 className="text-xl font-semibold text-[var(--Primarylight)]">
                {profile?.name || user.name}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">{profile?.bio || '-'}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/dashboard/profile/create"
                className="text-sm px-3 py-1 rounded-md border border-[var(--Priamrygreen)] text-[var(--Priamrygreen)] hover:bg-[var(--Priamrygreen)] hover:text-[var(--bg-dark)] transition"
              >
                Edit
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--Primarylight)]"
              >
                Back
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            {/* image or fallback */}
            {resolvedImageUrl ? (
              <img
                src={resolvedImageUrl}
                alt={profile?.name ?? 'avatar'}
                className="w-32 h-32 rounded-full object-cover border-4 border-[var(--Priamrygreen)]"
              />
            ) : imageError ? (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--avatar-1)] to-[var(--avatar-6)] flex items-center justify-center text-[var(--bg-dark)] font-semibold text-xs text-center p-2">
                Avatar
                <div className="text-xs text-red-400 mt-2">{imageError}</div>
                <a
                  className="text-[var(--Priamrygreen)] block mt-2 underline text-xs"
                  href={`${import.meta.env.VITE_API_BASE?.replace('/api','')}/${(profile?.image||'').replace(/^\//,'')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open attempted URL
                </a>
              </div>
            ) : (
              // still trying candidates
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--avatar-1)] to-[var(--avatar-6)] flex items-center justify-center text-[var(--bg-dark)] font-semibold">
                Loading image...
              </div>
            )}

            <div className="w-full text-center">
              <div className="mt-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-form)] p-4 rounded-lg">
                <p className="mb-1"><span className="font-medium">Email:</span> {user.email}</p>
                <p className="mb-1"><span className="font-medium">Registered:</span> {user.registration_date}</p>
                <p><span className="font-medium">Profile date:</span> {profile?.date ?? '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
