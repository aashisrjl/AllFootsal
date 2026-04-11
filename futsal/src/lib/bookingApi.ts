import { API } from './api';

export const getOwnerBookings = async () => {
  const res = await API.get('/futsal-bookings');
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
