import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { env } from '@/lib/env';
import { findCustomerByEmail } from '@/services/customerService';

export async function POST(request: Request) {
  const body = await request.json();
  const customerEmail = body?.customerEmail;

  if (!customerEmail || typeof customerEmail !== 'string') {
    return NextResponse.json({ error: 'customerEmail is required.' }, { status: 400 });
  }

  const customer = await findCustomerByEmail(customerEmail.toLowerCase());

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  }

  if (!customer.stripeCustomerId) {
    return NextResponse.json({ error: 'Stripe customer is not linked.' }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripeCustomerId,
    return_url: env.NEXT_PUBLIC_APP_URL
  });

  return NextResponse.json({ url: session.url });
}
