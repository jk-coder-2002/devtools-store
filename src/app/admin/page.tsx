import { BillingPortalButton } from '@/components/billing-portal-button';
import { listCustomers } from '@/services/customerService';
import { listPurchases } from '@/services/purchaseService';
import { listSubscriptions } from '@/services/subscriptionService';

const formatDate = (value?: string | Date | null) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default async function AdminPage() {
  let customers: any[] = [];
  let purchases: any[] = [];
  let subscriptions: any[] = [];
  let errorMessage: string | null = null;

  try {
    [customers, purchases, subscriptions] = await Promise.all([listCustomers(), listPurchases(), listSubscriptions()]);
  } catch (error) {
    console.error(error);
    errorMessage = 'Unable to load admin data. Please verify the database connection.';
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Admin Console</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Store operations and subscriber insights</h1>
            </div>
            <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Overview</p>
              <p className="mt-2 text-2xl font-semibold">{customers.length}</p>
              <p className="text-sm text-slate-400">Customers managed</p>
            </div>
          </div>
        </header>

        {errorMessage && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
            {errorMessage}
          </div>
        )}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-slate-900">Customers</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 font-medium text-slate-900">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-900">Email</th>
                  <th className="px-4 py-3 font-medium text-slate-900">Stripe customer</th>
                  <th className="px-4 py-3 font-medium text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="px-4 py-4 text-slate-700">{customer.name}</td>
                    <td className="px-4 py-4 text-slate-700">{customer.email}</td>
                    <td className="px-4 py-4 text-slate-700">{customer.stripeCustomerId}</td>
                    <td className="px-4 py-4">
                      <BillingPortalButton customerEmail={customer.email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">One-time purchases</h2>
            <p className="text-sm text-slate-500">Latest completed purchase records.</p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <div className="max-h-[28rem] overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 font-medium text-slate-900">Customer</th>
                    <th className="px-4 py-3 font-medium text-slate-900">Product</th>
                    <th className="px-4 py-3 font-medium text-slate-900">Amount</th>
                    <th className="px-4 py-3 font-medium text-slate-900">Status</th>
                    <th className="px-4 py-3 font-medium text-slate-900">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {purchases.map((purchase) => (
                  <tr key={purchase._id}>
                    <td className="px-4 py-4 text-slate-700">{(purchase.customerId as any)?.email ?? 'Unknown'}</td>
                    <td className="px-4 py-4 text-slate-700">{purchase.productName}</td>
                    <td className="px-4 py-4 text-slate-700">{(purchase.amount / 100).toFixed(2)} {purchase.currency.toUpperCase()}</td>
                    <td className="px-4 py-4 text-slate-700">{purchase.status}</td>
                    <td className="px-4 py-4 text-slate-700">{formatDate(purchase.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Subscriptions</h2>
            <p className="text-sm text-slate-500">Subscription lifecycle and billing status.</p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <div className="max-h-[28rem] overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 font-medium text-slate-900">Customer</th>
                    <th className="px-4 py-3 font-medium text-slate-900">Plan</th>
                    <th className="px-4 py-3 font-medium text-slate-900">Status</th>
                    <th className="px-4 py-3 font-medium text-slate-900">Current period end</th>
                    <th className="px-4 py-3 font-medium text-slate-900">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {subscriptions.map((subscription) => (
                  <tr key={subscription._id}>
                    <td className="px-4 py-4 text-slate-700">{(subscription.customerId as any)?.email ?? 'Unknown'}</td>
                    <td className="px-4 py-4 text-slate-700">{subscription.planName}</td>
                    <td className="px-4 py-4 text-slate-700">{subscription.status}</td>
                    <td className="px-4 py-4 text-slate-700">{formatDate(subscription.currentPeriodEnd)}</td>
                    <td className="px-4 py-4 text-slate-700">{formatDate(subscription.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </section>
      </div>
    </main>
  );
}
