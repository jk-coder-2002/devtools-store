'use client';

import { useEffect } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error';
  onDismiss: () => void;
};

export function Toast({ message, type = 'success', onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 3500);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`fixed right-6 top-6 z-50 max-w-sm rounded-2xl border px-5 py-4 shadow-xl ${
      type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-900'
    }`}>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
