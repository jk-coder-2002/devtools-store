import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createPurchase, updatePurchaseStatus } from '@/services/purchaseService';
import { createSubscription, findSubscriptionByStripeId, updateSubscriptionStatus } from '@/services/subscriptionService';
import { getOrCreateCustomer } from '@/services/customerService';
import { ProcessedWebhookEvent } from '@/models/ProcessedWebhookEvent';
import { dbConnect } from '@/lib/mongodb';

function isStripeCustomer(customer: Stripe.Customer | Stripe.DeletedCustomer): customer is Stripe.Customer {
  return !('deleted' in customer && customer.deleted);
}

export async function hasEventBeenProcessed(eventId: string) {
  await dbConnect();
  return ProcessedWebhookEvent.exists({ eventId });
}

export async function markEventProcessed(eventId: string) {
  await dbConnect();
  return ProcessedWebhookEvent.create({ eventId });
}

export async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  if (!session.id || !session.customer || !session.amount_total || !session.currency) {
    throw new Error('Checkout session payload missing required fields.');
  }

  const retrievedCustomer =
    typeof session.customer === 'string'
      ? await stripe.customers.retrieve(session.customer)
      : session.customer;

  if (!isStripeCustomer(retrievedCustomer)) {
    throw new Error('Stripe customer record has been deleted.');
  }

  const email = typeof retrievedCustomer.email === 'string' ? retrievedCustomer.email : undefined;

  if (!email) {
    throw new Error('Stripe customer email is required.');
  }

  const customerRecord = await getOrCreateCustomer({
    name: (retrievedCustomer.name as string) || 'Customer',
    email,
    stripeCustomerId: typeof retrievedCustomer.id === 'string' ? retrievedCustomer.id : ''
  });

  if (session.mode === 'subscription' && session.subscription) {
    const subscription = typeof session.subscription === 'string'
      ? await stripe.subscriptions.retrieve(session.subscription, { expand: ['latest_invoice'] })
      : session.subscription;

    const existingSubscription = await findSubscriptionByStripeId(subscription.id);
    if (existingSubscription) {
      return existingSubscription;
    }

    return createSubscription({
      customerId: customerRecord._id.toString(),
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerRecord.stripeCustomerId,
      planName: subscription.items.data[0]?.price.nickname || subscription.items.data[0]?.price.id || 'Subscription Plan',
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : new Date()
    });
  }

  if (session.mode === 'payment' && session.payment_intent) {
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);

    return createPurchase({
      customerId: customerRecord._id.toString(),
      productName: session.metadata?.productName || 'One-time product',
      stripeCheckoutSessionId: session.id,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount_received || paymentIntent.amount || 0,
      currency: paymentIntent.currency || 'usd',
      status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'pending'
    });
  }

  return null;
}

export async function handleInvoicePaid(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  if (!invoice.subscription || !invoice.customer) {
    return null;
  }

  const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
  const existingSubscription = await findSubscriptionByStripeId(subscriptionId);

  if (!existingSubscription) {
    const customer = typeof invoice.customer === 'string'
      ? await stripe.customers.retrieve(invoice.customer)
      : invoice.customer;

    if (!isStripeCustomer(customer)) {
      return null;
    }

    const email = typeof customer.email === 'string' ? customer.email : undefined;
    if (!email) {
      return null;
    }

    const customerRecord = await getOrCreateCustomer({
      name: (customer.name as string) || 'Customer',
      email,
      stripeCustomerId: typeof customer.id === 'string' ? customer.id : ''
    });

    const stripeSubscription = typeof invoice.subscription === 'string'
      ? await stripe.subscriptions.retrieve(invoice.subscription)
      : invoice.subscription;

    return createSubscription({
      customerId: customerRecord._id.toString(),
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: customerRecord.stripeCustomerId,
      planName: stripeSubscription.items.data[0]?.price.nickname || stripeSubscription.items.data[0]?.price.id || 'Subscription Plan',
      status: 'active',
      currentPeriodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : new Date()
    });
  }

  return updateSubscriptionStatus(subscriptionId, {
    status: 'active',
    currentPeriodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : undefined
  });
}

export async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  if (!invoice.subscription) {
    return null;
  }

  const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
  return updateSubscriptionStatus(subscriptionId, {
    status: 'past_due'
  });
}

export async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  return updateSubscriptionStatus(subscription.id, {
    status: subscription.status,
    currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : undefined
  });
}
