// src/pages/Dashboard/CreateTaskPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateTask } from '../../../lib/queries/tasks.queries'
import { showSuccess, showError } from '../../../utils/toast/toastUtils/toastUtils' // إذا عندك toasts؛ وإلا استخدم alert

export default function CreateTaskPage() {
  const navigate = useNavigate()
  const createTaskMutation = useCreateTask()

  const [name, setName] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low')

  function resetForm() {
    setName('')
    setTitle('')
    setDescription('')
    setPriority('low')
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      showError ? showError('Title is required') : alert('Title is required')
      return
    }

    const payload = {
      name: name ? name.trim() : undefined,
      title: title.trim(),
      description: description ? description.trim() : undefined,
      priority,
    }

    createTaskMutation.mutate(payload, {
      onSuccess: () => {
        showSuccess ? showSuccess('Task created') : alert('Task created')
        resetForm()
        // navigate to tasks list (adjust route if different)
        navigate('/dashboard/tasks')
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to create task'
        showError ? showError(msg) : alert(msg)
      },
    })
  }

  const isSaving = createTaskMutation.isLoading

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-(--Primarylight)">Create Task</h2>

      <form onSubmit={onSubmit} className="space-y-4 bg-(--bg-card) p-6 rounded-lg shadow border border-(--bg-side)">
        <label className="block">
          <span className="text-sm text-(--text-muted)">Name (optional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name or assignee"
            className="mt-1 w-full p-2 rounded bg-(--bg-dark) text-white border border-(--bg-side)"
          />
        </label>

        <label className="block">
          <span className="text-sm text-(--text-muted)">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
            className="mt-1 w-full p-2 rounded bg-(--bg-dark) text-white border border-(--bg-side)"
          />
        </label>

        <label className="block">
          <span className="text-sm text-(--text-muted)">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Task description"
            className="mt-1 w-full p-2 rounded bg-(--bg-dark) text-white border border-(--bg-side)"
          />
        </label>

        <label className="block">
          <span className="text-sm text-(--text-muted)">Priority</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="mt-1 w-full p-2 rounded bg-(--bg-dark) text-white border border-(--bg-side)"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded bg-transparent border border-(--bg-side) text-(--text-muted)"
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 rounded bg-(--Priamrygreen) text-black font-semibold hover:brightness-95 disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}
