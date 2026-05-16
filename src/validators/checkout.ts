import { z } from 'zod';

const productIds = ['api-boilerplate-kit', 'admin-dashboard-template', 'starter-plan', 'pro-plan'] as const;

export const checkoutPayloadSchema = z.object({
  productId: z.enum(productIds),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  mode: z.enum(['payment', 'subscription'])
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
