"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
  onDismiss: (id: string) => void;
}

export function Toast({ 
  id, 
  title, 
  description, 
  variant = 'default', 
  onDismiss 
}: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const variantClasses = {
    default: "bg-white border border-gray-200 text-gray-900",
    destructive: "bg-red-500 text-white",
    success: "bg-green-500 text-white"
  };

  return (
    <div className={cn(
      "rounded-lg shadow-lg p-4 mb-2 transition-all duration-300",
      variantClasses[variant]
    )}>
      {title && (
        <div className="font-semibold mb-1">{title}</div>
      )}
      {description && (
        <div className="text-sm opacity-90">{description}</div>
      )}
      <button
        onClick={() => onDismiss(id)}
        className="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

interface ToasterProps {
  toasts: Array<{
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
  }>;
  onDismiss: (id: string) => void;
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}