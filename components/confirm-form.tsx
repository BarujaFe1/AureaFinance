"use client";

import { useRef, useState, type JSX, type ReactNode } from "react";
import { ConfirmDialog } from "./confirm-dialog";

interface ConfirmFormProps {
  action: string | ((formData: FormData) => void);
  children: ReactNode;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
}

export function ConfirmForm({
  action,
  children,
  title = "Confirmar ação",
  message,
  confirmLabel = "Sim, excluir",
  cancelLabel = "Cancelar",
  variant = "destructive"
}: ConfirmFormProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const skipNextSubmit = useRef(false);

  return (
    <>
      <form
        ref={formRef}
        action={action}
        onSubmit={(e) => {
          if (skipNextSubmit.current) {
            skipNextSubmit.current = false;
            return;
          }
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </form>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          skipNextSubmit.current = true;
          setOpen(false);
          formRef.current?.requestSubmit();
        }}
        title={title}
        message={message}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        variant={variant}
      />
    </>
  );
}
