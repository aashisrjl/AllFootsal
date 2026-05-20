import API from './api';

export interface PaymentConfig {
  id: number;
  futsalId: number;
  gateway: 'khalti' | 'esewa';
  publicKey: string;
  merchantCode: string;
  isActive: boolean;
  isLive: boolean;
  secretKeyMasked: string;
}

export interface CreatePaymentConfigPayload {
  gateway: 'khalti' | 'esewa';
  publicKey: string;
  secretKey: string;
  merchantCode: string;
  isLive: boolean;
}

export const getPaymentConfigs = async (gateway?: 'khalti' | 'esewa') => {
  const url = gateway ? `/futsal/payment-config/${gateway}` : `/futsal/payment-config`;
  const res = await API.get(url);
  return res.data;
};

export const createOrUpdatePaymentConfig = async (payload: CreatePaymentConfigPayload) => {
  const res = await API.post('/futsal/payment-config', payload);
  return res.data;
};

export const disablePaymentConfig = async (gateway: 'khalti' | 'esewa') => {
  const res = await API.delete(`/futsal/payment-config/${gateway}`);
  return res.data;
};
