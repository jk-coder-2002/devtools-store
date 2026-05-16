import { Subscription } from '@/models/Subscription';
import { dbConnect } from '@/lib/mongodb';

export async function createSubscription(params: {
  customerId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  planName: string;
  status: string;
  currentPeriodEnd: Date;
}) {
  await dbConnect();
  return Subscription.create(params);
}

export async function findSubscriptionByStripeId(stripeSubscriptionId: string) {
  await dbConnect();
  return Subscription.findOne({ stripeSubscriptionId }).lean();
}

export async function updateSubscriptionStatus(stripeSubscriptionId: string, data: { status: string; currentPeriodEnd?: Date }) {
  await dbConnect();
  return Subscription.findOneAndUpdate(
    { stripeSubscriptionId },
    {
      status: data.status,
      ...(data.currentPeriodEnd ? { currentPeriodEnd: data.currentPeriodEnd } : {})
    },
    { new: true }
  ).lean();
}

export async function listSubscriptions() {
  await dbConnect();
  return Subscription.find().sort({ createdAt: -1 }).populate('customerId').lean();
}
