import { API } from './api';

export type PaymentMethod = 'esewa' | 'khalti' | 'cash' | 'bank_transfer';

export const getOwnerPayments = async () => {
  const res = await API.get('/futsal/payment');
  return res.data;
};

export const createOwnerPayment = async (paymentMethod: PaymentMethod) => {
  const res = await API.post('/futsal/payment-create', { payment_method: paymentMethod });
  return res.data;
};

export const verifyOwnerPayment = async (payload: Record<string, unknown>) => {
  const res = await API.post('/futsal/payment-verify', payload);
  return res.data;
};
