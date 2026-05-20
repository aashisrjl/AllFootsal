import API from './api';

export interface CustomDomain {
  id: number;
  futsalId: number;
  domain: string;
  isVerified: boolean;
  isPrimary: boolean;
  verificationStatus: 'pending' | 'verified' | 'failed';
  dnsRecords?: Array<{
    type: string;
    name: string;
    value: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AddCustomDomainPayload {
  domain: string;
}

export const getCustomDomains = async () => {
  const res = await API.get('/futsal/custom-domains');
  return res.data;
};

export const addCustomDomain = async (payload: AddCustomDomainPayload) => {
  const res = await API.post('/futsal/custom-domains', payload);
  return res.data;
};

export const verifyCustomDomain = async (domainId: number) => {
  const res = await API.post(`/futsal/custom-domains/${domainId}/verify`);
  return res.data;
};

export const setPrimaryDomain = async (domainId: number) => {
  const res = await API.patch(`/futsal/custom-domains/${domainId}/primary`);
  return res.data;
};

export const deleteCustomDomain = async (domainId: number) => {
  const res = await API.delete(`/futsal/custom-domains/${domainId}`);
  return res.data;
};
