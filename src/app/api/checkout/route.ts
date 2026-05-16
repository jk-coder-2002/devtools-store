import { NextResponse } from 'next/server';
import { stripe, getCheckoutUrls } from '@/lib/stripe';
import { env } from '@/lib/env';
import { checkoutPayloadSchema } from '@/validators/checkout';
import { findCustomerByEmail, getOrCreateCustomer, updateCustomerStripeId } from '@/services/customerService';
import { PRODUCTS } from '@/utils/constants';

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = checkoutPayloadSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
  }

  const { customerEmail, customerName, productId, mode } = parseResult.data;
  const product = PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const priceId = env[product.priceIdEnv as keyof typeof env];

  if (!priceId) {
    return NextResponse.json({ error: 'Stripe price ID is not configured.' }, { status: 500 });
  }

  const existingCustomer = await findCustomerByEmail(customerEmail);
  let stripeCustomerId = existingCustomer?.stripeCustomerId;

  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email: customerEmail,
      name: customerName
    });

    if (!stripeCustomer.id) {
      return NextResponse.json({ error: 'Failed to create Stripe customer.' }, { status: 500 });
    }

    stripeCustomerId = stripeCustomer.id;

    if (existingCustomer) {
      await updateCustomerStripeId(customerEmail, stripeCustomerId);
    }
  }

  const customerRecord = await getOrCreateCustomer({
    name: customerName,
    email: customerEmail,
    stripeCustomerId
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode,
    customer: customerRecord.stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: getCheckoutUrls().successUrl,
    cancel_url: getCheckoutUrls().cancelUrl,
    metadata: {
      customerEmail,
      customerName,
      productName: product.title,
      mode
    }
  });

  if (!session.url) {
    return NextResponse.json({ error: 'Stripe checkout session did not return a URL.' }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
