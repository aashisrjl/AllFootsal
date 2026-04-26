import { API } from './api';

export const getFutsalPitches = async (futsalId: number | string) => {
  const res = await API.get(`/futsal/${futsalId}/pitches`);
  return res.data;
};

export const createPitch = async (payload: Record<string, unknown>) => {
  const res = await API.post('/futsal/pitches/create', payload);
  return res.data;
};

export const updatePitch = async (pitchId: number | string, payload: Record<string, unknown>) => {
  const res = await API.put(`/futsal/pitches/edit/${pitchId}`, payload);
  return res.data;
};
