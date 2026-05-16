import Link from 'next/link';
import { ReconcileSession } from '@/components/reconcile-session';

type Props = {
  searchParams?: Promise<{ session_id?: string } | undefined>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params?.session_id;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-card">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Success</span>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">Your payment was completed</h1>
        <p className="mt-4 text-slate-600">Thanks for your order. Stripe has successfully processed your checkout.</p>
        {sessionId ? (
          <>
            <p className="mt-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">Session ID: {sessionId}</p>
            <ReconcileSession sessionId={sessionId} />
          </>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="inline-flex w-full justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto">
            Return to store
          </Link>
          <Link href="/admin" className="inline-flex w-full justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 sm:w-auto">
            View admin dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
