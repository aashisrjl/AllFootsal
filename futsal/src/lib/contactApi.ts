import { API } from './api';

export const getContactMessages = async () => {
  const res = await API.get('/futsal/contact');
  return res.data;
};

export const markContactAsRead = async (contactId: number | string) => {
  const res = await API.patch(`/futsal/contact/${contactId}/read`);
  return res.data;
};

export const deleteContactMessage = async (contactId: number | string) => {
  const res = await API.delete(`/futsal/contact/${contactId}`);
  return res.data;
};
