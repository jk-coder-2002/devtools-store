import mongoose, { type Document, type Model } from 'mongoose';

export type CustomerDocument = Document & {
  name: string;
  email: string;
  stripeCustomerId: string;
  createdAt: Date;
  updatedAt: Date;
};

const customerSchema = new mongoose.Schema<CustomerDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    stripeCustomerId: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

customerSchema.index({ email: 1 }, { unique: true });

export const Customer: Model<CustomerDocument> =
  mongoose.models.Customer || mongoose.model<CustomerDocument>('Customer', customerSchema);
