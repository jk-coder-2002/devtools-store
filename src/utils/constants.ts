export const appName = 'DevTools Store';

export const CUSTOMER_PROFILES = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' }
] as const;

export const PRICES = {
  apiBoilerplate: {
    productIdEnv: 'STRIPE_PRODUCT_API_BOILERPLATE',
    priceIdEnv: 'STRIPE_PRICE_API_BOILERPLATE'
  },
  adminDashboard: {
    productIdEnv: 'STRIPE_PRODUCT_ADMIN_DASHBOARD',
    priceIdEnv: 'STRIPE_PRICE_ADMIN_DASHBOARD'
  },
  starterPlan: {
    priceIdEnv: 'STRIPE_PRICE_STARTER_PLAN'
  },
  proPlan: {
    priceIdEnv: 'STRIPE_PRICE_PRO_PLAN'
  }
} as const;

export const PRODUCTS = [
  {
    id: 'api-boilerplate-kit',
    title: 'API Boilerplate Kit',
    description: 'One-time purchase with ready-made REST and GraphQL boilerplate.',
    priceLabel: '$10',
    priceIdEnv: PRICES.apiBoilerplate.priceIdEnv,
    productIdEnv: PRICES.apiBoilerplate.productIdEnv,
    mode: 'payment' as const,
    actionLabel: 'Buy Now'
  },
  {
    id: 'admin-dashboard-template',
    title: 'Admin Dashboard Template',
    description: 'Modern dashboard UI kit for fast admin product launches.',
    priceLabel: '$20',
    priceIdEnv: PRICES.adminDashboard.priceIdEnv,
    productIdEnv: PRICES.adminDashboard.productIdEnv,
    mode: 'payment' as const,
    actionLabel: 'Buy Now'
  },
  {
    id: 'starter-plan',
    title: 'Starter Plan',
    description: 'Monthly recurring plan for small teams and early-stage projects.',
    priceLabel: '$10 / month',
    priceIdEnv: PRICES.starterPlan.priceIdEnv,
    mode: 'subscription' as const,
    actionLabel: 'Subscribe'
  },
  {
    id: 'pro-plan',
    title: 'Pro Plan',
    description: 'High-velocity plan with advanced billing and team support.',
    priceLabel: '$30 / month',
    priceIdEnv: PRICES.proPlan.priceIdEnv,
    mode: 'subscription' as const,
    actionLabel: 'Subscribe'
  }
] as const;
