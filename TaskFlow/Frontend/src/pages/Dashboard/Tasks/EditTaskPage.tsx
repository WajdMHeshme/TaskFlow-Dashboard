// src/pages/Dashboard/EditTaskPage.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTasks } from '../../../lib/queries/tasks.queries'
import { updateTask } from '../../../api/tasks.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showError, showSuccess } from '../../../utils/toast/toastUtils/toastUtils'

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // جلب كل التاسكات محلياً للعثور على التاسك الحالي
  const { data: tasks } = useTasks()
  const taskToEdit = tasks?.find(t => t.id === Number(id))

  const [name, setName] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low')

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.user_id?.toString() ?? '')
      setTitle(taskToEdit.title)
      setDescription(taskToEdit.description ?? '')
      setPriority((taskToEdit.priority as 'low' | 'medium' | 'high') ?? 'low')
    }
  }, [taskToEdit])

  const updateMutation = useMutation({
    mutationFn: (payload: { name?: string; title: string; description?: string; priority?: string }) =>
      updateTask(Number(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      showSuccess ? showSuccess('Task updated') : alert('Task updated')
      navigate('/dashboard/tasks')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to update task'
      showError ? showError(msg) : alert(msg)
    },
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      showError ? showError('Title is required') : alert('Title is required')
      return
    }

    updateMutation.mutate({
      name: name ? name.trim() : undefined,
      title: title.trim(),
      description: description ? description.trim() : undefined,
      priority,
    })
  }

  const isSaving = updateMutation.isLoading

  if (!taskToEdit) return <div className="p-6 text-(--text-muted)">Task not found</div>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-(--Primarylight)">Edit Task</h2>

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
            {isSaving ? 'Saving...' : 'Update Task'}
          </button>
        </div>
      </form>
    </div>
  )
}
