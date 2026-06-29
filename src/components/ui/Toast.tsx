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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
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

  const bgColor =
    toast.type === "success" ? "bg-green-600" :
    toast.type === "error" ? "bg-red-600" :
    "bg-primary-500";

  const icon =
    toast.type === "success" ? "✓" :
    toast.type === "error" ? "✗" :
    "ℹ";

  return (
    <div
      className={`pointer-events-auto ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium animate-[fadeInAnim_0.3s_ease-out]`}
    >
      <span className="text-base">{icon}</span>
      <span>{toast.message}</span>
      <button onClick={onDone} className="ml-2 text-white/80 hover:text-white text-lg leading-none">&times;</button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
