import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmVariant?: "default" | "destructive" | "emerald";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  confirmVariant = "default",
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Cerrar</span>
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="py-2 text-sm text-slate-600 dark:text-slate-300">
          {children}
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              variant={confirmVariant}
              size="sm"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
