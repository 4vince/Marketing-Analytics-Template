"use client";
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  const config = {
    success: { bg: "bg-emerald-600/90 border-emerald-500/40", icon: "✓" },
    error: { bg: "bg-primary-600/90 border-primary-500/40", icon: "✗" },
    info: { bg: "bg-brand-risen border-brand-fence", icon: "ℹ" },
  };

  const { bg, icon } = config[toast.type];

  return (
    <div
      className={`
        pointer-events-auto ${bg} backdrop-blur-sm text-brand-warm-white
        px-5 py-3 rounded-xl shadow-xl border
        flex items-center gap-3 text-sm font-medium
        animate-slide-up
      `}
    >
      <span className="text-base flex-shrink-0">{icon}</span>
      <span>{toast.message}</span>
      <button
        onClick={onDone}
        className="ml-2 text-brand-muted hover:text-brand-warm-white text-lg leading-none transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
