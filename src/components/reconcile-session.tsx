'use client';

import { useEffect, useState } from 'react';

type Props = {
  sessionId?: string;
};

export function ReconcileSession({ sessionId }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    async function reconcile() {
      setStatus('loading');

      try {
        const response = await fetch('/api/reconcile-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || 'Reconciliation failed.');
        }

        setMessage(payload.message || 'Purchase record created successfully.');
        setStatus('success');
      } catch (error) {
        setMessage((error as Error).message);
        setStatus('error');
      }
    }

    reconcile();
  }, [sessionId]);

  if (status === 'idle') {
    return null;
  }

  return (
    <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
      status === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
        : status === 'error'
        ? 'border-rose-200 bg-rose-50 text-rose-900'
        : 'border-slate-200 bg-slate-100 text-slate-700'
    }`}>
      <p>{status === 'loading' ? 'Syncing purchase record...' : message}</p>
    </div>
  );
}
