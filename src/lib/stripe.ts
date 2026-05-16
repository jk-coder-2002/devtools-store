import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15"
});

export function getCheckoutUrls() {
  const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  return {
    successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${baseUrl}/cancel`
  };
}

export function enrichCustomerMetadata(customer: { name: string; email: string }) {
  return {
    name: customer.name,
    email: customer.email
  };
}
