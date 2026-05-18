import { API } from './api';

export const getOwnerBookings = async () => {
  const res = await API.get('/futsal-bookings');
  return res.data;
};

export const getOwnerBookingById = async (bookingId: number | string) => {
  const res = await API.get(`/futsal/bookings/${bookingId}`);
  return res.data;
};

export const cancelOwnerBooking = async (bookingId: number | string) => {
  const res = await API.patch(`/futsal/bookings/${bookingId}/cancel`);
  return res.data;
};

export const confirmOwnerBooking = async (bookingId: number | string) => {
  const res = await API.patch(`/futsal/bookings/${bookingId}/confirm`);
  return res.data;
};

export const unconfirmOwnerBooking = async (bookingId: number | string) => {
  const res = await API.patch(`/futsal/bookings/${bookingId}/unconfirm`);
  return res.data;
};

export const rejectOwnerBooking = async (bookingId: number | string, reason?: string) => {
  const res = await API.patch(`/futsal/bookings/${bookingId}/reject`, { reason });
  return res.data;
};

export type OfflineBookingPayload = {
  /** Prefer offline_phone / offline_username; phoneNumber & customerName kept for form compatibility */
  offline_phone?: string;
  offline_username?: string;
  phoneNumber?: string;
  customerName?: string;
  pitch_id: number;
  timeslot_id: number;
  booking_date: string;
  amount: number;
  description?: string;
  status?: 'pending' | 'confirmed' | 'completed';
};

export const createOfflineBooking = async (payload: OfflineBookingPayload) => {
  const res = await API.post('/futsal/bookings/offline', payload);
  return res.data;
};
