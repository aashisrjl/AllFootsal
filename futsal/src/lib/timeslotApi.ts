import { API } from './api';

export const getFutsalTimeslots = async (params: {
  futsalId: number | string;
  pitchId: number | string;
  dayOfWeek: number;
  date?: string;
}) => {
  const query = new URLSearchParams({
    pitch_id: String(params.pitchId),
    day_of_week: String(params.dayOfWeek),
  });
  if (params.date) query.set('date', params.date);
  const res = await API.get(`/futsal/${params.futsalId}/timeslots?${query.toString()}`);
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
