import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevTools Store',
  description: 'A production-ready payment storefront with Stripe, MongoDB, and admin insights.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
