'use client';

import { type ProductConfig } from '@/types';
import { CustomerSelector } from '@/components/customer-selector';
import { type CustomerProfile } from '@/types';

type Props = {
  product: ProductConfig;
  customers: CustomerProfile[];
  selectedCustomerEmail: string;
  busy: boolean;
  onCustomerChange: (email: string) => void;
  onCheckout: (productId: string, mode: 'payment' | 'subscription') => void;
};

export function ProductCard({
  product,
  customers,
  selectedCustomerEmail,
  busy,
  onCustomerChange,
  onCheckout
}: Props) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{product.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{product.description}</p>
        </div>
        <span className="rounded-2xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
          {product.priceLabel}
        </span>
      </div>
      <div className="space-y-4">
        <CustomerSelector
          customers={customers}
          selectedEmail={selectedCustomerEmail}
          onSelect={onCustomerChange}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => onCheckout(product.id, product.mode)}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {busy ? 'Processing...' : product.actionLabel}
        </button>
      </div>
    </div>
  );
}
