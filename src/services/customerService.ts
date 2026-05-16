import { Customer } from '@/models/Customer';
import { dbConnect } from '@/lib/mongodb';

export async function findCustomerByEmail(email: string) {
  await dbConnect();
  return Customer.findOne({ email }).lean();
}

export async function createCustomer(params: { name: string; email: string; stripeCustomerId: string }) {
  await dbConnect();
  const customer = await Customer.create(params);
  return customer.toObject();
}

export async function getOrCreateCustomer(params: { name: string; email: string; stripeCustomerId: string }) {
  await dbConnect();
  const normalizedEmail = params.email.toLowerCase();
  const existing = await Customer.findOne({ email: normalizedEmail });

  if (existing) {
    if (!existing.stripeCustomerId && params.stripeCustomerId) {
      existing.stripeCustomerId = params.stripeCustomerId;
      await existing.save();
    }
    return existing.toObject();
  }

  const customer = await Customer.create({
    ...params,
    email: normalizedEmail
  });
  return customer.toObject();
}

export async function updateCustomerStripeId(email: string, stripeCustomerId: string) {
  await dbConnect();
  return Customer.findOneAndUpdate(
    { email: email.toLowerCase() },
    { stripeCustomerId },
    { new: true }
  ).lean();
}

export async function listCustomers() {
  await dbConnect();
  return Customer.find().sort({ createdAt: -1 }).lean();
}
