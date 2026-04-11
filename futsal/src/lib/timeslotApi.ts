import { API } from './api';

export const getFutsalTimeslots = async (params: { futsalId: number | string; pitchId: number | string; dayOfWeek: number }) => {
  const res = await API.get(`/futsal/${params.futsalId}/timeslots?pitch_id=${params.pitchId}&day_of_week=${params.dayOfWeek}`);
  return res.data;
};

export const createTimeslot = async (payload: Record<string, unknown>) => {
  const res = await API.post('/futsal/timeslots/create', payload);
  return res.data;
};

export const deleteTimeslot = async (timeslotId: number | string) => {
  const res = await API.delete(`/futsal/timeslots/delete/${timeslotId}`);
  return res.data;
};
