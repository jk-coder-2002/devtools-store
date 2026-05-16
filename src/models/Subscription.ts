import mongoose, { type Document, type Model } from 'mongoose';

export type SubscriptionDocument = Document & {
  customerId: mongoose.Types.ObjectId;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  planName: string;
  status: string;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
};

const subscriptionSchema = new mongoose.Schema<SubscriptionDocument>(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String, required: true },
    planName: { type: String, required: true },
    status: { type: String, required: true },
    currentPeriodEnd: { type: Date, required: true }
  },
  { timestamps: true }
);

subscriptionSchema.index({ stripeSubscriptionId: 1 }, { unique: true });

export const Subscription: Model<SubscriptionDocument> =
  mongoose.models.Subscription || mongoose.model<SubscriptionDocument>('Subscription', subscriptionSchema);
