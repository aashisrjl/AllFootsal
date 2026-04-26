import { API } from './api';

export const getOwnerLocation = async () => {
  const res = await API.get('/futsal-location');
  return res.data;
};

export const createOwnerLocation = async (payload: Record<string, unknown>) => {
  const res = await API.post('/futsal/location/create', payload);
  return res.data;
};

export const updateOwnerLocation = async (locationId: number | string, payload: Record<string, unknown>) => {
  const res = await API.put(`/futsal/location/edit/${locationId}`, payload);
  return res.data;
};

export const getFutsalInfoById = async (futsalId: number | string) => {
  const res = await API.get(`/futsal/${futsalId}/info/`);
  return res.data;
};

export const createOwnerInfo = async (payload: Record<string, unknown>) => {
  const res = await API.post('/futsal/info/create', payload);
  return res.data;
};

export const updateOwnerInfo = async (infoId: number | string, payload: Record<string, unknown>) => {
  const res = await API.put(`/futsal/info/${infoId}`, payload);
  return res.data;
};
