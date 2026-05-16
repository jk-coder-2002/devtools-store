import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { env } from '@/lib/env';
import type Stripe from 'stripe';
import {
  handleCheckoutSessionCompleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  handleSubscriptionDeleted,
  hasEventBeenProcessed,
  markEventProcessed
} from '@/services/webhookService';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new NextResponse('Missing Stripe signature header.', { status: 400 });
  }

  const rawBody = await request.arrayBuffer();
  const payload = Buffer.from(rawBody);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return new NextResponse(`Webhook signature verification failed: ${(error as Error).message}`, { status: 400 });
  }

  if (await hasEventBeenProcessed(event.id)) {
    return new NextResponse('Event already processed.', { status: 200 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;
      default:
        break;
    }

    await markEventProcessed(event.id);
    return new NextResponse('Webhook received.', { status: 200 });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return new NextResponse(`Webhook processing failed: ${(error as Error).message}`, { status: 500 });
  }
}
