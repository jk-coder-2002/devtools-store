'use client';

import { type CustomerProfile } from '@/types';

type Props = {
  customers: CustomerProfile[];
  selectedEmail: string;
  onSelect: (email: string) => void;
};

export function CustomerSelector({ customers, selectedEmail, onSelect }: Props) {
  return (
    <label className="block w-full">
      <span className="text-sm font-medium text-slate-700">Select customer</span>
      <select
        value={selectedEmail}
        onChange={(event) => onSelect(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
      >
        {customers.map((customer) => (
          <option key={customer.email} value={customer.email}>
            {customer.name} — {customer.email}
          </option>
        ))}
      </select>
    </label>
  );
}
