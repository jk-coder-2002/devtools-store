'use client';

import { useState } from 'react';

type Props = {
  customerEmail: string;
};

export function BillingPortalButton({ customerEmail }: Props) {
  const [loading, setLoading] = useState(false);

  const handleOpenPortal = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerEmail })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to create billing portal session.');
      }

      window.location.assign(payload.url);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpenPortal}
      disabled={loading}
      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-200"
    >
      {loading ? 'Opening portal…' : 'Open billing portal'}
    </button>
  );
}
