import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),
  STRIPE_PRODUCT_API_BOILERPLATE: z.string().min(1),
  STRIPE_PRODUCT_ADMIN_DASHBOARD: z.string().min(1),
  STRIPE_PRICE_API_BOILERPLATE: z.string().min(1),
  STRIPE_PRICE_ADMIN_DASHBOARD: z.string().min(1),
  STRIPE_PRICE_STARTER_PLAN: z.string().min(1),
  STRIPE_PRICE_PRO_PLAN: z.string().min(1)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errorDetails = parsed.error.errors.map((error) => `${error.path.join('.')}: ${error.message}`).join(', ');
  throw new Error(`Invalid environment configuration: ${errorDetails}`);
}

export const env = parsed.data;
