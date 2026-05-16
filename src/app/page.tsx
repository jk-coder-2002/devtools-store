'use client';

import { useMemo, useState } from 'react';
import { PRODUCTS, CUSTOMER_PROFILES, appName } from '@/utils/constants';
import { type CustomerProfile, type ProductMode } from '@/types';
import { ProductCard } from '@/components/product-card';
import { Toast } from '@/components/toast';

const defaultCustomer = CUSTOMER_PROFILES[0];

type ToastState = {
  message: string;
  type: 'success' | 'error';
} | null;

export default function HomePage() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(defaultCustomer);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const customerName = selectedCustomer.name;
  const customerEmail = selectedCustomer.email;

  const handleCheckout = async (productId: string, mode: ProductMode) => {
    setBusyProductId(productId);
    setToast(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, customerName, customerEmail, mode })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to create checkout session.');
      }

      window.location.assign(payload.url);
    } catch (error) {
      setToast({ message: (error as Error).message, type: 'error' });
    } finally {
      setBusyProductId(null);
    }
  };

  const offerCards = useMemo(
    () => PRODUCTS.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        customers={[...CUSTOMER_PROFILES]}
        selectedCustomerEmail={selectedCustomer.email}
        busy={busyProductId === product.id}
        onCustomerChange={(email) => setSelectedCustomer(CUSTOMER_PROFILES.find((item) => item.email === email) ?? defaultCustomer)}
        onCheckout={handleCheckout}
      />
    )),
    [busyProductId, selectedCustomer.email]
  );

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-card">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">DevTools Store</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Build, ship, and scale faster.</h1>
            <p className="mt-6 text-base leading-8 text-slate-600">
              Shop one-time developer tools or subscribe to managed plans. Checkout is powered by Stripe with a robust webhook integration and admin insights.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">{offerCards}</section>

        <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-card md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Why choose DevTools Store?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Every purchase and subscription is logged server-side with Stripe metadata, customer tracking, and safe event handling.
            </p>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-3xl bg-slate-900/90 p-5">
              <p className="font-medium text-slate-100">Secure webhook processing</p>
              <p className="mt-2 text-slate-400">Stripe signatures are verified and duplicate events are blocked automatically.</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-5">
              <p className="font-medium text-slate-100">Customer-first checkout</p>
              <p className="mt-2 text-slate-400">Select Alice or Bob and attach them to every checkout session.</p>
            </div>
          </div>
        </section>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </main>
  );
}
