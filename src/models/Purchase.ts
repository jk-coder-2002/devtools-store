import mongoose, { type Document, type Model } from 'mongoose';

export type PurchaseDocument = Document & {
  customerId: mongoose.Types.ObjectId;
  productName: string;
  stripeCheckoutSessionId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: Date;
  updatedAt: Date;
};

const purchaseSchema = new mongoose.Schema<PurchaseDocument>(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    productName: { type: String, required: true },
    stripeCheckoutSessionId: { type: String, required: true, unique: true },
    paymentIntentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'succeeded', 'failed'], default: 'pending' }
  },
  { timestamps: true }
);

purchaseSchema.index({ stripeCheckoutSessionId: 1 }, { unique: true });

export const Purchase: Model<PurchaseDocument> =
  mongoose.models.Purchase || mongoose.model<PurchaseDocument>('Purchase', purchaseSchema);
