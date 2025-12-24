// src/components/ConfirmModal.tsx
import React, { useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "danger" | "primary" | "neutral";
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد",
  description,
  icon,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  loading = false,
  variant = "danger",
}: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  // close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // focus confirm button on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => confirmRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmClasses =
    variant === "danger"
      ? "bg-[#EF4444] hover:brightness-95 text-white"
      : variant === "primary"
      ? "bg-[var(--Priamrygreen)] hover:brightness-95 text-black"
      : "bg-[var(--Primarylight)] hover:brightness-95 text-black";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      onClick={(e) => {
        // close when clicking backdrop
        if (e.target === overlayRef.current) onClose();
      }}
      ref={overlayRef}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg mx-4 bg-[var(--bg-card)] rounded-2xl shadow-2xl p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/6 to-white/3 border border-white/6">
            {icon ?? null}
          </div>
        </div>

        {/* Title + Description */}
        <div className="mt-4 text-center">
          <h3 id="confirm-modal-title" className="text-lg font-semibold text-[var(--Primarylight)]">
            {title}
          </h3>

          {description && (
            <p id="confirm-modal-desc" className="mt-2 text-sm text-[var(--text-muted)]">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-transparent border border-[var(--bg-side)] text-sm hover:brightness-95"
            disabled={loading}
          >
            {cancelLabel}
          </button>

          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-sm ${confirmClasses} disabled:opacity-60 disabled:cursor-not-allowed`}
            disabled={loading}
          >
            {loading ? "...جاري المعالجة" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
