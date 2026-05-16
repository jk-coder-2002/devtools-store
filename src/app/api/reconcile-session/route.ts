import type Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { findPurchaseBySession, createPurchase } from '@/services/purchaseService';
import { createSubscription, findSubscriptionByStripeId } from '@/services/subscriptionService';
import { getOrCreateCustomer } from '@/services/customerService';

function isStripeCustomer(customer: Stripe.Customer | Stripe.DeletedCustomer): customer is Stripe.Customer {
  return !('deleted' in customer && customer.deleted);
}

export async function POST(request: Request) {
  const body = await request.json();
  const sessionId = body?.sessionId;

  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['customer', 'payment_intent', 'subscription']
  });

  if (session.status !== 'complete') {
    return NextResponse.json({ error: 'Checkout session is not complete yet.' }, { status: 400 });
  }

  const customer = typeof session.customer === 'string' ? null : session.customer;
  const paymentIntent = typeof session.payment_intent === 'string' ? null : session.payment_intent;
  const subscription = typeof session.subscription === 'string' ? null : session.subscription;

  if (!customer || !isStripeCustomer(customer) || !customer.email) {
    return NextResponse.json({ error: 'Unable to retrieve customer details.' }, { status: 400 });
  }

  const customerRecord = await getOrCreateCustomer({
    name: customer.name || 'Customer',
    email: customer.email,
    stripeCustomerId: typeof customer.id === 'string' ? customer.id : ''
  });

  if (session.mode === 'payment') {
    if (!paymentIntent || !paymentIntent.id) {
      return NextResponse.json({ error: 'Unable to retrieve payment intent details.' }, { status: 400 });
    }

    const existingPurchase = await findPurchaseBySession(sessionId);
    if (existingPurchase) {
      return NextResponse.json({ created: false, message: 'Purchase already exists.' });
    }

    await createPurchase({
      customerId: customerRecord._id.toString(),
      productName: session.metadata?.productName || 'One-time product',
      stripeCheckoutSessionId: session.id,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount_received || paymentIntent.amount || 0,
      currency: paymentIntent.currency || 'usd',
      status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'pending'
    });

    return NextResponse.json({ created: true, message: 'Purchase reconciled successfully.' });
  }

  if (session.mode === 'subscription') {
    if (!subscription || !subscription.id) {
      return NextResponse.json({ error: 'Unable to retrieve subscription details.' }, { status: 400 });
    }

    const existingSubscription = await findSubscriptionByStripeId(subscription.id);
    if (existingSubscription) {
      return NextResponse.json({ created: false, message: 'Subscription already exists.' });
    }

    await createSubscription({
      customerId: customerRecord._id.toString(),
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerRecord.stripeCustomerId,
      planName: subscription.items.data[0]?.price.nickname || subscription.items.data[0]?.price.id || 'Subscription Plan',
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : new Date()
    });

    return NextResponse.json({ created: true, message: 'Subscription reconciled successfully.' });
  }

  return NextResponse.json({ error: 'Unsupported checkout mode.' }, { status: 400 });
}
