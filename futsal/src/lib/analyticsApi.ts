import { API } from './api';

export const getOwnerAnalytics = async () => {
  const res = await API.get('/futsal/analytics/fetch');
  return res.data;
};
