import { z } from 'zod';

export const webhookHeadersSchema = z.object({
  'stripe-signature': z.string().min(1)
});

export type WebhookHeaders = z.infer<typeof webhookHeadersSchema>;
