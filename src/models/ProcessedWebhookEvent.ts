import mongoose, { type Document, type Model } from 'mongoose';

export type ProcessedWebhookEventDocument = Document & {
  eventId: string;
  createdAt: Date;
};

const processedEventSchema = new mongoose.Schema<ProcessedWebhookEventDocument>(
  {
    eventId: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

processedEventSchema.index({ eventId: 1 }, { unique: true });

export const ProcessedWebhookEvent: Model<ProcessedWebhookEventDocument> =
  mongoose.models.ProcessedWebhookEvent || mongoose.model<ProcessedWebhookEventDocument>('ProcessedWebhookEvent', processedEventSchema);
