import { API } from './api';

export const loginFutsal = async (credentials: { email: string; password: string }) => {
  const res = await API.post('/auth/futsal/login', credentials);
  return res.data;
};

export const logoutFutsal = async () => {
  const res = await API.post('/auth/logout');
  return res.data;
};

export const getFutsalProfile = async () => {
  const res = await API.get('/futsals-profile');
  return res.data;
};

export const updateFutsalProfile = async (payload: { ownerName?: string; email?: string; phoneNumber?: string }) => {
  const res = await API.patch('/futsals-profile', payload);
  return res.data;
};
