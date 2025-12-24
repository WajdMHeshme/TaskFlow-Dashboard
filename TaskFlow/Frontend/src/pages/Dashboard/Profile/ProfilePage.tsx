// src/pages/Dashboard/ProfileViewPage.tsx
import { useState, useEffect } from 'react'
import { useCurrentUser } from '../../../lib/queries/user.queries'
import { useNavigate, Link } from 'react-router-dom'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ProfileViewPage() {
  const navigate = useNavigate()
  const { data: user, isLoading, isError, error } = useCurrentUser()

  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  // resolve image candidates (tries several possible URLs)
  useEffect(() => {
    if (!user?.profile?.image) {
      setResolvedImageUrl(null)
      setImageError(null)
      return
    }

    setResolvedImageUrl(null)
    setImageError(null)

    const raw = user.profile.image
    const apiBaseEnv = (import.meta.env.VITE_API_BASE as string) || ''
    const apiHost = apiBaseEnv ? apiBaseEnv.replace(/\/api\/?$/, '') : 'http://127.0.0.1:8000'
    const cleanPath = raw.replace(/^\//, '')

    const candidates: string[] = []
    if (/^https?:\/\//i.test(raw)) candidates.push(raw)
    candidates.push(`${apiHost}/storage/${cleanPath}`)
    candidates.push(`${apiHost}/${cleanPath}`)
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

  // Page-level loading skeleton (dark theme colors)
  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#0f1720" highlightColor="#1f2937">
        <div className="flex justify-center items-start p-6 pt-24">
          <div className="w-full max-w-md">
            <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow border border-[var(--bg-side)]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Skeleton circle width={64} height={64} />
                  <div className="flex-1">
                    <Skeleton height={20} width="70%" />
                    <Skeleton height={14} width="50%" style={{ marginTop: 8 }} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton width={64} height={32} />
                  <Skeleton width={48} height={32} />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Skeleton circle width={128} height={128} />
                <div className="w-full text-center">
                  <div className="mt-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-form)] p-4 rounded-lg">
                    <Skeleton height={14} count={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    )
  }

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6 pt-24">
        <p className="text-red-400">{(error as any)?.message || 'User not found'}</p>
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
              // image is still being resolved -> show circular skeleton with dark colors
              <SkeletonTheme baseColor="#0f1720" highlightColor="#1f2937">
                <Skeleton circle width={128} height={128} />
              </SkeletonTheme>
            )}

            <div className="w-full text-center">
              <div className="mt-2 text-sm text-(--text-secondary) bg-[var(--bg-form)] p-4 rounded-lg">
                <p className="mb-1">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Registered:</span> {user.registration_date}
                </p>
                <p>
                  <span className="font-medium">Profile date:</span> {profile?.date ?? '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
