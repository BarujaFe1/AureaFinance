"use client";

import { useEffect, useRef, type JSX } from "react";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "destructive"
}: ConfirmDialogProps): JSX.Element {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => onOpenChange(false);
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onOpenChange]);

  return (
    <dialog
      ref={ref}
      className="backdrop:bg-black/50 open:flex open:flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-xl max-w-sm w-full"
      onClick={(e) => { if (e.target === ref.current) onOpenChange(false); }}
    >
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-[var(--muted-foreground)]">{message}</div>
      <div className="flex justify-end gap-3 mt-2">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{cancelLabel}</Button>
        <Button type="button" variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </dialog>
  );
}
