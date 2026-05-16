# DevTools Store

A full-stack payment application built with Next.js App Router, TypeScript, Tailwind CSS, MongoDB, Mongoose, Stripe test mode, and Zod validation.

## Features

- Homepage with one-time and subscription products
- Stripe Checkout integration for payment and subscription flows
- Secure webhook processing with duplicate prevention
- MongoDB-backed customers, purchases, subscriptions, and processed webhook events
- Responsive admin dashboard
- Vercel deployment compatible

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env` using `.env.example`

3. Run local development server

```bash
npm run dev
```

4. Start Stripe CLI webhook forwarding

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## Environment Variables

Copy `.env.example` and set your values:

- `MONGODB_URI`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_PRODUCT_API_BOILERPLATE`
- `STRIPE_PRODUCT_ADMIN_DASHBOARD`
- `STRIPE_PRICE_API_BOILERPLATE`
- `STRIPE_PRICE_ADMIN_DASHBOARD`
- `STRIPE_PRICE_STARTER_PLAN`
- `STRIPE_PRICE_PRO_PLAN`

## Stripe Test Flow

- Use Stripe Dashboard to create products and prices
- Set the Price IDs into environment variables
- Use the homepage customer selector to create sessions for Alice or Bob
- Review webhook events in Stripe CLI and local logs

## Notes

- All Stripe calls are server-side.
- Webhooks verify the Stripe signature and persist processed event IDs.
- The admin dashboard reads from MongoDB and exposes customer, purchase, and subscription data.
