// src/pages/Dashboard/TasksPage.tsx
import React, { useState } from "react";
import type { JSX } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTasks,
  useDeleteTask,
  useToggleFavorite,
} from "../../../lib/queries/tasks.queries";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { IoTrashSharp } from "react-icons/io5";
import { TiStarOutline, TiStarFullOutline } from "react-icons/ti";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import type { TaskPayload } from "../../../api/tasks.api";

export default function TasksPage(): JSX.Element {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useDeleteTask();
  const toggleFavorite = useToggleFavorite();

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null); // prevent double clicks

  // open confirm modal (stopPropagation to avoid card click)
  function openConfirm(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    setConfirmDeleteId(id);
  }

  // perform delete
  function handleConfirmDelete() {
    const id = confirmDeleteId;
    if (!id) return;

    setDeletingId(id);
    deleteMutation.mutate(id, {
      onError: () => {
        // optional: show toast
        setDeletingId(null);
      },
      onSettled: () => {
        setDeletingId(null);
        setConfirmDeleteId(null);
      },
    });
  }

  // add to favorites on click (only set to true, don't toggle back here)
  function handleAddToFavorite(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    // find task from cache to check current state
    const currentTasks = queryClient.getQueryData<TaskPayload[]>(["tasks"]) ?? [];
    const task = currentTasks.find((t) => t.id === id);
    if (!task) return;

    if (task.is_favorite) {
      // already favorite — do nothing
      return;
    }

    if (togglingId === id) return; // already sending

    // snapshots for rollback
    const previousTasks = queryClient.getQueryData<TaskPayload[]>(["tasks"]);
    const previousFavoriteTasks = queryClient.getQueryData<TaskPayload[]>(["favoriteTasks"]);

    // optimistic: set is_favorite = true (do NOT touch favorites_count)
    queryClient.cancelQueries({ queryKey: ["tasks"] });
    queryClient.cancelQueries({ queryKey: ["favoriteTasks"] });

    queryClient.setQueryData<TaskPayload[]>(["tasks"], (old) =>
      (old ?? []).map((t) => (t.id === id ? { ...t, is_favorite: true } : t))
    );

    // add to favoriteTasks list (best-effort)
    queryClient.setQueryData<TaskPayload[]>(["favoriteTasks"], (old) => {
      const cur = old ?? [];
      const exists = cur.some((t) => t.id === id);
      if (exists) return cur;
      const fromTasks = previousTasks?.find((t) => t.id === id);
      if (fromTasks) return [{ ...fromTasks, is_favorite: true }, ...cur];
      return cur;
    });

    setTogglingId(id);

    // call API (toggle endpoint) — we treat it as "add to favorite" here
    toggleFavorite.mutate(id, {
      onError: () => {
        // rollback on error
        if (previousTasks) queryClient.setQueryData(["tasks"], previousTasks);
        if (previousFavoriteTasks) queryClient.setQueryData(["favoriteTasks"], previousFavoriteTasks);
        setTogglingId(null);
        // optional: show toast about failure
      },
      onSuccess: (data) => {
        // server canonical may return is_favorite; if it does and is true we keep it.
        // if server returned is_favorite === false (unexpected), we rollback to previous to stay consistent.
        const taskId: number = data?.task_id ?? data?.id;
        const isFav: boolean | undefined = typeof data?.is_favorite === "boolean" ? data.is_favorite : undefined;

        if (typeof isFav === "boolean") {
          if (!isFav) {
            // server says not favorited -> rollback
            if (previousTasks) queryClient.setQueryData(["tasks"], previousTasks);
            if (previousFavoriteTasks) queryClient.setQueryData(["favoriteTasks"], previousFavoriteTasks);
          } else {
            // ensure task marked favorite in cache (we already did optimistic, but confirm)
            queryClient.setQueryData<TaskPayload[]>(["tasks"], (old) =>
              (old ?? []).map((t) => (t.id === taskId ? { ...t, is_favorite: true } : t))
            );
          }
        }
      },
      onSettled: () => {
        setTogglingId(null);
        // do NOT invalidate queries here to avoid flipping UI; leave data as set (server canonical handled in onSuccess)
      },
    });
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
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--Primarylight)]">Tasks</h2>
          <button onClick={() => navigate("/dashboard/tasks/create")} className="px-4 py-2 bg-[var(--Priamrygreen)] text-black rounded hover:brightness-95">
            Add Task
          </button>
        </div>
        <div className="text-red-400">{(error as any)?.message ?? "Failed to load tasks"}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--Primarylight)]">Tasks</h2>
        <button onClick={() => navigate("/dashboard/tasks/create")} className="px-4 py-2 bg-[var(--Priamrygreen)] text-black rounded hover:brightness-95">
          Add Task
        </button>
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="text-sm text-[var(--text-muted)]">No tasks found.</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {tasks.map((task) => (
            <article key={task.id} className="relative group p-4 bg-[var(--bg-card)] rounded-lg shadow border border-[var(--bg-side)] overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.45)] backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-10 pointer-events-none group-hover:pointer-events-auto">
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/tasks/${task.id}/edit`) }} className="px-3 py-1.5 text-xs  text-black rounded hover:scale-105 transition-transform cursor-pointer" aria-label="Edit task">
                    <FiEdit size={20} color="#0fe07a" />
                  </button>

                  <button onClick={(e) => openConfirm(e, task.id)} className="px-3 py-1.5 text-xs  text-white rounded hover:scale-105 transition-transform cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" aria-label="Delete task" disabled={deletingId === task.id}>
                    {deletingId === task.id ? <IoTrashSharp size={20} className="animate-spin" color="#EF4444" /> : <IoTrashSharp size={20} color="#EF4444" />}
                  </button>

                  <button onClick={(e) => handleAddToFavorite(e, task.id)} className="px-3 py-1.5 text-xs text-black rounded hover:scale-105 transition-transform cursor-pointer flex items-center" aria-label="Add to favorites" disabled={togglingId === task.id}>
                    {/* show filled star immediately when favorited; no counter */}
                    {task.is_favorite ? <TiStarFullOutline size={20} color="#FACC15" /> : <TiStarOutline size={20} color="#FACC15" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--Primarylight)]">{task.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{task.description ?? "-"}</p>
                </div>

                <div className="text-right flex flex-col items-end gap-2 z-0">
                  <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm" style={getPriorityStyle(task.priority)}>
                    {formatPriorityLabel(task.priority)}
                  </div>

                  <span className="text-xs text-[var(--text-secondary)] mt-1">{formatDate(task.created_at)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal isOpen={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} onConfirm={handleConfirmDelete} loading={deletingId === confirmDeleteId} variant="danger" icon={<IoTrashSharp size={28} color="#fff" />} title="Delete Task" description="Are you sure you want to delete this task ?" confirmLabel="Confirm" cancelLabel="Cancel" />
    </div>
  );
}

// helpers
function formatDate(d?: string | null) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    return dt.toLocaleString();
  } catch {
    return d;
  }
}

function formatPriorityLabel(priority?: string | null) {
  const p = (priority ?? "normal").toLowerCase();
  return p.charAt(0).toUpperCase() + p.slice(1);
}

function getPriorityStyle(priority?: string | null): React.CSSProperties {
  const p = (priority ?? "").toLowerCase();
  switch (p) {
    case "high":
      return { backgroundColor: "var(--Priamrygreen)", color: "black" };
    case "medium":
      return { backgroundColor: "var(--Primarylight)", color: "black" };
    case "low":
      return { backgroundColor: "var(--green-dark)", color: "white" };
    default:
      return { backgroundColor: "var(--bg-side)", color: "white" };
  }
}
