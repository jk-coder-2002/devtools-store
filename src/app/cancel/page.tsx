import Link from 'next/link';

export default function CancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-card">
        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">Cancelled</span>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">Checkout was cancelled</h1>
        <p className="mt-4 text-slate-600">Your session was not completed. You can return to the store to try again.</p>
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
