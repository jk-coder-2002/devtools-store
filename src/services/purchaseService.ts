import { Purchase } from '@/models/Purchase';
import { dbConnect } from '@/lib/mongodb';

export async function createPurchase(params: {
  customerId: string;
  productName: string;
  stripeCheckoutSessionId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
}) {
  await dbConnect();
  return Purchase.create(params);
}

export async function findPurchaseBySession(sessionId: string) {
  await dbConnect();
  return Purchase.findOne({ stripeCheckoutSessionId: sessionId }).lean();
}

export async function updatePurchaseStatus(sessionId: string, status: 'pending' | 'succeeded' | 'failed') {
  await dbConnect();
  return Purchase.findOneAndUpdate({ stripeCheckoutSessionId: sessionId }, { status }, { new: true }).lean();
}

export async function listPurchases() {
  await dbConnect();
  return Purchase.find().sort({ createdAt: -1 }).populate('customerId').lean();
}
