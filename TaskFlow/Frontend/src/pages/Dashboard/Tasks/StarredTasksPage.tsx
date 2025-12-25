// src/pages/Dashboard/StarredTasksPage.tsx
import React, { useState } from 'react'
import type { JSX } from 'react'
import { useFavoriteTasks, useRemoveFavorite } from '../../../lib/queries/tasks.queries'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom'
import { TiStarFullOutline  } from 'react-icons/ti'
import { FiExternalLink } from 'react-icons/fi'

export default function StarredTasksPage(): JSX.Element {
  const { data: tasks, isLoading, isError, error } = useFavoriteTasks()
  const removeFavorite = useRemoveFavorite()
  const navigate = useNavigate()
  const [removingId, setRemovingId] = useState<number | null>(null)

  function handleRemove(e: React.MouseEvent, id: number) {
    e.stopPropagation()
    if (removingId === id) return
    setRemovingId(id)
    removeFavorite.mutate(id, {
      onSettled: () => setRemovingId(null),
    })
  }

  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#0f1720" highlightColor="#1f2937">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--Primarylight)] mb-4">Starred Tasks</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 bg-[var(--bg-card)] rounded-lg shadow border border-[var(--bg-side)]">
                <Skeleton width={160} height={18} />
                <Skeleton height={12} count={2} />
              </div>
            ))}
          </div>
        </div>
      </SkeletonTheme>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-[var(--Primarylight)] mb-4">Starred Tasks</h2>
        <div className="text-red-400">{(error as any)?.message ?? 'Failed to load favorite tasks'}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--Primarylight)]">Starred Tasks</h2>
      </div>

      {(!tasks || tasks.length === 0) ? (
        <div className="text-sm text-[var(--text-muted)]">No favorite tasks found.</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {tasks.map(task => (
            <article
              key={task.id}
              className="relative p-4 bg-[var(--bg-card)] rounded-lg shadow border border-[var(--bg-side)] cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--Primarylight)]">{task.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{task.description ?? '-'}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={(e) => handleRemove(e, task.id)}
                    className="inline-flex items-center gap-2 px-2 py-1 rounded hover:brightness-95 transition"
                    aria-label="Remove favorite"
                    disabled={removingId === task.id}
                  >
                    {removingId === task.id ? (
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2"></circle>
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
                      </svg>
                    ) : (
                      <TiStarFullOutline  size={20} color="#FACC15" />
                    )}
                    <span className="text-sm text-[var(--text-secondary)]">Remove</span>
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation() }}
                    className="mt-1 inline-flex items-center gap-2 px-2 py-1 rounded text-xs text-[var(--text-secondary)]"
                  >
                    <FiExternalLink size={14} /> View
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
