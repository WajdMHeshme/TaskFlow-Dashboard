// src/pages/Dashboard/TasksPage.tsx
import React, { useState } from 'react'
import type { JSX } from 'react'
import { useTasks, useDeleteTask } from '../../../lib/queries/tasks.queries'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom'
import { FiEdit } from "react-icons/fi";
import { IoTrashSharp } from "react-icons/io5";
import { TiStarOutline } from "react-icons/ti";
import ConfirmModal from '../../../components/modals/ConfirmModal'

export default function TasksPage(): JSX.Element {
  const { data: tasks, isLoading, isError, error } = useTasks()
  const navigate = useNavigate()

  const deleteMutation = useDeleteTask()
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // open confirm modal (stopPropagation to avoid card click)
  function openConfirm(e: React.MouseEvent, id: number) {
    e.stopPropagation()
    setConfirmDeleteId(id)
  }

  // perform delete
  function handleConfirmDelete() {
    const id = confirmDeleteId
    if (!id) return

    setDeletingId(id)
    deleteMutation.mutate(id, {
      onError: () => {
        // optional: show toast
        setDeletingId(null)
      },
      onSettled: () => {
        setDeletingId(null)
        setConfirmDeleteId(null)
      },
    })
  }

  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#0f1720" highlightColor="#1f2937">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--Primarylight)]">Tasks</h2>
            <Skeleton width={120} height={36} />
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 bg-[var(--bg-card)] rounded-lg shadow border border-[var(--bg-side)]">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton width={160} height={18} />
                  <Skeleton width={92} height={28} />
                </div>
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--Primarylight)]">Tasks</h2>
          <button
            onClick={() => navigate('/dashboard/tasks/create')}
            className="px-4 py-2 bg-[var(--Priamrygreen)] text-black rounded hover:brightness-95"
          >
            Add Task
          </button>
        </div>
        <div className="text-red-400">
          {(error as any)?.message ?? 'Failed to load tasks'}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--Primarylight)]">Tasks</h2>
        <button
          onClick={() => navigate('/dashboard/tasks/create')}
          className="px-4 py-2 bg-[var(--Priamrygreen)] text-black rounded hover:brightness-95"
        >
          Add Task
        </button>
      </div>

      {(!tasks || tasks.length === 0) ? (
        <div className="text-sm text-[var(--text-muted)]">No tasks found.</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {tasks.map(task => (
            <article
              key={task.id}
              className="relative group p-4 bg-[var(--bg-card)] rounded-lg shadow border border-[var(--bg-side)] overflow-hidden cursor-pointer"
              onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
            >
{/* Overlay كامل يغطي الكونتينر ويحتوي الأزرار (مركزي) */}
<div
  className="
    absolute inset-0
    bg-[rgba(0,0,0,0.45)] backdrop-blur-sm
    opacity-0 group-hover:opacity-100 transition-opacity duration-200
    flex items-center justify-center gap-3 z-10
    pointer-events-none group-hover:pointer-events-auto
  "
>
  <div className="flex gap-2">
    <button
      onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/tasks/${task.id}/edit`) }}
      className="px-3 py-1.5 text-xs  text-black rounded hover:scale-105 transition-transform cursor-pointer"
      aria-label="Edit task"
    >
      <FiEdit size={20} color='#0fe07a'/>
    </button>

    <button
      onClick={(e) => openConfirm(e, task.id)}
      className="px-3 py-1.5 text-xs  text-white rounded hover:scale-105 transition-transform cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      aria-label="Delete task"
      disabled={deletingId === task.id}
    >
      {deletingId === task.id ? (
        <IoTrashSharp size={20} className="animate-spin" color="#EF4444" />
      ) : (
        <IoTrashSharp size={20} color="#EF4444" />
      )}
    </button>

    <button
      onClick={(e) => { e.stopPropagation(); alert('Star clicked') }}
      className="px-3 py-1.5 text-xs text-black rounded hover:scale-105 transition-transform cursor-pointer"
      aria-label="Star task"
    >
      <TiStarOutline size={20} color='#FACC15'/>
    </button>
  </div>
</div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--Primarylight)]">{task.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{task.description ?? '-'}</p>
                </div>

                <div className="text-right flex flex-col items-end gap-2 z-0">
                  <div
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm"
                    style={getPriorityStyle(task.priority)}
                  >
                    {formatPriorityLabel(task.priority)}
                  </div>

                  <span className="text-xs text-[var(--text-secondary)] mt-1">
                    {formatDate(task.created_at)}
                  </span>
                </div>
              </div>
            </article>
          ))}

        </div>
      )}

      {/* ConfirmModal (reusable component) */}
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deletingId === confirmDeleteId}
        variant="danger"
        icon={<IoTrashSharp size={28} color="#fff" />}
        title="Delete Task"
        description="Are you sure you want to delete this task ?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />
    </div>
  )
}

// helpers
function formatDate(d?: string | null) {
  if (!d) return '-'
  try {
    const dt = new Date(d)
    return dt.toLocaleString()
  } catch {
    return d
  }
}

function formatPriorityLabel(priority?: string | null) {
  const p = (priority ?? 'normal').toLowerCase()
  return p.charAt(0).toUpperCase() + p.slice(1)
}

function getPriorityStyle(priority?: string | null): React.CSSProperties {
  const p = (priority ?? '').toLowerCase()
  switch (p) {
    case 'high':
      return { backgroundColor: 'var(--Priamrygreen)', color: 'black' }
    case 'medium':
      return { backgroundColor: 'var(--Primarylight)', color: 'black' }
    case 'low':
      return { backgroundColor: 'var(--green-dark)', color: 'white' }
    default:
      return { backgroundColor: 'var(--bg-side)', color: 'white' }
  }
}
