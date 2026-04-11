import { API } from './api';

export type SubscriptionPlan = 'trial' | 'monthly' | 'half-yearly' | 'yearly';

export const getOwnerSubscription = async () => {
  const res = await API.get('/subscription');
  return res.data;
};

export const createOwnerSubscription = async (subscriptionPlan: SubscriptionPlan) => {
  const res = await API.post('/subscription/create', { subscription_plan: subscriptionPlan });
  return res.data;
};
