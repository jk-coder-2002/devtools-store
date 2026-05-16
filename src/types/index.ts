export type ProductMode = 'payment' | 'subscription';

export type ProductConfig = {
  id: string;
  title: string;
  description: string;
  priceLabel: string;
  priceIdEnv: string;
  productIdEnv?: string;
  mode: ProductMode;
  actionLabel: string;
};

export type CustomerProfile = {
  name: string;
  email: string;
};
